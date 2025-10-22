import { renderWithRouter, screen, createMockBlogPost } from '../test-utils';
import BlogCard from './BlogCard';

describe('BlogCard', () => {
  describe('Rendering', () => {
    test('renders blog post title', () => {
      const post = createMockBlogPost({ title: 'My Awesome Blog Post' });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText('My Awesome Blog Post')).toBeInTheDocument();
    });

    test('renders blog post excerpt', () => {
      const post = createMockBlogPost({
        excerpt: 'This is a detailed excerpt about the blog post.'
      });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText('This is a detailed excerpt about the blog post.')).toBeInTheDocument();
    });

    test('renders blog post category', () => {
      const post = createMockBlogPost({ category: 'Technology' });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/Technology/i)).toBeInTheDocument();
    });

    test('renders read time', () => {
      const post = createMockBlogPost({ readTime: 7 });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/7 min read/i)).toBeInTheDocument();
    });

    test('renders as an article element', () => {
      const post = createMockBlogPost();
      renderWithRouter(<BlogCard post={post} />);

      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    test('formats date correctly in US format', () => {
      const post = createMockBlogPost({ date: '2024-01-15T12:00:00' });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/January \d{1,2}, 2024/)).toBeInTheDocument();
    });

    test('handles different date formats', () => {
      const post = createMockBlogPost({ date: '2024-12-25T12:00:00' });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/December \d{1,2}, 2024/)).toBeInTheDocument();
    });

    test('handles single digit dates', () => {
      const post = createMockBlogPost({ date: '2024-03-05T12:00:00' });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/March \d{1,2}, 2024/)).toBeInTheDocument();
    });
  });

  describe('Links and Navigation', () => {
    test('title is a clickable link', () => {
      const post = createMockBlogPost({ title: 'Clickable Post' });
      renderWithRouter(<BlogCard post={post} />);

      const link = screen.getByRole('link', { name: /Clickable Post/i });
      expect(link).toBeInTheDocument();
    });

    test('links to the correct blog post page using slug', () => {
      const post = createMockBlogPost({ slug: 'my-special-post' });
      renderWithRouter(<BlogCard post={post} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/blog/my-special-post');
    });

    test('handles slugs with special characters', () => {
      const post = createMockBlogPost({ slug: 'post-with-dashes-123' });
      renderWithRouter(<BlogCard post={post} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/blog/post-with-dashes-123');
    });
  });

  describe('Styling and CSS Classes', () => {
    test('applies correct CSS classes to article', () => {
      const post = createMockBlogPost();
      renderWithRouter(<BlogCard post={post} />);

      const article = screen.getByRole('article');
      expect(article).toHaveClass('py-4', 'border-b', 'border-gray-300');
    });

    test('applies hover styles to link', () => {
      const post = createMockBlogPost();
      renderWithRouter(<BlogCard post={post} />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:underline');
    });
  });

  describe('Edge Cases', () => {
    test('renders with minimal data', () => {
      const minimalPost = createMockBlogPost({
        title: 'T',
        excerpt: 'E',
        category: 'C',
        readTime: 1,
      });
      renderWithRouter(<BlogCard post={minimalPost} />);

      expect(screen.getByText('T')).toBeInTheDocument();
      expect(screen.getByText('E')).toBeInTheDocument();
      expect(screen.getByText(/C/i)).toBeInTheDocument();
      expect(screen.getByText(/1 min read/i)).toBeInTheDocument();
    });

    test('renders with long content', () => {
      const longPost = createMockBlogPost({
        title: 'A'.repeat(200),
        excerpt: 'B'.repeat(500),
        category: 'Category',
        readTime: 99,
      });
      renderWithRouter(<BlogCard post={longPost} />);

      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument();
      expect(screen.getByText(/99 min read/i)).toBeInTheDocument();
    });

    test('handles zero read time', () => {
      const post = createMockBlogPost({ readTime: 0 });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/0 min read/i)).toBeInTheDocument();
    });

    test('renders with empty tags array', () => {
      const post = createMockBlogPost({ tags: [] });
      renderWithRouter(<BlogCard post={post} />);

      // Should still render other content
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });

    test('renders when featured is true', () => {
      const post = createMockBlogPost({ featured: true });
      renderWithRouter(<BlogCard post={post} />);

      // Featured flag doesn't affect rendering in current implementation
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });

    test('renders when featured is false', () => {
      const post = createMockBlogPost({ featured: false });
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    test('displays category and read time on same line', () => {
      const post = createMockBlogPost({
        category: 'Technology',
        readTime: 5
      });
      renderWithRouter(<BlogCard post={post} />);

      const metaLine = screen.getByText(/Technology · 5 min read/i);
      expect(metaLine).toBeInTheDocument();
    });

    test('separates metadata with bullet point', () => {
      const post = createMockBlogPost();
      renderWithRouter(<BlogCard post={post} />);

      expect(screen.getByText(/·/)).toBeInTheDocument();
    });
  });

  describe('Multiple Cards', () => {
    test('renders multiple blog cards with different content', () => {
      const post1 = createMockBlogPost({
        id: 'post-1',
        title: 'First Post',
        slug: 'first-post'
      });
      const post2 = createMockBlogPost({
        id: 'post-2',
        title: 'Second Post',
        slug: 'second-post'
      });

      renderWithRouter(
        <>
          <BlogCard post={post1} />
          <BlogCard post={post2} />
        </>
      );

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    test('title link is accessible', () => {
      const post = createMockBlogPost({ title: 'Accessible Post' });
      renderWithRouter(<BlogCard post={post} />);

      const link = screen.getByRole('link', { name: /Accessible Post/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAccessibleName('Accessible Post');
    });

    test('semantic HTML structure is correct', () => {
      const post = createMockBlogPost();
      renderWithRouter(<BlogCard post={post} />);

      // Should have article with heading structure
      const article = screen.getByRole('article');
      const heading = screen.getByRole('heading', { level: 2 });

      expect(article).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });
  });
});
