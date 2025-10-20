# Recipe Schema Implementation Guide

## Overview

This document describes the implementation of the Recipe-Ingredient relationship using a junction table pattern in the Notion-based CMS for this React/TypeScript application.

## Database Architecture

### Three-Database Schema

The recipe system uses three interconnected Notion databases:

1. **Recipe Database** - Main recipe information
2. **Ingredient Database** - All available ingredients
3. **RecipeIngredient Database** - Junction table connecting recipes to ingredients

### Relationship Model

```
Recipe ←→ RecipeIngredient ←→ Ingredient
  (1)         (many)              (1)

- One Recipe has many RecipeIngredients
- One Ingredient can be in many RecipeIngredients
- RecipeIngredient stores the relationship metadata (quantity, unit, etc.)
```

## Notion Database Schemas

### 1. Recipe Database

**Properties:**
- `Name` (Title) - Recipe name
- `Description` (Text) - Recipe description
- `Category` (Select) - Meal Prep | Smoothies | Vegetables | Meats | Baking | Snacks
- `PrepTime` (Number) - Preparation time in minutes
- `CookTime` (Number) - Cooking time in minutes
- `OvenTemp (F)` (Number) - Oven temperature in Fahrenheit
- `Servings` (Number) - Number of servings
- `Date` (Date) - Recipe creation/publication date
- `Difficulty` (Select) - Easy | Medium | Veteran
- `Status` (Select) - Draft | Published | Archived
- `RecipeIngredient` (Relation) - Array of RecipeIngredient page URLs
- `IngredientList` (Rollup) - Computed from RecipeIngredient (optional)

### 2. Ingredient Database

**Properties:**
- `Name` (Title) - Ingredient name
- `Description` (Text) - Ingredient description
- `Brand` (Select) - Kirkland | Great Value | Dole | Mortons | Jell-O | Impact
- `In Pantry` (Checkbox) - Whether ingredient is currently in pantry
- `RecipeIngredient` (Relation) - Back-reference to junction entries

### 3. RecipeIngredient Database (Junction Table)

**Properties:**
- `Id` (Title) - Unique identifier for the junction entry
- `Recipe` (Relation, limit: 1) - Single Recipe URL
- `Ingredient Database` (Relation, limit: 1) - Single Ingredient URL
- `Quantity` (Number) - Amount of ingredient
- `Unit` (Select) - cup | tablespoon | teaspoon | ounce | pound | gram | kilogram | milliliter | liter | pinch | each
- `Purpose` (Text) - Why this ingredient is used in the recipe
- `Instructions` (Text) - Special preparation (e.g., "Mashed", "Chopped", "Diced")
- `Optional` (Checkbox) - Whether ingredient is optional
- `Display` (Formula) - Auto-formatted display string (e.g., "280 gram - @Banana")

## Environment Variables

Add these to your `.env.local` file:

```bash
NOTION_API_KEY=your_notion_api_key
BLOG_DATABASE_ID=your_blog_database_id
RECIPE_DATABASE_ID=your_recipe_database_id
INGREDIENT_DATABASE_ID=your_ingredient_database_id
RECIPE_INGREDIENT_DATABASE_ID=your_recipe_ingredient_database_id
```

**Note:** The last two (Ingredient and RecipeIngredient database IDs) are optional. If not provided, recipes will still be fetched but without structured ingredient data.

## TypeScript Types

The implementation uses comprehensive TypeScript types defined in `src/types/recipe.ts`:

### Base Notion Types
- `Recipe` - Raw Notion recipe data
- `Ingredient` - Raw Notion ingredient data
- `RecipeIngredient` - Raw Notion junction table data

### Hydrated Types
- `RecipeIngredientWithDetails` - RecipeIngredient with resolved Ingredient
- `RecipeWithIngredients` - Recipe with resolved ingredients array

### Display Types
- `RecipeDisplay` - Frontend-friendly recipe format
- `RecipeIngredientDisplay` - Frontend-friendly ingredient format

### Helper Functions
- `parseNotionRelation(field)` - Parse JSON array relations
- `parseNotionSingleRelation(field)` - Parse single relation
- `isNotionCheckboxChecked(value)` - Check if checkbox is true

## Data Fetching Flow

The `scripts/fetch-notion-content.js` script handles fetching and joining data:

### Step-by-Step Process

1. **Fetch Recipe** from Recipe Database
2. **Parse RecipeIngredient URLs** from Recipe.RecipeIngredient property
3. **For each RecipeIngredient URL:**
   - Fetch RecipeIngredient page
   - Extract quantity, unit, instructions, purpose, optional flag
   - Parse Ingredient URL from RecipeIngredient['Ingredient Database']
   - Fetch Ingredient page
   - Extract ingredient name, brand, description, inPantry status
   - Combine into ingredient object with full details
4. **Return Recipe** with `ingredients` array populated

### Rate Limiting

The script implements rate limiting to respect Notion API limits (3 requests/second):
- 350ms delay between requests
- Sequential processing to avoid hitting limits

## Frontend Display

### RecipeDetail Component

The recipe detail page (`src/pages/RecipeDetail.tsx`) displays ingredients in two ways:

1. **Structured Ingredients Section** (NEW)
   - Displays ingredients from the junction table
   - Shows quantity, unit, ingredient name, brand
   - Marks optional ingredients
   - Shows preparation instructions
   - Shows purpose when available
   - Uses Display field if available

