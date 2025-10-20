import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import JSON data
import recipesData from '../data/notion/recipes.json';

/**
 * RecipeDetail Page - Minimal recipe view with enhanced image support
 */
const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the recipe by slug
  const recipe = recipesData.find((r: any) => r.slug === slug);

  // If recipe not found, redirect to recipes page
  if (!recipe) {
    return <Navigate to="/recipes" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        to="/recipes"
        className="inline-block mb-8 text-gray-900 underline hover:no-underline"
      >
        ← Back to Recipes
      </Link>

      {/* Recipe */}
      <article>
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{recipe.description}</p>

        {/* Recipe Info */}
        <div className="text-sm text-gray-600 mb-8 pb-6 border-b border-gray-300">
          <p>
            {recipe.category} · {recipe.totalTime} min · {recipe.servings} servings · {recipe.difficulty}
          </p>
          <p className="mt-2">
            Prep: {recipe.prepTime} min · Cook: {recipe.cookTime} min
          </p>
        </div>

        {/* Recipe Content (Ingredients & Instructions) */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Enhanced image styling with full width support
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="w-full my-8"
                  alt={props.alt || ''}
                  loading="lazy"
                />
              ),
              // Minimal link styling
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-gray-900 underline hover:no-underline"
                  target={props.href?.startsWith('http') ? '_blank' : undefined}
                  rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                />
              ),
              // Ensure proper spacing for paragraphs
              p: ({ node, ...props }) => (
                <p className="mb-4 leading-relaxed text-gray-800" {...props} />
              ),
              // Headings
              // eslint-disable-next-line jsx-a11y/heading-has-content
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
              ),
              // eslint-disable-next-line jsx-a11y/heading-has-content
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />
              ),
              // Lists
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

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600 mb-2">Tagged:</p>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {recipe.lastUpdated && (
          <div className="mt-8 text-sm text-gray-600">
            Last updated: {new Date(recipe.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </article>

      {/* Back to Recipes Link */}
      <div className="mt-12">
        <Link
          to="/recipes"
          className="text-gray-900 underline hover:no-underline"
        >
          ← Back to Recipes
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetail;
