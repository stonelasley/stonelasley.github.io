import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: number;
}

interface BlogCardProps {
  post: BlogPost;
}

/**
 * BlogCard component - Displays a preview card for a blog post
 */
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {post.featured && (
        <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 inline-block">
          Featured
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition mb-3">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <div className="mt-4">
          <Link
            to={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
