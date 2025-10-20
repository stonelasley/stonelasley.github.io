import React from 'react';
import { Link } from 'react-router-dom';

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
 * BlogCard component - Minimal text-based blog post preview
 */
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-4 border-b border-gray-300 last:border-b-0">
      {/* Date */}
      <p className="text-sm text-gray-600 mb-2">{formattedDate}</p>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2">
        <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-700 leading-relaxed mb-2">{post.excerpt}</p>

      {/* Category */}
      <p className="text-sm text-gray-600">
        {post.category} · {post.readTime} min read
      </p>
    </article>
  );
};

export default BlogCard;