2. **Markdown Content Section** (EXISTING)
   - Still displays the full recipe content as markdown
   - Useful for additional context or instructions
   - Can include ingredients if user prefers manual formatting

### Example Display

```
Ingredients:
• 280 gram - Banana (Dole) (optional)
  Mashed
  Purpose: Adds sweetness and texture

• 2 cup - Milk (Kirkland)

• 1 tablespoon - Vanilla Extract
```

## Notion Relation Field Format

The Notion SDK returns relation fields as arrays of objects with `id` properties:

### Multiple Relations (Array)
```javascript
RecipeIngredient: {
  type: "relation",
  relation: [
    { id: "28f48366-4402-80f6-8655-c0923a8fb5e6" },
    { id: "28f48366-4402-8018-83dc-d52edcea6e0e" },
    // ... more items
  ],
  has_more: false
}
```

### Single Relations (Limit: 1)
```javascript
Recipe: {
  type: "relation",
  relation: [
    { id: "28c48366-4402-8094-98d2-c827ae61def5" }
  ],
  has_more: false
}
```

**Important:** Even single relations are returned as arrays (with limit: 1). Use `relation[0].id` to access the ID.

### Checkbox Values
```javascript
Optional: { checkbox: true }  // or false
'In Pantry': { checkbox: true }  // or false
```

**Note:** Raw checkbox values from Notion API are booleans, not strings.

## Adding a New Recipe with Ingredients

### Method 1: Via Notion UI

1. Create a new page in the **Recipe Database**
2. Fill in recipe details (name, description, times, etc.)
3. Set Status to "Published"
4. For each ingredient:
   - Create a new page in **RecipeIngredient Database**
   - Set the Recipe relation to your recipe
   - Set the Ingredient Database relation to the ingredient
   - Enter Quantity, Unit, Instructions, etc.
5. The Recipe.RecipeIngredient relation will automatically populate

### Method 2: Duplicate Existing Recipe

1. Find a similar recipe in Notion
2. Duplicate the recipe page
3. Update recipe details
4. The RecipeIngredient relations will be copied
5. Edit individual RecipeIngredient entries to update quantities/ingredients

## Migration Guide

If you have existing recipes without structured ingredients:

1. Set up the three databases as described above
2. Add environment variables for the new database IDs
3. Run `npm run fetch-content` to fetch recipes
4. Initially, recipes will have empty `ingredients` arrays
5. Gradually add RecipeIngredient entries in Notion for each recipe
6. Re-run fetch to pull in the new structured data

## Troubleshooting

### Ingredients Not Showing

**Check:**
1. Are INGREDIENT_DATABASE_ID and RECIPE_INGREDIENT_DATABASE_ID set in `.env.local`?
2. Does the recipe have RecipeIngredient relations in Notion?
3. Are the RecipeIngredient entries properly linked to Ingredient pages?
4. Did you run `npm run fetch-content` after adding ingredients?

### Console Errors

**Common Issues:**
- "Cannot read property 'relation' of undefined" - Check property names in Notion
- "Failed to fetch page" - Check Notion API permissions
- Rate limiting errors - Increase delay between requests in script

### Empty Ingredient Arrays

**Possible Causes:**
- RecipeIngredient relation field is empty in Notion
- Environment variables not set correctly
- Notion API permissions not granted to integration

## Performance Considerations

### API Calls Per Recipe

For a recipe with N ingredients:
- 1 call to fetch the recipe
- 1 call for page content (markdown)
- N calls to fetch RecipeIngredient entries
- N calls to fetch Ingredient details

**Total: 2 + 2N calls per recipe**

### Optimization Ideas

1. **Caching** - Cache Ingredient data to avoid redundant fetches
2. **Batch Fetching** - Use Notion's batch API if available
3. **Partial Updates** - Only fetch changed recipes
4. **Build-time Generation** - Keep current approach (static JSON)

## Best Practices

### In Notion

1. Always link RecipeIngredient to both Recipe and Ingredient
2. Use the Display formula field for consistent formatting
3. Keep ingredient names consistent across recipes
4. Mark optional ingredients correctly
5. Add preparation instructions when relevant

### In Code

1. Always check if `ingredients` array exists before mapping
2. Handle null/undefined quantities and units gracefully
3. Use helper functions from `src/types/recipe.ts`
4. Validate data after fetching from Notion

## Future Enhancements

### Possible Features

1. **Shopping List Generator** - Based on recipe ingredients
2. **Pantry Management** - Track what's in stock
3. **Ingredient Substitutions** - Suggest alternatives
4. **Nutrition Calculator** - Add nutrition data to ingredients
5. **Cost Tracking** - Track ingredient costs and recipe totals
6. **Scaling** - Automatically adjust quantities for different serving sizes
7. **Unit Conversion** - Convert between metric and imperial

## File Reference

### Key Files

- `src/types/recipe.ts` - TypeScript type definitions
- `scripts/fetch-notion-content.js` - Data fetching script
- `src/pages/RecipeDetail.tsx` - Recipe display component
- `src/components/RecipeCard.tsx` - Recipe card component
- `src/components/RecipeList.tsx` - Recipe list component
- `.env.example` - Environment variable template
- `RECIPE_SCHEMA.md` - This documentation file

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check Notion API documentation
4. Review GitHub issues at https://github.com/anthropics/claude-code/issues
