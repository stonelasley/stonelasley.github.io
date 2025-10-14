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
 * @returns {Promise<Array>} - Array of recipe objects
 */
async function fetchRecipes() {
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
      const category = props.Category?.select?.name || 'Other';
      const difficulty = props.Difficulty?.select?.name || 'Medium';
      const servings = props.Servings?.number || 1;
      const tags = props.Tags?.multi_select?.map(tag => tag.name) || [];
      const favorite = props.Favorite?.checkbox || false;

      // Get page content (includes ingredients and instructions)
      console.log(`Processing recipe: ${name}`);
      const { markdown } = await processPageContent(page.id, slug);

      recipes.push({
        id: page.id,
        name,
        slug,
        description,
        prepTime,
        cookTime,
        totalTime: prepTime + cookTime,
        category,
        difficulty,
        servings,
        tags,
        favorite,
        content: markdown,
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

  console.log('Environment variables loaded:');
  console.log('- NOTION_API_KEY:', process.env.NOTION_API_KEY ? '✓ Set' : '✗ Not set');
  console.log('- BLOG_DATABASE_ID:', BLOG_DATABASE_ID);
  console.log('- RECIPE_DATABASE_ID:', RECIPE_DATABASE_ID);
  console.log('='.repeat(50));

  try {
    // Fetch content sequentially to better isolate errors
    const blogPosts = await fetchBlogPosts();
    const recipes = await fetchRecipes();

    // Create metadata
    const metadata = {
      lastFetched: new Date().toISOString(),
      blogPostCount: blogPosts.length,
      recipeCount: recipes.length,
      totalItems: blogPosts.length + recipes.length
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
