/**
 * Notion Content Fetcher
 *
 * This script fetches content from Notion databases and converts it to static JSON files.
 * It runs at build time to generate content for the website.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const readingTime = require('reading-time');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Database IDs from environment variables
const BLOG_DATABASE_ID = process.env.BLOG_DATABASE_ID;
const RECIPE_DATABASE_ID = process.env.RECIPE_DATABASE_ID;
const INGREDIENT_DATABASE_ID = process.env.INGREDIENT_DATABASE_ID;
const RECIPE_INGREDIENT_DATABASE_ID = process.env.RECIPE_INGREDIENT_DATABASE_ID;
const MEALPREP_PAGE_ID = process.env.MEALPREP_PAGE_ID;

// Output directories
const DATA_DIR = path.join(__dirname, '../src/data/notion');
const IMAGES_DIR = path.join(__dirname, '../public/images/notion');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Delays execution for rate limiting (Notion API: 3 requests/second)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Downloads an image from a URL and saves it locally
 * @param {string} url - The URL of the image
 * @param {string} filename - The local filename to save
 * @returns {Promise<string>} - The local path to the image
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const filepath = path.join(IMAGES_DIR, filename);
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(`/images/notion/${filename}`);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete the file
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete the file
      reject(err);
    });
  });
}

/**
 * Generates a slug from a title
 * @param {string} title - The title to convert
 * @returns {string} - URL-friendly slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts text from Notion rich text property
 * @param {Array} richText - Notion rich text array
 * @returns {string} - Plain text
 */
function extractPlainText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(rt => rt.plain_text).join('');
}

/**
 * Extracts page ID from Notion URL
 * @param {string} url - Notion page URL
 * @returns {string} - Page ID
 */
