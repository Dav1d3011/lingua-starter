# Lingua Starter (Next.js + TypeScript + Tailwind)

A free-tier friendly starter for a modular language-learning site.
It includes:
- Next.js App Router
- Tailwind CSS
- Feature Registry pattern
- Two features:
  - Phrases (with search, mock API)
  - Flashcards (simple game, mock API)
- API routes with mock data (replace with a real DB later)

## Quick Start
1. **Install Node.js LTS** (https://nodejs.org)
2. In a terminal:
   ```bash
   npm install
   npm run dev
   ```
   Then open http://localhost:3000

## Deploy for Free
- Push this folder to a GitHub repo.
- Import the repo into **Vercel** → Deploy.
- You’ll get https://yourapp.vercel.app

## Replace Mock Data with a Database (optional)
- Create a **Supabase** project (free).
- Add tables (phrases, cards) and load your data.
- In `app/api/*/route.ts`, query Supabase instead of returning mock arrays.

## Add a New Feature
- Create `features/<your-feature>/index.tsx` that exports a `Feature` object with:
  - `id`, `label`, `route`, `Page`
- Register it once in `app/layout.tsx`:
  ```ts
  import { YourFeature } from '@/features/your-feature';
  featureRegistry.register(YourFeature);
  ```
- Add a route file like `app/your-feature/page.tsx` that renders the registered page:
  ```ts
  import { featureRegistry } from '@/core/registry';
  export default function Page() { const C = featureRegistry.byId('your-id')!.Page; return <C/>; }
  ```

## Notes
- Keep it on free tiers by using mock data or caching translations.
- When ready, add auth (Supabase Auth or Auth.js), analytics, and real SRS logic.
