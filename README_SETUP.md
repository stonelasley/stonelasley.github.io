# Notion-Powered Portfolio Setup Guide

This guide will help you set up your Notion-powered portfolio website.

## Prerequisites

- Node.js 16+ installed
- A Notion account
- A GitHub account

## Step 1: Set Up Notion

### Create Notion Databases

1. **Blog Database**: Create a new database in Notion with these properties:
   - Title (title)
   - Status (select: Draft/Published/Archive)
   - Date (date)
   - Tags (multi-select)
   - Category (select)
   - Excerpt (text)
   - Author (text)
   - Slug (text)
   - Featured (checkbox)
   - ReadTime (number)

2. **Recipe Database**: Create another database with these properties:
   - Name (title)
   - Status (select: Draft/Published/Archive)
   - Description (text)
   - PrepTime (number)
   - CookTime (number)
   - Category (select: Breakfast/Lunch/Dinner/Dessert/Snack)
   - Difficulty (select: Easy/Medium/Hard)
   - Servings (number)
   - Tags (multi-select)
   - Favorite (checkbox)

### Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Portfolio Website")
4. Select the workspace where your databases are
5. Click "Submit"
6. Copy the "Internal Integration Token" (this is your `NOTION_API_KEY`)

### Share Databases with Integration

1. Open your Blog database in Notion
2. Click the "..." menu in the top right
3. Click "Add connections"
4. Select your integration
5. Repeat for the Recipe database

### Get Database IDs

1. Open your Blog database in Notion
2. Look at the URL: `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` part (32 characters, letters and numbers)
4. Repeat for the Recipe database

## Step 2: Local Development Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your actual values:
```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BLOG_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECIPE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Fetch Content and Run Locally

```bash
# Fetch content from Notion
npm run fetch-content

# Start development server
npm start
```

Your site should open at http://localhost:3000

## Step 3: Deploy to GitHub Pages

### Configure Repository

1. Update `package.json`:
   - Change `homepage` to: `https://YOUR_USERNAME.github.io/REPO_NAME`

2. Push your code to GitHub

### Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add these secrets:
   - `NOTION_API_KEY`: Your Notion API key
   - `BLOG_DATABASE_ID`: Your Blog database ID
   - `RECIPE_DATABASE_ID`: Your Recipe database ID

### Enable GitHub Pages

1. Go to "Settings" → "Pages"
2. Under "Source", select "GitHub Actions"

### Deploy

The GitHub Action will automatically:
- Run on every push to `master` branch
- Run daily at 2 AM UTC to fetch fresh content
- Can be triggered manually from the "Actions" tab

## Step 4: Create Content in Notion

### Writing Blog Posts

1. Add a new page to your Blog database
2. Set the Status to "Published"
3. Fill in all required fields (Title, Date, Excerpt, etc.)
4. Write your content in the page body
5. The website will update on the next build

### Adding Recipes

1. Add a new page to your Recipe database
2. Fill in all fields (Name, Description, Times, etc.)
3. Write ingredients and instructions in the page body using headings:
   ```markdown
   ## Ingredients
   - Item 1
   - Item 2

   ## Instructions
   1. Step 1
   2. Step 2
   ```

## Customization

### Branding

Edit these files to customize your site:
- `src/components/Navigation.tsx`: Change "My Portfolio" to your name/brand
- `src/App.tsx`: Update footer text
- `public/index.html`: Update title and meta tags

### Styling

- Tailwind classes are used throughout
- Edit `tailwind.config.js` to customize colors/fonts
- Modify component files to change layout

### Adding More Content Types

1. Create a new Notion database
2. Add environment variable for the database ID
3. Update `scripts/fetch-notion-content.js` to fetch the new content type
4. Create new components and pages for the content

## Troubleshooting

### Content not fetching

- Verify your Notion API key is correct
- Ensure databases are shared with the integration
- Check database IDs are correct (32 characters)

### Build errors

- Make sure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Images not loading

- Notion images are downloaded during build
- Check `public/images/notion/` folder
- Images are cached locally to avoid expiration

## Useful Commands

```bash
# Fetch latest content from Notion
npm run fetch-content

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to GitHub Pages (manual)
npm run deploy
```

## Support

For issues with:
- **Notion API**: https://developers.notion.com/docs
- **React**: https://react.dev/
- **GitHub Pages**: https://docs.github.com/pages

## License

MIT
