import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

// Import JSON data
import blogPostsData from '../data/notion/blog-posts.json';

/**
 * BlogPost Page - Displays a single blog post with full content
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Blog
      </Link>

      {/* Article */}
      <article className="bg-white rounded-lg shadow-md p-8">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{post.readTime} min read</span>
          </div>
          <div className="text-gray-500">
            By {post.author}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom image styling
              img: ({ node, ...props }) => (
                <img {...props} className="rounded-lg shadow-md my-4" alt={props.alt || ''} />
              ),
              // Custom link styling
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              // Custom code block styling
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded" {...props} />
                ) : (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props} />
                ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Last Updated */}
        {post.lastUpdated && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            Last updated: {new Date(post.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </article>

      {/* Back to Blog Link */}
      <div className="mt-8 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
