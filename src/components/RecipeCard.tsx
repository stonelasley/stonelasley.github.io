import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Users, Star } from 'lucide-react';

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

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component - Displays a preview card for a recipe
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Favorite Badge */}
        {recipe.favorite && (
          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            <Star size={16} fill="currentColor" />
            <span className="text-xs font-semibold">Favorite</span>
          </div>
        )}

        {/* Category and Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
            {recipe.category}
          </span>
          <span className={`inline-block text-xs px-3 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Title */}
        <Link to={`/recipes/${recipe.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition mb-3">
            {recipe.name}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

        {/* Recipe Info */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Clock size={18} className="mb-1 text-blue-600" />
            <span className="font-semibold">{recipe.totalTime} min</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Users size={18} className="mb-1 text-blue-600" />
            <span className="font-semibold">{recipe.servings} servings</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <ChefHat size={18} className="mb-1 text-blue-600" />
            <span className="font-semibold text-xs">{recipe.difficulty}</span>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* View Recipe Link */}
        <Link
          to={`/recipes/${recipe.slug}`}
          className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          View Recipe
        </Link>
      </div>
    </article>
  );
};

export default RecipeCard;
