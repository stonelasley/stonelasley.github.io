import React from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import mealPrepData from '../data/notion/meal-prep.json';

type MealPrepContent = {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  lastUpdated?: string;
};

const defaultContent: MealPrepContent = {
  title: 'Meal Prep',
  slug: 'meal-prep',
  content: '',
  excerpt: ''
};

const mealPrepContent = (mealPrepData as MealPrepContent | null) ?? defaultContent;
const hasContent = Boolean(mealPrepContent.content && mealPrepContent.content.trim().length > 0);

const MealPrep: React.FC = () => {
  const pageTitle = `${mealPrepContent.title || 'Meal Prep'} - Stone Lasley`;
  const description = mealPrepContent.excerpt || 'Meal prep resources from Stone Lasley.';
  const canonicalUrl = 'https://www.stonelasley.com/meal-prep';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={mealPrepContent.title || 'Meal Prep'} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{mealPrepContent.title || 'Meal Prep'}</h1>

        {mealPrepContent.lastUpdated && (
          <p className="text-sm text-gray-600 mb-8">
            Last updated:{' '}
            {new Date(mealPrepContent.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}

        {hasContent ? (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="w-full my-8"
                    alt={props.alt || ''}
                    loading="lazy"
                  />
                ),
                a: ({ node, children, ...props }) => (
                  <a
                    {...props}
                    className="text-gray-900 underline hover:no-underline"
                    target={props.href?.startsWith('http') ? '_blank' : undefined}
                    rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="bg-gray-200 text-gray-900 px-1 py-0.5" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm" {...props} />
                  ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-gray-800" {...props} />
                ),
                h2: ({ node, children, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ node, children, ...props }) => (
                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props}>
                    {children}
                  </h3>
                )
              }}
            >
              {mealPrepContent.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">
            This content is not available at the moment. Please check back later.
          </p>
        )}
      </div>
    </>
  );
};

export default MealPrep;
