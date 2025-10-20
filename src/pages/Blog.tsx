import React from 'react';
import BlogList from '../components/BlogList';

// Import JSON data (will be generated at build time)
import blogPostsData from '../data/notion/blog-posts.json';

/**
 * Blog Page - Minimal blog listing
 */
const Blog: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-700 leading-relaxed">
          Articles about web development, CSS, and various technical topics.
        </p>
      </div>

      {/* Blog List with Filters */}
      <BlogList posts={blogPostsData} />
    </div>
  );
};

export default Blog;
