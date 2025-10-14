import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock, Users, ChefHat, ArrowLeft, Star } from 'lucide-react';

// Import JSON data
import recipesData from '../data/notion/recipes.json';

/**
 * RecipeDetail Page - Displays a single recipe with full content
 */
const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the recipe by slug
  const recipe = recipesData.find((r: any) => r.slug === slug);

  // If recipe not found, redirect to recipes page
  if (!recipe) {
    return <Navigate to="/recipes" replace />;
  }

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
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Recipes
      </Link>

      {/* Recipe */}
      <article className="bg-white rounded-lg shadow-md p-8">
        {/* Favorite Badge */}
        {recipe.favorite && (
          <div className="flex items-center gap-2 text-yellow-500 mb-4">
            <Star size={20} fill="currentColor" />
            <span className="font-semibold">Favorite Recipe</span>
          </div>
        )}

        {/* Category and Difficulty */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm px-4 py-1 rounded-full">
            {recipe.category}
          </span>
          <span className={`inline-block text-sm px-4 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

        {/* Recipe Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Clock size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Prep Time</div>
            <div className="font-bold text-gray-900">{recipe.prepTime} min</div>
          </div>
          <div className="text-center">
            <Clock size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Cook Time</div>
            <div className="font-bold text-gray-900">{recipe.cookTime} min</div>
          </div>
          <div className="text-center">
            <Users size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Servings</div>
            <div className="font-bold text-gray-900">{recipe.servings}</div>
          </div>
          <div className="text-center">
            <ChefHat size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600">Difficulty</div>
            <div className="font-bold text-gray-900">{recipe.difficulty}</div>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Recipe Content (Ingredients & Instructions) */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom image styling
              img: ({ node, ...props }) => (
                <img {...props} className="rounded-lg shadow-md my-4" alt={props.alt || ''} />
              ),
              // Custom heading styling
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />
              ),
              // Custom list styling
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 mb-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />
              ),
            }}
          >
            {recipe.content}
          </ReactMarkdown>
        </div>

        {/* Print Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Print Recipe
          </button>
        </div>

        {/* Last Updated */}
        {recipe.lastUpdated && (
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(recipe.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </article>

      {/* Back to Recipes Link */}
      <div className="mt-8 text-center">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetail;
