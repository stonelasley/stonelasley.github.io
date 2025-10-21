import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import RecipeCard from '../components/RecipeCard';

// Import JSON data (will be generated at build time)
import blogPostsData from '../data/notion/blog-posts.json';
import recipesData from '../data/notion/recipes.json';

/**
 * Home Page - Minimal landing page
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
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Hello</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            I'm a developer, technical leader, bodybuilder, photographer, skier, AI enthusiast, and horology aficianado. Welcome to my website where all my dispirate interests come together.
          </p>
          <p>
            You can read more about what I've been <Link to="/blog">working on</Link> or what I've been <Link to="/recipes">cooking up</Link> .
          </p>
        </div>

        <hr className="my-12 border-gray-300" />

        <h2 className="text-2xl font-bold text-gray-900 mb-4">This site...</h2>
        <p className="text-gray-700 leading-relaxed">
          is a test bed, it won't be perfect, when it has quirks or lacks polish in certain areas feel free to <Link to="https://github.com/stonelasley/stonelasley.github.io/issues">open an issue</Link> if it's disruptive, but the chances are I know about it and just haven't gotten to it.
        </p>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
          <div className="space-y-6">
            {featuredPosts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-6">
            <Link to="/blog" className="underline hover:no-underline">
              View all posts →
            </Link>
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && !featuredPosts.length && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
          <div className="space-y-6">
            {recentPosts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-6">
            <Link to="/blog" className="underline hover:no-underline">
              View all posts →
            </Link>
          </div>
        </section>
      )}

      {/* Favorite Recipes */}
      {favoriteRecipes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Recipes</h2>
          <div className="space-y-6">
            {favoriteRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-6">
            <Link to="/recipes" className="underline hover:no-underline">
              View all recipes →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
