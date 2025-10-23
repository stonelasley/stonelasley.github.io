# AGENTS Instructions

## Scope
These guidelines apply to the entire repository unless a nested `AGENTS.md` overrides them.

## Project Notes
- The site is a Create React App project written in TypeScript. Follow existing patterns in `src/pages`, `src/components`, and the Notion content utilities in `scripts/` when adding new functionality.
- Prefer existing helper utilities and styles before introducing new dependencies. Reach for `tailwind.config.js` tokens and shared components when possible.
- Generated content that ships with the site (e.g., Notion exports) belongs under `public/` or existing data helpers. Coordinate with build scripts in `scripts/` if you need new data sources.
- Review `CLAUDE.md` before starting work. It documents the architecture, Notion content flow, and additional expectations that apply to contributors using any tooling (not just Claude).

## Key Commands
- `npm run fetch-content` – pulls the latest content from Notion and generates JSON artifacts under `src/data/notion/`. Run this before builds that depend on fresh data.
- `npm start` – launches the development server with hot reload.
- `npm test` – starts the Jest watch mode configured by Create React App.
- `npm run lint` – executes ESLint with the TypeScript project configuration.
- `npm run lint:fix` – runs ESLint with auto-fixes where possible.
- `npm run build` – produces the production bundle (automatically runs `fetch-content` first).
- `npm run deploy` – builds and publishes to GitHub Pages; rely on CI for routine deploys.

## Environment Checklist
Ensure the following environment variables are provided when running the Notion fetch script (`npm run fetch-content`) or the production build:
- `NOTION_API_KEY`
- `BLOG_DATABASE_ID`
- `RECIPE_DATABASE_ID`
- Optional for enhanced recipe data: `INGREDIENT_DATABASE_ID` and `RECIPE_INGREDIENT_DATABASE_ID`
- Optional for the hidden meal prep page: `MEALPREP_PAGE_ID`

## Workflow Expectations
- Use `npm` with the provided `package-lock.json`. Do not switch package managers.
- Document any new environment variables in `README.md` or an appropriate `.env.example` if you introduce them.
- Keep accessibility in mind—ensure new UI has appropriate roles, labels, and keyboard support.

## Required Checks
Run the following commands locally (or in this environment) before finishing your work:
- `npm run lint`
- `npm run build`

Include the results of these commands in your final response.
