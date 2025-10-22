# Testing Guide

This document outlines the testing patterns and best practices for this project.

## Test Framework

We use **Jest** and **React Testing Library** (configured via Create React App) for unit and integration testing.

### Key Dependencies
- `jest` - Test runner (via react-scripts)
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation

## Testing Philosophy

We follow these principles from React Testing Library:

> "The more your tests resemble the way your software is used, the more confidence they can give you."

- **Test behavior, not implementation** - Focus on what users see and do
- **Query by accessibility roles** - Use `getByRole`, `getByLabelText` when possible
- **Avoid testing internals** - Don't test state, props directly; test outputs
- **User-centric testing** - Simulate real user interactions

## File Organization

```
src/
├── components/
│   ├── BlogCard.tsx
│   └── BlogCard.test.tsx        # Tests next to components
├── pages/
│   ├── Home.tsx
│   └── Home.test.tsx
├── test-utils.tsx                # Shared test utilities
└── setupTests.ts                 # Jest setup (already configured)
```

## Test Utilities

We provide custom utilities in `src/test-utils.tsx`:

### `renderWithRouter()`
Use this for components that use React Router (Links, navigation, etc.):

```tsx
import { renderWithRouter, screen } from '../test-utils';
import MyComponent from './MyComponent';

test('renders navigation link', () => {
  renderWithRouter(<MyComponent />);
  const link = screen.getByRole('link', { name: /home/i });
  expect(link).toBeInTheDocument();
});
```

### Mock Data Factories

Create consistent test data:

```tsx
import { createMockBlogPost, createMockRecipe } from '../test-utils';

const mockPost = createMockBlogPost({
  title: 'Custom Title',
  featured: true,
});

const mockRecipe = createMockRecipe({
  name: 'Special Recipe',
  cookTime: 45,
});
```

## Testing Patterns

### 1. Component Rendering Tests

Verify the component renders with expected content:

```tsx
test('renders blog post title', () => {
  const post = createMockBlogPost({ title: 'My Blog Post' });
  renderWithRouter(<BlogCard post={post} />);

  expect(screen.getByText('My Blog Post')).toBeInTheDocument();
});
```

### 2. User Interaction Tests

Test user actions using `userEvent`:

```tsx
import { renderWithRouter, screen, userEvent } from '../test-utils';

test('toggles menu when button is clicked', async () => {
  const user = userEvent.setup();
  renderWithRouter(<Navigation />);

  const button = screen.getByRole('button', { name: /menu/i });
  await user.click(button);

  expect(screen.getByRole('navigation')).toBeVisible();
});
```

### 3. Conditional Rendering Tests

Test what appears/disappears based on props:

```tsx
test('shows featured badge for featured posts', () => {
  const featuredPost = createMockBlogPost({ featured: true });
  renderWithRouter(<BlogCard post={featuredPost} />);

  expect(screen.getByText(/featured/i)).toBeInTheDocument();
});

test('does not show featured badge for regular posts', () => {
  const regularPost = createMockBlogPost({ featured: false });
  renderWithRouter(<BlogCard post={regularPost} />);

  expect(screen.queryByText(/featured/i)).not.toBeInTheDocument();
});
```

### 4. Date and Number Formatting Tests

Test data transformations:

```tsx
test('formats date correctly', () => {
  const post = createMockBlogPost({ date: '2024-01-15' });
  renderWithRouter(<BlogCard post={post} />);

  expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
});
```

### 5. Link Navigation Tests

Test routing without actual navigation:

```tsx
test('links to correct blog post page', () => {
  const post = createMockBlogPost({ slug: 'my-post' });
  renderWithRouter(<BlogCard post={post} />);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/blog/my-post');
});
```

### 6. Accessibility Tests

Verify semantic HTML and ARIA attributes:

```tsx
test('renders as an article element', () => {
  const post = createMockBlogPost();
  const { container } = renderWithRouter(<BlogCard post={post} />);

  expect(container.querySelector('article')).toBeInTheDocument();
});
```

## Query Priority

Use queries in this order of preference:

1. **`getByRole`** - Best for semantic HTML elements
   ```tsx
   screen.getByRole('button', { name: /submit/i })
   screen.getByRole('heading', { name: /title/i })
   ```

2. **`getByLabelText`** - For form fields
   ```tsx
   screen.getByLabelText(/email/i)
   ```

3. **`getByPlaceholderText`** - For inputs with placeholders
   ```tsx
   screen.getByPlaceholderText(/search/i)
   ```

4. **`getByText`** - For non-interactive content
   ```tsx
   screen.getByText(/hello world/i)
   ```

5. **`getByTestId`** - Last resort only
   ```tsx
   screen.getByTestId('custom-element')
   ```

## Query Variants

- **`getBy...`** - Throws error if not found (use for elements that should exist)
- **`queryBy...`** - Returns null if not found (use for asserting non-existence)
- **`findBy...`** - Returns promise, waits for element (use for async rendering)

```tsx
// Element must exist
const button = screen.getByRole('button');

// Check if element doesn't exist
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// Wait for async element
const asyncContent = await screen.findByText(/loaded/i);
```

## Common Matchers

From `@testing-library/jest-dom`:

```tsx
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveAttribute('href', '/path');
expect(element).toHaveClass('className');
expect(element).toBeDisabled();
expect(element).toBeChecked();
```

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run all tests once (CI mode)
CI=true npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test BlogCard.test

# Run tests matching pattern
npm test -- --testNamePattern="renders title"
```

## Best Practices

### DO ✅

- Test user-facing behavior
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features
- Use mock data factories for consistency
- Keep tests simple and focused
- Test error states and edge cases
- Use `userEvent` for interactions

### DON'T ❌

- Test implementation details (state, props)
- Rely on `getByTestId` as the primary query
- Test third-party library internals
- Create overly complex test setup
- Use shallow rendering (not available in RTL)
- Access component instances directly
- Mock unnecessarily

## Example Test Structure

```tsx
import { renderWithRouter, screen, createMockBlogPost } from '../test-utils';
import BlogCard from './BlogCard';

describe('BlogCard', () => {
  test('renders blog post title and excerpt', () => {
    const post = createMockBlogPost({
      title: 'Test Post',
      excerpt: 'Test excerpt',
    });

    renderWithRouter(<BlogCard post={post} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
  });

  test('links to the correct blog post page', () => {
    const post = createMockBlogPost({ slug: 'my-slug' });

    renderWithRouter(<BlogCard post={post} />);

    const link = screen.getByRole('link', { name: /test post/i });
    expect(link).toHaveAttribute('href', '/blog/my-slug');
  });

  // More tests...
});
```

## Coverage Goals

Aim for meaningful coverage, not 100%:

- **Components**: Focus on user-facing behavior and edge cases
- **Pages**: Test rendering and basic interactions
- **Utils**: Test all branches and edge cases
- **Integration**: Test critical user flows

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Query Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