function extractPageIdFromUrl(url) {
  if (!url) return '';
  // Notion URLs format: https://www.notion.so/workspace/PAGE_ID or collection://PAGE_ID
  const match = url.match(/([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  return match ? match[0].replace(/-/g, '') : '';
}

/**
 * Parses Notion relation field to array of page IDs
 * @param {Array} relationField - Notion relation property value (array of {id: string})
 * @returns {Array<string>} - Array of page IDs
 */
function parseNotionRelation(relationField) {
  if (!relationField || !Array.isArray(relationField)) return [];
  return relationField.map(item => item.id);
}

/**
 * Parses single Notion relation field to page ID
 * @param {Array} relationField - Notion relation property value (array with single {id: string})
 * @returns {string|null} - Single page ID or null
 */
function parseNotionSingleRelation(relationField) {
  if (!relationField || !Array.isArray(relationField) || relationField.length === 0) {
    return null;
  }
  return relationField[0].id || null;
}

/**
 * Extracts the title property from a Notion page regardless of the property name
 * @param {Object|null} page - Notion page object
 * @param {string} fallback - Fallback title to use if none found
 * @returns {string} - Title text
 */
function extractPageTitle(page, fallback = '') {
  if (!page || !page.properties) {
    return fallback;
  }

  for (const property of Object.values(page.properties)) {
    if (property?.type === 'title' && Array.isArray(property.title)) {
      const titleText = extractPlainText(property.title);
      if (titleText) {
        return titleText;
      }
    }
  }

  return fallback;
}

/**
 * Fetches a Notion page by ID
 * @param {string} pageId - The Notion page ID
 * @returns {Promise<Object>} - The page object
 */
async function fetchNotionPage(pageId) {
  try {
    await delay(350); // Rate limiting
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error.message);
    return null;
  }
}

/**
 * Converts markdown content into a short excerpt
 * @param {string} markdown - Markdown content
 * @param {number} length - Desired excerpt length
 * @returns {string} - Plain text excerpt
 */
function generateExcerptFromMarkdown(markdown, length = 160) {
  if (!markdown) {
    return '';
  }

  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`[^`]*`/g, '') // remove inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // remove images entirely
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1') // replace links with link text
    .replace(/[*_>#\-]+/g, ' ') // remove markdown characters
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();

  return plainText.slice(0, length).trim();
}

/**
 * Processes Notion blocks and downloads any images
 * @param {string} pageId - The Notion page ID
 * @param {string} slug - The slug for naming images
 * @returns {Promise<Object>} - Markdown content and image mappings
 */
async function processPageContent(pageId, slug) {
  try {
    // Get markdown blocks
    const mdblocks = await n2m.pageToMarkdown(pageId);
    let markdown = n2m.toMarkdownString(mdblocks).parent;

    // Find and download images
    const imageRegex = /!\[.*?\]\((https:\/\/.*?)\)/g;
    let match;
    let imageIndex = 0;
    const imageMap = {};

    while ((match = imageRegex.exec(markdown)) !== null) {
      const imageUrl = match[1];
      const imageExt = path.extname(new URL(imageUrl).pathname) || '.png';
      const filename = `${slug}-${imageIndex}${imageExt}`;

      try {
        const localPath = await downloadImage(imageUrl, filename);
        imageMap[imageUrl] = localPath;
        markdown = markdown.replace(imageUrl, localPath);
        imageIndex++;
        await delay(100); // Small delay between image downloads
      } catch (err) {
        console.error(`Failed to download image: ${imageUrl}`, err.message);
      }
    }

    return { markdown, imageMap };
  } catch (error) {
    console.error(`Error processing content for page ${pageId}:`, error.message);
    return { markdown: '', imageMap: {} };
  }
}

/**
 * Fetches all ingredients from Ingredient database
 * @returns {Promise<Map>} - Map of ingredient ID to ingredient data
 */
async function fetchAllIngredients() {
  if (!INGREDIENT_DATABASE_ID) {
    console.log('Skipping ingredients fetch - INGREDIENT_DATABASE_ID not set');
    return new Map();
  }

  console.log('Fetching all ingredients...');

  try {
    const response = await notion.databases.query({
      database_id: INGREDIENT_DATABASE_ID
    });

    const ingredientsMap = new Map();

    for (const page of response.results) {
      const props = page.properties;
      const ingredientData = {
        id: page.id,
        name: extractPlainText(props.Name?.title),
        description: extractPlainText(props.Description?.rich_text),
        brand: props.Brand?.select?.name || null,
        inPantry: props['In Pantry']?.checkbox || false
      };
      ingredientsMap.set(page.id, ingredientData);
    }

    console.log(`Fetched ${ingredientsMap.size} ingredients`);
    return ingredientsMap;
  } catch (error) {
    console.error('Error fetching ingredients:', error.message);
    return new Map();
  }
}

/**
 * Fetches all recipe-ingredients from RecipeIngredient junction database
 * @returns {Promise<Map>} - Map of recipe-ingredient ID to recipe-ingredient data
 */
async function fetchAllRecipeIngredients() {
  if (!RECIPE_INGREDIENT_DATABASE_ID) {
    console.log('Skipping recipe-ingredients fetch - RECIPE_INGREDIENT_DATABASE_ID not set');
    return new Map();
  }

  console.log('Fetching all recipe-ingredients...');

  try {
    const response = await notion.databases.query({
      database_id: RECIPE_INGREDIENT_DATABASE_ID
    });

    const recipeIngredientsMap = new Map();

    for (const page of response.results) {
      const props = page.properties;
      const recipeIngredientData = {
        id: page.id,
        recipeId: parseNotionSingleRelation(props.Recipe?.relation),
        ingredientId: parseNotionSingleRelation(props['Ingredient Database']?.relation),
        quantity: props.Quantity?.number || null,
        unit: props.Unit?.select?.name || null,
        purpose: extractPlainText(props.Purpose?.rich_text),
        instructions: extractPlainText(props.Instructions?.rich_text),
        optional: props.Optional?.checkbox || false,
        display: props.Display?.formula?.string || null
      };
      recipeIngredientsMap.set(page.id, recipeIngredientData);
    }

    console.log(`Fetched ${recipeIngredientsMap.size} recipe-ingredients`);
    return recipeIngredientsMap;
  } catch (error) {
    console.error('Error fetching recipe-ingredients:', error.message);
    return new Map();
  }
}

/**
 * Builds ingredient details for a recipe using local data
 * @param {Array<string>} recipeIngredientIds - Array of RecipeIngredient page IDs
 * @param {Map} recipeIngredientsMap - Map of all recipe-ingredients
 * @param {Map} ingredientsMap - Map of all ingredients
 * @returns {Array} - Array of ingredient objects with details
 */
function buildRecipeIngredients(recipeIngredientIds, recipeIngredientsMap, ingredientsMap) {
  if (!recipeIngredientIds || recipeIngredientIds.length === 0) {
    return [];
  }

  const ingredientsWithDetails = [];

  for (const riPageId of recipeIngredientIds) {
    if (!riPageId) continue;

    const riData = recipeIngredientsMap.get(riPageId);
    if (!riData) continue;

    const ingredientData = riData.ingredientId ? ingredientsMap.get(riData.ingredientId) : null;

    ingredientsWithDetails.push({
      id: riData.id,
      name: ingredientData?.name || 'Unknown Ingredient',
      quantity: riData.quantity,
      unit: riData.unit,
      brand: ingredientData?.brand || null,
      description: ingredientData?.description || '',
      instructions: riData.instructions,
      purpose: riData.purpose,
      optional: riData.optional,
      inPantry: ingredientData?.inPantry || false,
      display: riData.display
    });
  }

  return ingredientsWithDetails;
}

/**
 * Fetches and processes blog posts from Notion
 * @returns {Promise<Array>} - Array of blog post objects
 */
async function fetchBlogPosts() {
  console.log('Fetching blog posts...');

  try {
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    });

    const posts = [];

    for (const page of response.results) {
      await delay(350); // Rate limiting: ~3 requests per second

      const props = page.properties;

      // Extract properties
      const title = extractPlainText(props.Title?.title);
      const slug = props.Slug?.rich_text?.[0]?.plain_text || generateSlug(title);
      const date = props.Date?.date?.start || new Date().toISOString();
      const excerpt = extractPlainText(props.Excerpt?.rich_text);
      const author = extractPlainText(props.Author?.rich_text) || 'Anonymous';
      const category = props.Category?.select?.name || 'Uncategorized';
      const tags = props.Tags?.multi_select?.map(tag => tag.name) || [];
      const featured = props.Featured?.checkbox || false;
      const readTimeMinutes = props.ReadTime?.number || null;

      // Get page content
      console.log(`Processing blog post: ${title}`);
      const { markdown } = await processPageContent(page.id, slug);
      console.log(`  Content length: ${markdown?.length || 0} characters`);

      // Calculate reading time if not provided
      const calculatedReadTime = readTimeMinutes || (markdown ? Math.ceil(readingTime(markdown).minutes) : 1);

      posts.push({
        id: page.id,
        title,
        slug,
        date,
        excerpt,
        author,
        category,
        tags,
        featured,
        readTime: calculatedReadTime,
        content: markdown || '',
        lastUpdated: page.last_edited_time
      });
    }

    console.log(`Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
    return [];
  }
}

