import React from 'react';
import RecipeList from '../components/RecipeList';

// Import JSON data (will be generated at build time)
import recipesData from '../data/notion/recipes.json';

/**
 * Recipes Page - Minimal recipe listing
 */
const Recipes: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipes</h1>
        <p className="text-gray-700 leading-relaxed">
          A collection of recipes from quick meals to more involved cooking projects.
        </p>
      </div>

      {/* Recipe List with Filters */}
      <RecipeList recipes={recipesData} />
    </div>
  );
};

export default Recipes;
