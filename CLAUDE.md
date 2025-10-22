# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/portfolio project built with Create React App and TypeScript, using **Notion as a CMS**. Content (blog posts and recipes) is fetched from Notion databases at build time and converted to static JSON files. The site is deployed to GitHub Pages with automated content updates.

## Key Commands

### Development
- `npm run fetch-content` - Fetch content from Notion and generate JSON files
- `npm start` - Start development server at http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- `npm run lint:fix` - Run ESLint and automatically fix issues where possible
- `npm run build` - Create production build (automatically runs `fetch-content` first)

### Deployment
- `npm run deploy` - Build and deploy to GitHub Pages manually
- Automated deployment via GitHub Actions on push to `master` and daily at 2 AM UTC

## Architecture

### Tech Stack
- **React 19.2.0** with TypeScript 4.9.5
- **Create React App 5.0.1** (standard CRA structure, not ejected)
- **React Router DOM 7.9.4** for client-side routing
- **Tailwind CSS 4.1.14** for styling
- **Notion API** (@notionhq/client 5.2.0) for content management
- **notion-to-md** for converting Notion blocks to Markdown
- **react-markdown** with remark-gfm for rendering content
- **Testing**: React Testing Library + Jest (configured via `react-scripts`)
- **Deployment**: GitHub Pages via GitHub Actions

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Site navigation with mobile menu
│   ├── BlogCard.tsx     # Blog post preview card
│   ├── BlogList.tsx     # Blog listing with filters
│   ├── RecipeCard.tsx   # Recipe preview card
│   └── RecipeList.tsx   # Recipe listing with filters
├── pages/              # Page-level components (routes)
│   ├── Home.tsx        # Landing page with featured content
│   ├── Blog.tsx        # Blog listing page
│   ├── BlogPost.tsx    # Individual blog post view
│   ├── Recipes.tsx     # Recipe listing page
│   └── RecipeDetail.tsx # Individual recipe view
├── data/
│   └── notion/         # Generated JSON files (gitignored)
│       ├── blog-posts.json
│       ├── recipes.json
│       └── metadata.json
├── App.tsx             # Main app with routing setup
└── index.tsx           # Application entry point

scripts/
└── fetch-notion-content.js  # Fetches content from Notion at build time

.github/
└── workflows/
    └── deploy.yml      # GitHub Actions workflow for automated deployment

public/
└── images/
    └── notion/         # Downloaded images from Notion (gitignored)
```

### Content Flow
1. Content is created/edited in Notion databases (Blog & Recipe)
2. `fetch-notion-content.js` script fetches content via Notion API
3. Notion blocks are converted to Markdown using notion-to-md
4. Images are downloaded and saved locally (Notion URLs expire after 1 hour)
5. Static JSON files are generated in `src/data/notion/`
6. React app imports and renders the JSON data
7. Site is built and deployed to GitHub Pages

### Notion Database Schemas

**Blog Database Properties:**
- Title (title), Status (select), Date (date), Tags (multi-select)
- Category (select), Excerpt (text), Author (text), Slug (text)
- Featured (checkbox), ReadTime (number)
- Content in page body blocks

**Recipe Database Properties:**
- Name (title), Status (select: Draft/Published/Archive)
- Description (text), PrepTime (number), CookTime (number)
- Category (select), Difficulty (select), Servings (number)
- Tags (multi-select), Favorite (checkbox)
- Content in page body blocks

### Routing Structure
- `/` - Home page (featured posts and recipes)
- `/blog` - All blog posts with filtering
- `/blog/:slug` - Individual blog post
- `/recipes` - All recipes with filtering
- `/recipes/:slug` - Individual recipe

### Environment Variables
Required in `.env.local` for local development and as GitHub Secrets:
- `NOTION_API_KEY` - Notion integration token
- `BLOG_DATABASE_ID` - Notion blog database ID
- `RECIPE_DATABASE_ID` - Notion recipe database ID

### TypeScript Configuration
- Target: ES5
- Strict mode enabled
- JSX: react-jsx (new JSX transform)
- Module resolution: Node

### Code Quality & Linting
- **ESLint** configured via Create React App
- Extends `react-app` and `react-app/jest` configurations
- **IMPORTANT**: Always run `npm run lint` before committing code
- Use `npm run lint:fix` to automatically fix common issues
- All TypeScript/TSX files must pass linting checks
- Linting checks types, React best practices, and code style

### Git Workflow
- Main branch: `master`
- Deploy target: GitHub Pages (via GitHub Actions)
- Content files (`src/data/notion/*.json`) are gitignored (generated at build time)
- Downloaded images (`public/images/notion/*`) are gitignored

### GitHub Actions Workflow
- Triggers: Push to `master`, daily schedule (2 AM UTC), manual dispatch
- Steps: Checkout → Install deps → Fetch Notion content → Build → Deploy to GitHub Pages
- Uses repository secrets for Notion API credentials

## Important Notes

### Content Management
- All content is managed in Notion - no code changes needed to add/edit content
- Blog posts and recipes must have Status = "Published" to appear on the site
- Slugs are auto-generated from titles/names if not provided
- Images are automatically downloaded and cached during build

### Development Workflow
1. Create/edit content in Notion
2. Run `npm run fetch-content` locally to test
3. **Run `npm run lint` to check for code quality issues**
4. **Fix any linting errors before committing**
5. Push changes to trigger automatic deployment
6. Content updates daily via scheduled GitHub Action

### Styling
- Tailwind CSS is configured with default theme
- Custom styles in component files using Tailwind classes
- Responsive design: mobile-first approach
- Dark mode: Not currently implemented (can be added)

### Performance
- Static JSON files = fast load times
- No runtime API calls to Notion
- Images cached locally to avoid Notion URL expiration
- React Router for client-side navigation

### Testing
- Tests use React Testing Library conventions
- Prefer `screen` queries and user-centric testing
- Run tests with `npm test`

### Deployment
- Automatic deployment on push to `master`
- Manual deployment: `npm run deploy`
- GitHub Pages serves from `build/` directory
- Daily content refresh at 2 AM UTC

### Common Tasks
- **Add new blog post**: Create page in Notion Blog database with Status="Published"
- **Add new recipe**: Create page in Notion Recipe database with Status="Published"
- **Update content**: Edit in Notion, wait for next build or trigger manually
- **Customize styling**: Edit Tailwind classes in component files
- **Add new page**: Create component in `src/pages/`, add route in `App.tsx`

### Troubleshooting
- If content not updating: Check GitHub Actions logs
- If images not loading: Verify they're in `public/images/notion/`
- If build fails: Check Notion API credentials in GitHub Secrets
- Rate limiting: Notion API limited to 3 requests/second (handled with delays)
