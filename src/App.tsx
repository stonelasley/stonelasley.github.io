import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
 * Minimal design with sidebar navigation (desktop) and mobile menu
 */
function App() {
  return (
    <HelmetProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="min-h-screen bg-gray-100 flex">
          {/* Sidebar Navigation (Desktop) */}
          <Navigation />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:ml-64">
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:slug" element={<RecipeDetail />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-300 mt-16">
              <div className="max-w-4xl w-full mx-auto px-6 py-8">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
