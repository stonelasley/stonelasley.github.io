import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

// Import pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';

import './App.css';

/**
 * Main App Component
 * Sets up routing and overall layout structure
 */
function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:slug" element={<RecipeDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>© {new Date().getFullYear()} My Portfolio. Powered by Notion.</p>
              <p className="text-sm mt-2">
                Content managed with{' '}
                <a
                  href="https://notion.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Notion
                </a>
                {' '}and deployed to{' '}
                <a
                  href="https://pages.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  GitHub Pages
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
