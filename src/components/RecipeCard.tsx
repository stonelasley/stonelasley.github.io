import React from 'react';
import { Link } from 'react-router-dom';

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
  heroImg?: string | null;
}

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component - Minimal text-based recipe preview with optional hero image
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <article className="py-4 border-b border-gray-300 last:border-b-0">
      {/* Hero Image */}
      {recipe.heroImg && (
        <div className="mb-4">
          <Link to={`/recipes/${recipe.slug}`}>
            <img
              src={recipe.heroImg}
              alt={recipe.name}
              className="w-full rounded-lg hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </Link>
        </div>
      )}

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
