import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import JSON data
import blogPostsData from '../data/notion/blog-posts.json';

/**
 * BlogPost Page - Minimal article view with enhanced image support
 */
const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the post by slug
  const post = blogPostsData.find((p: any) => p.slug === slug);

  // If post not found, redirect to blog page
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pageTitle = `${post.title} - Stone Lasley`;
  const pageDescription = post.excerpt || post.title;
  const pageUrl = `https://www.stonelasley.com/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        {post.lastUpdated && (
          <meta property="article:modified_time" content={post.lastUpdated} />
        )}
        {post.author && <meta property="article:author" content={post.author} />}
        {post.category && <meta property="article:section" content={post.category} />}
        {post.tags && post.tags.map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      <div className="max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        to="/blog"
        className="inline-block mb-8 text-gray-900 underline hover:no-underline"
      >
        ← Back to Blog
      </Link>

      {/* Article */}
      <article>
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Metadata */}
        <div className="text-sm text-gray-600 mb-8 pb-6 border-b border-gray-300">
          <p>
            {formattedDate} · {post.readTime} min read · {post.category}
          </p>
        </div>

        {/* Content */}
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
              // Code styling
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code className="bg-gray-200 text-gray-900 px-1 py-0.5" {...props} />
                ) : (
                  <code className="block bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm" {...props} />
                ),
              // Ensure proper spacing for paragraphs
              p: ({ node, ...props }) => (
                <p className="mb-4 leading-relaxed text-gray-800" {...props} />
              ),
              // Headings
              h2: ({ node, children, ...props }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ node, children, ...props }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props}>
                  {children}
                </h3>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600 mb-2">Tagged:</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
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
        {post.lastUpdated && (
          <div className="mt-8 text-sm text-gray-600">
            Last updated: {new Date(post.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </article>

      {/* Back to Blog Link */}
      <div className="mt-12">
        <Link
          to="/blog"
          className="text-gray-900 underline hover:no-underline"
        >
          ← Back to Blog
        </Link>
      </div>
      </div>
    </>
  );
};

export default BlogPost;
