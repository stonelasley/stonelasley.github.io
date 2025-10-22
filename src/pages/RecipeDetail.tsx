import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RecipeDisplay } from '../types/recipe';
import { CLOUDINARY_PRESETS } from '../utils/cloudinary';

// Import JSON data
import recipesData from '../data/notion/recipes.json';

/**
 * RecipeDetail Page - Minimal recipe view with enhanced image support
 */
const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [stepThroughMode, setStepThroughMode] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  // Find the recipe by slug
  const recipe = recipesData.find((r: any) => r.slug === slug) as RecipeDisplay | undefined;

  // If recipe not found, redirect to recipes page
  if (!recipe) {
    return <Navigate to="/recipes" replace />;
  }

  const pageTitle = `${recipe.name} - Stone Lasley`;
  const pageDescription = recipe.description || `${recipe.name} - ${recipe.category} recipe, ${recipe.totalTime} minutes total time, serves ${recipe.servings}`;
  const pageUrl = `https://www.stonelasley.com/recipes/${recipe.slug}`;
  const recipeImageUrl = recipe.heroImg ? CLOUDINARY_PRESETS.recipeHero(recipe.heroImg) : undefined;

  // Toggle ingredient checkbox
  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCheckedIngredients(newSet);
  };

  // Toggle step checkbox
  const toggleStep = (index: number) => {
    const newSet = new Set(checkedSteps);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCheckedSteps(newSet);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={recipe.name} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        {recipeImageUrl && <meta property="og:image" content={recipeImageUrl} />}
        {recipe.category && <meta name="keywords" content={`recipe, ${recipe.category}, cooking, ${recipe.difficulty}, ${recipe.tags?.join(', ')}`} />}
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      <div className="max-w-7xl mx-auto">
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

        {/* Hero Image */}
        {recipe.heroImg && (
          <div className="mb-8">
            <img
              src={CLOUDINARY_PRESETS.recipeHero(recipe.heroImg)}
              alt={recipe.name}
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{recipe.description}</p>

        {/* Recipe Info */}
        <div className="text-sm text-gray-600 mb-8 pb-6 border-b border-gray-300">
          <p>
            {recipe.category} · {recipe.totalTime} min · {recipe.servings} servings · {recipe.difficulty}
          </p>
          <p className="mt-2">
            Prep: {recipe.prepTime} min · Cook: {recipe.cookTime} min
            {recipe.ovenTemp && ` · Oven: ${recipe.ovenTemp}°F`}
          </p>
        </div>

        {/* Step Through Mode Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stepThroughMode}
              onChange={(e) => setStepThroughMode(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-900">Step Through Mode</span>
          </label>
        </div>

        {/* Two-column layout: Ingredients (left) | Preparation (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ingredients</h2>
                <ul className="space-y-2 border-l-2 border-gray-300 pl-4">
                  {recipe.ingredients.map((ingredient: any) => (
                    <li key={ingredient.id} className="text-gray-800 leading-relaxed">
                      <div className="flex items-start gap-2">
                        {/* Checkbox in step-through mode */}
                        {stepThroughMode && (
                          <input
                            type="checkbox"
                            checked={checkedIngredients.has(ingredient.id)}
                            onChange={() => toggleIngredient(ingredient.id)}
                            className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
                          />
                        )}

                        {/* Main ingredient content */}
                        <div className="flex-1">
                          {/* Main ingredient line */}
                          <div>
                            {ingredient.display ? (
                              // Use Notion's Display formula if available
                              <span className="font-normal">
                                {ingredient.display.replace('@', '')}
                                {ingredient.optional && <span className="text-gray-500 text-sm ml-2 italic">(optional)</span>}
                                {ingredient.inPantry && <span className="text-xs text-green-700 ml-2">✓ In pantry</span>}
                              </span>
                            ) : (
                              // Fallback formatting
                              <span>
                                {ingredient.quantity && ingredient.unit && (
                                  <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                                )}
                                {ingredient.quantity && !ingredient.unit && (
                                  <span className="font-medium">{ingredient.quantity}</span>
                                )}
                                {(ingredient.quantity || ingredient.unit) && ' - '}
                                <span>{ingredient.name}</span>
                                {ingredient.brand && <span className="text-gray-600"> ({ingredient.brand})</span>}
                                {ingredient.optional && <span className="text-gray-500 text-sm ml-2 italic">(optional)</span>}
                                {ingredient.inPantry && <span className="text-xs text-green-700 ml-2">✓ In pantry</span>}
                              </span>
                            )}
                          </div>

                          {/* Additional metadata */}
                          {(ingredient.instructions || ingredient.purpose) && (
                            <div className="ml-4 mt-1 text-sm text-gray-600 space-y-0.5">
                              {ingredient.instructions && (
                                <div className="italic">Prep: {ingredient.instructions}</div>
                              )}
                              {ingredient.purpose && (
                                <div>Purpose: {ingredient.purpose}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Right Column: Preparation/Instructions */}
          <div className={recipe.ingredients && recipe.ingredients.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
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
                  ol: ({ node, ...props }) => {
                    // Custom ordered list with step-through checkboxes
                    if (stepThroughMode) {
                      const children = React.Children.toArray(props.children);
                      return (
                        <ol className="space-y-2 mb-4">
                          {children.map((child: any, idx: number) => {
                            if (child?.type === 'li' || (child?.props && typeof child.props.children !== 'undefined')) {
                              return (
                                <li key={idx} className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    checked={checkedSteps.has(idx)}
                                    onChange={() => toggleStep(idx)}
                                    className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
                                  />
                                  <span className="flex-1">{child.props?.children || child}</span>
                                </li>
                              );
                            }
                            return child;
                          })}
                        </ol>
                      );
                    }
                    return <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />;
                  },
                }}
              >
                {recipe.content}
              </ReactMarkdown>
            </div>
          </div>
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
    </>
  );
};

export default RecipeDetail;
