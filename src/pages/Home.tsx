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
            I'm a technical writer at <a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>, where I'm content lead for <a href="https://web.dev" target="_blank" rel="noopener noreferrer">web.dev</a> and <a href="https://developer.chrome.com" target="_blank" rel="noopener noreferrer">developer.chrome.com</a>.
          </p>
          <p>
            I've written a bunch of <Link to="/blog">articles</Link>, and work on a couple of CSS specifications at the CSS Working Group. I speak at conferences, most often about CSS these days.
          </p>
          <p>
            You can find out <Link to="/blog">more about me</Link>, read what I'm working on <Link to="/blog">now</Link>, or explore the <Link to="/blog">archives</Link> of this site, which go back to 2001.
          </p>
          <p>
            <Link to="/blog">Contact me here</Link>.
          </p>
        </div>

        <hr className="my-12 border-gray-300" />

        <h2 className="text-2xl font-bold text-gray-900 mb-4">This site...</h2>
        <p className="text-gray-700 leading-relaxed">
          Is a redesign in progress. Apologies for any mess, as I move over 20 years of content around.
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
