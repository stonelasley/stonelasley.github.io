import React, { useState, useMemo } from 'react';
import BlogCard from './BlogCard';

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

interface BlogListProps {
  posts: BlogPost[];
}

/**
 * BlogList component - Minimal list of blog posts with filtering
 */
const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm ${
                selectedCategory === category
                  ? 'underline font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
      </p>

      {/* Blog Posts List */}
      {filteredPosts.length > 0 ? (
        <div className="border-t border-gray-300">
          {filteredPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 py-8">No posts found matching your criteria.</p>
      )}
    </div>
  );
};

export default BlogList;
