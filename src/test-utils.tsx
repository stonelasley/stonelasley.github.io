import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of RTL's render for components that need routing
 */
export function renderWithRouter(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter>{children}</MemoryRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock blog post factory for consistent test data
 */
export const createMockBlogPost = (overrides = {}) => ({
  id: 'test-id-123',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  date: '2024-01-15',
  excerpt: 'This is a test excerpt for the blog post.',
  author: 'Test Author',
  category: 'Technology',
  tags: ['react', 'testing'],
  featured: false,
  readTime: 5,
  ...overrides,
});

/**
 * Mock recipe factory for consistent test data
 */
export const createMockRecipe = (overrides = {}) => ({
  id: 'test-recipe-123',
  name: 'Test Recipe',
  slug: 'test-recipe',
  description: 'This is a test recipe description.',
  prepTime: 15,
  cookTime: 30,
  category: 'Dinner',
  difficulty: 'Medium',
  servings: 4,
  tags: ['healthy', 'quick'],
  favorite: false,
  ...overrides,
});

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
