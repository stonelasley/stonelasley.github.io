import React from 'react';
import { Helmet } from 'react-helmet-async';
import RecipeList from '../components/RecipeList';

// Import JSON data (will be generated at build time)
import recipesData from '../data/notion/recipes.json';

/**
 * Recipes Page - Minimal recipe listing
 */
const Recipes: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Recipes - Stone Lasley</title>
        <meta name="description" content="A collection of recipes from quick meals to more involved cooking projects. Browse by category, difficulty, and dietary preferences." />
        <meta property="og:title" content="Recipes - Stone Lasley" />
        <meta property="og:description" content="A collection of recipes from quick meals to more involved cooking projects. Browse by category, difficulty, and dietary preferences." />
        <meta property="og:url" content="https://www.stonelasley.com/recipes" />
        <link rel="canonical" href="https://www.stonelasley.com/recipes" />
      </Helmet>
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
    </>
  );
};

export default Recipes;
