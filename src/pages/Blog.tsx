import React from 'react';
import BlogList from '../components/BlogList';

// Import JSON data (will be generated at build time)
import blogPostsData from '../data/notion/blog-posts.json';

/**
 * Blog Page - Displays all blog posts with filtering
 */
const Blog: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600">
          Explore my thoughts, tutorials, and insights on various topics.
        </p>
      </div>

      {/* Blog List with Filters */}
      <BlogList posts={blogPostsData} />
    </div>
  );
};

export default Blog;
