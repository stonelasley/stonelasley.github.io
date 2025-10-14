import React, { useState, useMemo } from 'react';
import RecipeCard from './RecipeCard';
import { Search, Star } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  category: string;
  difficulty: string;
  servings: number;
  tags: string[];
  favorite: boolean;
}

interface RecipeListProps {
  recipes: Recipe[];
}

/**
 * RecipeList component - Displays a list of recipes with filtering
 */
const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(recipes.map(recipe => recipe.category));
    return ['All', ...Array.from(cats)];
  }, [recipes]);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter recipes based on search and filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
      const matchesFavorite = !showFavoritesOnly || recipe.favorite;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorite;
    });
  }, [recipes, searchQuery, selectedCategory, selectedDifficulty, showFavoritesOnly]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Favorites Toggle */}
        <div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              showFavoritesOnly
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Star size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            Favorites Only
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No recipes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
