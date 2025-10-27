# HōcAI Journal Web Stack

This repository hosts a modern [Next.js](https://nextjs.org/) application scaffolded with TypeScript, the App Router, and Tailwind CSS. It includes dynamic category and article routes, SEO metadata, RSS + sitemap feeds, and reusable components for publishing editorial content.

## Prerequisites

- Node.js 18.17 or newer (Next.js 14 requirement)
- npm 9+

## Getting started

Install dependencies:

```bash
npm install
```

Run the local development server at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Available scripts

The project exposes the following npm scripts:

- `npm run dev` – start the Next.js development server.
- `npm run build` – create an optimized production build.
- `npm run start` – run the production server after building.
- `npm run lint` – execute Next.js ESLint configuration.
- `npm run test` – run Vitest in non-watch mode for unit tests.

## Testing & quality

Tailwind CSS powers the responsive layout. Components and routes use semantic HTML and embed schema.org JSON-LD data for SEO. The sitemap, RSS feed, and robots directives are generated via Next.js route handlers so that search engines receive up-to-date metadata for each article.

## Deployment

1. Install dependencies with `npm install`.
2. Run `npm run lint` and `npm run test` to ensure code quality.
3. Build the application with `npm run build`.
4. Deploy the generated `.next` output using your hosting provider (e.g., Vercel, Netlify, Render). For static export, configure an appropriate adapter or use Vercel for optimal support.

Environment variables can be added via `.env.local` for per-environment configuration if needed. Set `NEXT_PUBLIC_SITE_URL` to the fully qualified production domain (for example, `https://magazine.hocai.vn`) so sitemap, RSS, robots, and metadata endpoints emit the correct absolute URLs.
