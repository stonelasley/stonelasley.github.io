import React from 'react';
import { Helmet } from 'react-helmet-async';
import BlogList from '../components/BlogList';

// Import JSON data (will be generated at build time)
import blogPostsData from '../data/notion/blog-posts.json';

/**
 * Blog Page - Minimal blog listing
 */
const Blog: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Stone Lasley</title>
        <meta name="description" content="Articles about software development, learning, horology, bodybuilding, photography, and life." />
        <meta property="og:title" content="Blog - Stone Lasley" />
        <meta property="og:description" content="Articles about software development, learning, horology, bodybuilding, photography, and life." />
        <meta property="og:url" content="https://www.stonelasley.com/blog" />
        <link rel="canonical" href="https://www.stonelasley.com/blog" />
      </Helmet>
      <div>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-700 leading-relaxed">
            Articles about software development, learning, horology, bodybuilding, photography, and life.
          </p>
        </div>

        {/* Blog List with Filters */}
        <BlogList posts={blogPostsData} />
      </div>
    </>
  );
};

export default Blog;
