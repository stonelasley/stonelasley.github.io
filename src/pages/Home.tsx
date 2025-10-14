import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import RecipeCard from '../components/RecipeCard';
import { ArrowRight } from 'lucide-react';

// Import JSON data (will be generated at build time)
import blogPostsData from '../data/notion/blog-posts.json';
import recipesData from '../data/notion/recipes.json';

/**
 * Home Page - Landing page with featured content
 */
const Home: React.FC = () => {
  // Get featured/recent content
  const featuredPosts = blogPostsData
    .filter((post: any) => post.featured)
    .slice(0, 3);

  const recentPosts = blogPostsData.slice(0, 3);

  const favoriteRecipes = recipesData
    .filter((recipe: any) => recipe.favorite)
    .slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 rounded-lg shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to My Portfolio</h1>
          <p className="text-xl mb-8 opacity-90">
            Discover my thoughts, recipes, and creative projects. All content powered by Notion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/blog"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Read Blog
            </Link>
            <Link
              to="/recipes"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Featured Posts</h2>
            <Link
              to="/blog"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && !featuredPosts.length && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/blog"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Favorite Recipes */}
      {favoriteRecipes.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Favorite Recipes</h2>
            <Link
              to="/recipes"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Site</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          This website is powered by Notion as a content management system. All blog posts and recipes
          are written in Notion and automatically fetched at build time, making it easy to maintain
          and update content without touching any code.
        </p>
      </section>
    </div>
  );
};

export default Home;
