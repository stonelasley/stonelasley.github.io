import React from 'react';
import { Link } from 'react-router-dom';

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
 * RecipeCard component - Minimal text-based recipe preview
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <article className="py-4 border-b border-gray-300 last:border-b-0">
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">
        <Link to={`/recipes/${recipe.slug}`} className="text-gray-900 hover:underline">
          {recipe.name}
        </Link>
      </h2>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-2">{recipe.description}</p>

      {/* Recipe Info */}
      <p className="text-sm text-gray-600">
        {recipe.category} · {recipe.totalTime} min · {recipe.servings} servings · {recipe.difficulty}
      </p>
    </article>
  );
};

export default RecipeCard;
