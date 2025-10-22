import React, { useState, useMemo } from 'react';
import RecipeCard from './RecipeCard';

interface RecipeIngredient {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  brand?: string | null;
  description?: string;
  instructions?: string;
  purpose?: string;
  optional: boolean;
  inPantry: boolean;
  display?: string | null;
}

interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  ovenTemp?: number | null;
  category: string;
  difficulty: string;
  servings: number;
  tags: string[];
  favorite: boolean;
  ingredients?: RecipeIngredient[];
}

interface RecipeListProps {
  recipes: Recipe[];
}

/**
 * RecipeList component - Minimal list of recipes with filtering
 */
const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(recipes.map(recipe => recipe.category));
    return ['All', ...Array.from(cats)];
  }, [recipes]);

  // Filter recipes based on search and category
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm ${
                selectedCategory === category
                  ? 'underline font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
      </p>

      {/* Recipes List */}
      {filteredRecipes.length > 0 ? (
        <div className="border-t border-gray-300">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 py-8">No recipes found matching your criteria.</p>
      )}
    </div>
  );
};

export default RecipeList;
