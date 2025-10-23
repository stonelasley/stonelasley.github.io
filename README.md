[![Build and Deploy to GitHub Pages](https://github.com/stonelasley/stonelasley.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/stonelasley/stonelasley.github.io/actions/workflows/deploy.yml)

# 🚀 stonelasley.com

This is the second iteration of my personal website. It replaces a run of the mill Jekyll site with something a little more interesting to work in and "try some stuff". Working in production code bases most of the day I get to try this and that with AI and tooling but I don't have a "production" site where I can rapidly iterate on new processes. This new application will be a test bed for some very heavy AI based automation. 

- The vision of this site is to see how far I can take AI automation for content creation, editing, code generation, and maintenance. The site is currently being written using 90% Claude and Codex, and I'm purposely trying to not hand edit things as much as possible. The Recipes are all openAI modified versions of, mostly, my Mother's recipes.

## ✨ The Magic

This isn't your typical React app. It's a **headless CMS architecture** that treats Notion as the content source of truth, fetches everything at build time, and serves it as lightning-fast static JSON. Content creators get the beautiful Notion editing experience, while visitors get sub-second page loads.

### How It Works

```
Notion Database → API Fetch → Markdown Conversion → Static JSON → React App → GitHub Pages
                      ↓
                 Image Download & Cache (because Notion URLs expire!)
```

1. **Content lives in Notion** - Write blog posts and recipes in the Notion editor you already love
2. **Build-time fetch** - `fetch-notion-content.js` pulls everything via the Notion API
3. **Markdown transformation** - Notion blocks become beautiful Markdown using `notion-to-md`
4. **Image caching** - Downloads and stores images locally (Notion CDN URLs only last 1 hour)
5. **Static generation** - Everything becomes JSON files in `src/data/notion/`
6. **Zero runtime API calls** - React app just imports the pre-generated JSON
7. **Auto-deployment** - GitHub Actions rebuilds daily at 2 AM UTC + on every push

## 🛠️ Tech Stack

- **React 19.2.0** with TypeScript - Modern, type-safe UI
- **Notion API** (@notionhq/client) - Headless CMS backend
- **notion-to-md** - Block-to-Markdown transformation
- **react-markdown** + remark-gfm - Rich content rendering
- **React Router 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **GitHub Actions** - Automated daily content syncs
- **GitHub Pages** - Free, fast static hosting

## 🎯 Features

- **Notion-Powered CMS** - Edit content in Notion, see it live on your site
- **Blog with Filtering** - Tags, categories, search, reading time
- **Recipe Collection** - Prep/cook time, difficulty, servings, favorites
- **Image Caching** - Locally stored images for reliability
- **SEO Optimized** - Dynamic meta tags with react-helmet-async
- **Fully Responsive** - Mobile-first design
- **Type-Safe** - Full TypeScript coverage
- **Daily Auto-Updates** - Content syncs automatically every day

## 🚀 Quick Start

### Prerequisites

You'll need:
- Node.js (v16+)
- A Notion account with API access
- Two Notion databases (Blog & Recipe)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/stonelasley/stonelasley.github.io.git
   cd stonelasley.github.io
   npm install
   ```

2. **Configure Notion**

   Create a `.env.local` file:
   ```env
   NOTION_API_KEY=your_notion_integration_token
   BLOG_DATABASE_ID=your_blog_database_id
   RECIPE_DATABASE_ID=your_recipe_database_id
   ```

3. **Fetch content and start developing**
   ```bash
   npm run fetch-content  # Pull content from Notion
   npm start              # Start dev server at localhost:3000
   ```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run fetch-content` | Fetch fresh content from Notion databases |
| `npm start` | Start development server with hot reload |
| `npm test` | Run tests in interactive watch mode |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run build` | Create production build (auto-fetches content) |
| `npm run deploy` | Build and deploy to GitHub Pages |

## 📝 Content Management

### Creating Blog Posts

In your Notion Blog database, create a page with these properties:
- **Title** (title) - Your post title
- **Status** (select) - Set to "Published" to make it live
- **Date** (date) - Publication date
- **Tags** (multi-select) - Post tags
- **Category** (select) - Post category
- **Excerpt** (text) - Short description
- **Slug** (text) - URL slug (auto-generated if empty)
- **Featured** (checkbox) - Show on homepage
- **ReadTime** (number) - Estimated reading time in minutes

Add your content in the page body using any Notion blocks!

### Creating Recipes

In your Notion Recipe database, create a page with:
- **Name** (title) - Recipe name
- **Status** (select) - Set to "Published" to make it live
- **Description** (text) - Short description
- **PrepTime** (number) - Prep time in minutes
- **CookTime** (number) - Cook time in minutes
- **Category** (select) - Recipe category (Breakfast, Lunch, etc.)
- **Difficulty** (select) - Easy, Medium, or Hard
- **Servings** (number) - Number of servings
- **Tags** (multi-select) - Recipe tags
- **Favorite** (checkbox) - Mark as favorite

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Responsive nav with mobile menu
│   ├── BlogCard.tsx     # Blog post preview cards
│   ├── BlogList.tsx     # Blog listing with filters
│   ├── RecipeCard.tsx   # Recipe preview cards
│   └── RecipeList.tsx   # Recipe listing with filters
├── pages/              # Route components
│   ├── Home.tsx        # Landing page with featured content
│   ├── Blog.tsx        # Blog listing page
│   ├── BlogPost.tsx    # Individual blog post
│   ├── Recipes.tsx     # Recipe listing page
│   └── RecipeDetail.tsx # Individual recipe view
├── data/notion/        # Generated JSON (gitignored)
│   ├── blog-posts.json
│   ├── recipes.json
│   └── metadata.json
└── App.tsx             # Router setup

scripts/
└── fetch-notion-content.js  # Notion API fetcher

.github/workflows/
└── deploy.yml          # Automated deployment
```

## 🔄 Deployment

The site deploys automatically via GitHub Actions when:
- You push to `master` branch
- Daily at 2:00 AM UTC (for content updates)
- You manually trigger the workflow

### GitHub Secrets Required

Add these to your repo settings:
- `NOTION_API_KEY` - Your Notion integration token
- `BLOG_DATABASE_ID` - Your blog database ID
- `RECIPE_DATABASE_ID` - Your recipe database ID

## 🎨 Customization

### Styling
All components use Tailwind CSS utility classes. Customize colors, spacing, and more by editing `tailwind.config.js`.

### Adding Pages
1. Create a component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`

### Notion Schema
Modify the database properties in Notion, then update the corresponding interfaces in your TypeScript files.

## 🧪 Testing

```bash
npm test                # Interactive watch mode
npm run test:ci         # CI mode (no watch)
npm run validate        # Lint + test + build
```

Tests use React Testing Library with user-centric queries.

## 📊 Performance

- **No runtime API calls** - Everything is pre-fetched
- **Cached images** - No reliance on expiring Notion URLs
- **Static site** - Served directly from CDN
- **Client-side routing** - Instant page transitions
- **Optimized builds** - Code splitting and minification

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run `npm run lint` before committing
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Notion](https://notion.so) - For the incredible API and editor
- [Create React App](https://create-react-app.dev/) - For the solid foundation
- [notion-to-md](https://github.com/souvikinator/notion-to-md) - For seamless Markdown conversion
- [GitHub Pages](https://pages.github.com/) - For free, reliable hosting

---

**Built with** ⚛️ React • 📝 Notion • 🎨 Tailwind CSS • 🚀 GitHub Actions

**Visit live:** [stonelasley.com](https://www.stonelasley.com)
