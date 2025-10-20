/**
 * TypeScript type definitions for Recipe, Ingredient, and RecipeIngredient
 * based on Notion database schema with junction table relationship
 */

/**
 * Base Recipe type matching Notion Recipe database properties
 */
export interface Recipe {
  /** Notion page URL */
  url: string;
  /** Recipe name (Title property) */
  Name: string;
  /** Recipe description */
  Description?: string;
  /** Recipe category */
  Category?: 'Meal Prep' | 'Smoothies' | 'Vegetables' | 'Meats' | 'Baking' | 'Snacks';
  /** Preparation time in minutes */
  PrepTime?: number;
  /** Cooking time in minutes */
  CookTime?: number;
  /** Oven temperature in Fahrenheit */
  'OvenTemp (F)'?: number;
  /** Number of servings */
  Servings?: number;
  /** Recipe date (start) */
  'date:Date:start'?: string;
  /** Recipe date (end) */
  'date:Date:end'?: string;
  /** Whether date includes time */
  'date:Date:is_datetime'?: 0 | 1;
  /** Recipe difficulty level */
  Difficulty?: 'Easy' | 'Medium' | 'Veteran';
  /** Publishing status */
  Status?: 'Draft' | 'Published' | 'Archived';
  /** JSON array of RecipeIngredient URLs (relation field) */
  RecipeIngredient?: string;
  /** Rollup field for ingredient list (computed) */
  IngredientList?: string;
  /** Hero image URL (Files & media property) */
  HeroImg?: string;
}

/**
 * Base Ingredient type matching Notion Ingredient database properties
 */
export interface Ingredient {
  /** Notion page URL */
  url: string;
  /** Ingredient name (Title property) */
  Name: string;
  /** Ingredient description */
  Description?: string;
  /** Brand of ingredient */
  Brand?: 'Kirkland' | 'Great Value' | 'Dole' | 'Mortons' | 'Jell-O' | 'Impact';
  /** Whether ingredient is in pantry (checkbox) */
  'In Pantry'?: '__YES__' | '__NO__';
  /** Back-reference to RecipeIngredient junction entries (JSON array) */
  RecipeIngredient?: string;
}

/**
 * RecipeIngredient junction table type
 * Connects recipes to ingredients with relationship metadata
 */
export interface RecipeIngredient {
  /** Notion page URL */
  url: string;
  /** Unique identifier for this junction entry */
  'userDefined:Id': string;
  /** Single Recipe URL (JSON string, relation limit: 1) */
  Recipe?: string;
  /** Single Ingredient URL (JSON string, relation limit: 1) */
  'Ingredient Database'?: string;
  /** Amount of ingredient */
  Quantity?: number;
  /** Unit of measurement */
  Unit?: 'cup' | 'tablespoon' | 'teaspoon' | 'ounce' | 'pound' | 'gram' |
         'kilogram' | 'milliliter' | 'liter' | 'pinch' | 'each';
  /** Purpose of this ingredient in the recipe */
  Purpose?: string;
  /** Special preparation instructions (e.g., "Mashed", "Chopped") */
  Instructions?: string;
  /** Whether ingredient is optional */
  Optional?: '__YES__' | '__NO__';
  /** Auto-formatted display string (Formula field, read-only) */
  Display?: string;
}

/**
 * Hydrated RecipeIngredient with resolved Ingredient details
 * Used in UI components to display full ingredient information
 */
export interface RecipeIngredientWithDetails extends RecipeIngredient {
  /** Resolved ingredient data from Ingredient database */
  ingredient?: Ingredient;
}

/**
 * Hydrated Recipe with resolved ingredients list
 * Used in UI components to display full recipe with ingredient details
 */
export interface RecipeWithIngredients extends Recipe {
  /** Array of recipe ingredients with full details */
  ingredients?: RecipeIngredientWithDetails[];
}

/**
 * Simplified Recipe type for frontend display (transformed from Notion data)
 * This is the format currently used by the React components
 */
export interface RecipeDisplay {
  /** Notion page ID */
  id: string;
  /** Recipe name */
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** Recipe description */
  description: string;
  /** Preparation time in minutes */
  prepTime: number;
  /** Cooking time in minutes */
  cookTime: number;
  /** Total time (prep + cook) */
  totalTime: number;
  /** Oven temperature in Fahrenheit */
  ovenTemp?: number;
  /** Recipe category */
  category: string;
  /** Difficulty level */
  difficulty: string;
  /** Number of servings */
  servings: number;
  /** Tags */
  tags: string[];
  /** Whether recipe is favorited */
  favorite: boolean;
  /** Markdown content (ingredients & instructions from page body) */
  content: string;
  /** Last updated timestamp */
  lastUpdated: string;
  /** Structured ingredients from junction table */
  ingredients?: RecipeIngredientDisplay[];
  /** Hero image URL */
  heroImg?: string;
}

/**
 * Simplified ingredient display format for frontend
 */
export interface RecipeIngredientDisplay {
  /** Unique identifier */
  id: string;
  /** Ingredient name */
  name: string;
  /** Amount */
  quantity?: number;
  /** Unit of measurement */
  unit?: string;
  /** Brand (if applicable) */
  brand?: string;
  /** Description */
  description?: string;
  /** Preparation instructions */
  instructions?: string;
  /** Purpose in recipe */
  purpose?: string;
  /** Whether ingredient is optional */
  optional: boolean;
  /** Whether ingredient is in pantry */
  inPantry: boolean;
  /** Formatted display string */
  display?: string;
}

/**
 * Utility type for Notion relation fields (array of objects with id)
 */
export type NotionRelation = Array<{ id: string }>;

/**
 * Helper function to parse Notion relation field to array of IDs
 * Note: The Notion SDK already parses the relation field into an array of {id: string} objects
 */
export function parseNotionRelation(relationField?: NotionRelation): string[] {
  if (!relationField || !Array.isArray(relationField)) return [];
  return relationField.map(item => item.id);
}

/**
 * Helper function to parse single Notion relation field to a single ID
 * Note: The Notion SDK already parses the relation field into an array of {id: string} objects
 */
export function parseNotionSingleRelation(relationField?: NotionRelation): string | null {
  if (!relationField || !Array.isArray(relationField) || relationField.length === 0) {
    return null;
  }
  return relationField[0].id || null;
}

/**
 * Helper function to check if Notion checkbox is checked
 */
export function isNotionCheckboxChecked(checkboxValue?: string): boolean {
  return checkboxValue === '__YES__';
}