/**
 * Fetches and processes recipes from Notion
 * @param {Map} recipeIngredientsMap - Map of all recipe-ingredients
 * @param {Map} ingredientsMap - Map of all ingredients
 * @returns {Promise<Array>} - Array of recipe objects
 */
async function fetchRecipes(recipeIngredientsMap, ingredientsMap) {
  console.log('Fetching recipes...');

  try {
    const response = await notion.databases.query({
      database_id: RECIPE_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          },
          {
            property: 'Name',
            title: {
              is_not_empty: true
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    });

    const recipes = [];

    for (const page of response.results) {
      await delay(350); // Rate limiting

      const props = page.properties;

      // Extract properties
      const name = extractPlainText(props.Name?.title);
      const slug = generateSlug(name);
      const description = extractPlainText(props.Description?.rich_text);
      const prepTime = props.PrepTime?.number || 0;
      const cookTime = props.CookTime?.number || 0;
      const ovenTemp = props['OvenTemp (F)']?.number || null;
      const category = props.Category?.select?.name || 'Other';
      const difficulty = props.Difficulty?.select?.name || 'Medium';
      const servings = props.Servings?.number || 1;
      const tags = props.Tags?.multi_select?.map(tag => tag.name) || [];
      const favorite = props.Favorite?.checkbox || false;

      // Extract hero image URL if present
      let heroImg = null;
      if (props.heroImg?.files && props.heroImg.files.length > 0) {
        const heroFile = props.heroImg.files[0];
        heroImg = heroFile.file?.url || heroFile.external?.url || null;
      }

      // Get page content (includes ingredients and instructions)
      console.log(`Processing recipe: ${name}`);
      const { markdown } = await processPageContent(page.id, slug);

      // Build structured ingredients from local data (no API calls)
      const recipeIngredientIds = parseNotionRelation(props.RecipeIngredient?.relation);
      console.log(`  Building ${recipeIngredientIds.length} ingredients from local data...`);

      const ingredients = buildRecipeIngredients(recipeIngredientIds, recipeIngredientsMap, ingredientsMap);
      console.log(`  Built ${ingredients.length} ingredients with details`);

      recipes.push({
        id: page.id,
        name,
        slug,
        description,
        prepTime,
        cookTime,
        totalTime: prepTime + cookTime,
        ovenTemp,
        category,
        difficulty,
        servings,
        tags,
        favorite,
        content: markdown,
        ingredients,
        heroImg,
        lastUpdated: page.last_edited_time
      });
    }

    console.log(`Fetched ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
    return [];
  }
}

/**
 * Fetches and processes the meal prep standalone page from Notion
 * @returns {Promise<Object|null>} - Page data or null if unavailable
 */
async function fetchMealPrepPage() {
  if (!MEALPREP_PAGE_ID) {
    console.log('Skipping meal prep page fetch - MEALPREP_PAGE_ID not set');
    return null;
  }

  console.log('Fetching meal prep page...');

  const page = await fetchNotionPage(MEALPREP_PAGE_ID);
  if (!page) {
    console.log('Meal prep page not found or not accessible.');
    return null;
  }

  const slug = 'meal-prep';
  const fallbackTitle = 'Meal Prep';
  const title = extractPageTitle(page, fallbackTitle) || fallbackTitle;
  const { markdown } = await processPageContent(MEALPREP_PAGE_ID, slug);

  const excerpt = generateExcerptFromMarkdown(markdown);

  return {
    id: page.id,
    title,
    slug,
    content: markdown || '',
    excerpt,
    lastUpdated: page.last_edited_time
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('Starting Notion content fetch...');
  console.log('='.repeat(50));

  // Check for required environment variables
  if (!process.env.NOTION_API_KEY) {
    console.error('ERROR: NOTION_API_KEY environment variable is not set');
    process.exit(1);
  }

  if (!BLOG_DATABASE_ID) {
    console.error('ERROR: BLOG_DATABASE_ID environment variable is not set');
    process.exit(1);
  }

  if (!RECIPE_DATABASE_ID) {
    console.error('ERROR: RECIPE_DATABASE_ID environment variable is not set');
    process.exit(1);
  }

  // Note: INGREDIENT_DATABASE_ID and RECIPE_INGREDIENT_DATABASE_ID are optional
  // If not provided, recipes will still be fetched but without structured ingredient data

  console.log('Environment variables loaded:');
  console.log('- NOTION_API_KEY:', process.env.NOTION_API_KEY ? '✓ Set' : '✗ Not set');
  console.log('- BLOG_DATABASE_ID:', BLOG_DATABASE_ID);
  console.log('- RECIPE_DATABASE_ID:', RECIPE_DATABASE_ID);
  console.log('- INGREDIENT_DATABASE_ID:', INGREDIENT_DATABASE_ID || '(optional - not set)');
  console.log('- RECIPE_INGREDIENT_DATABASE_ID:', RECIPE_INGREDIENT_DATABASE_ID || '(optional - not set)');
  console.log('- MEALPREP_PAGE_ID:', MEALPREP_PAGE_ID || '(optional - not set)');
  console.log('='.repeat(50));

  try {
    // Fetch all ingredients and recipe-ingredients first (optimization)
    const ingredientsMap = await fetchAllIngredients();
    const recipeIngredientsMap = await fetchAllRecipeIngredients();

    // Fetch content sequentially to better isolate errors
    const blogPosts = await fetchBlogPosts();
    const recipes = await fetchRecipes(recipeIngredientsMap, ingredientsMap);
    const mealPrepPage = await fetchMealPrepPage();

    // Create metadata
    const metadata = {
      lastFetched: new Date().toISOString(),
      blogPostCount: blogPosts.length,
      recipeCount: recipes.length,
      ingredientCount: ingredientsMap.size,
      recipeIngredientCount: recipeIngredientsMap.size,
      totalItems: blogPosts.length + recipes.length,
      mealPrepPageAvailable: Boolean(mealPrepPage && mealPrepPage.content)
    };

    // Write JSON files
    fs.writeFileSync(
      path.join(DATA_DIR, 'blog-posts.json'),
      JSON.stringify(blogPosts, null, 2)
    );
    console.log(`✓ Saved ${blogPosts.length} blog posts to blog-posts.json`);

    fs.writeFileSync(
      path.join(DATA_DIR, 'recipes.json'),
      JSON.stringify(recipes, null, 2)
    );
    console.log(`✓ Saved ${recipes.length} recipes to recipes.json`);

    // Save ingredients and recipe-ingredients for reference (optional)
    fs.writeFileSync(
      path.join(DATA_DIR, 'ingredients.json'),
      JSON.stringify(Array.from(ingredientsMap.values()), null, 2)
    );
    console.log(`✓ Saved ${ingredientsMap.size} ingredients to ingredients.json`);

    fs.writeFileSync(
      path.join(DATA_DIR, 'recipe-ingredients.json'),
      JSON.stringify(Array.from(recipeIngredientsMap.values()), null, 2)
    );
    console.log(`✓ Saved ${recipeIngredientsMap.size} recipe-ingredients to recipe-ingredients.json`);

    fs.writeFileSync(
      path.join(DATA_DIR, 'meal-prep.json'),
      JSON.stringify(mealPrepPage || { title: 'Meal Prep', slug: 'meal-prep', content: '', excerpt: '' }, null, 2)
    );
    if (mealPrepPage?.content) {
      console.log('✓ Saved meal prep page to meal-prep.json');
    } else {
      console.log('⚠️ Meal prep page not saved with content (missing or empty). Placeholder written instead.');
    }

    fs.writeFileSync(
      path.join(DATA_DIR, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    console.log(`✓ Saved metadata to metadata.json`);

    console.log('='.repeat(50));
    console.log('✓ Content fetch completed successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
