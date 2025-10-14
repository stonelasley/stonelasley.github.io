import React from 'react';
import RecipeList from '../components/RecipeList';

// Import JSON data (will be generated at build time)
import recipesData from '../data/notion/recipes.json';

/**
 * Recipes Page - Displays all recipes with filtering
 */
const Recipes: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipes</h1>
        <p className="text-lg text-gray-600">
          Browse my collection of favorite recipes, from quick meals to gourmet dishes.
        </p>
      </div>

      {/* Recipe List with Filters */}
      <RecipeList recipes={recipesData} />
    </div>
  );
};

export default Recipes;
