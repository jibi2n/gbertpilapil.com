# Gbert Pilapil portfolio

Astro site on Cloudflare Workers. Content lives in a Cloudflare D1 database.
The plan and what is still to build are in [phase-1-plan.md](phase-1-plan.md).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Run the site locally at http://localhost:4321 |
| `npm test` | Run the model and repository tests |
| `npm run build` | Type-check and build |
| `npm run deploy` | Build and publish to Cloudflare |
| `npm run db:migrate` / `db:migrate:remote` | Create or update the tables (local / live) |
| `npm run db:seed` / `db:seed:remote` | Replace all content with what is in `seed.sql` (local / live) |

First run on a new machine: `npm install`, `npm run db:migrate`, `npm run db:seed`, then `npm run dev`.

## Where things are

| To change | Edit |
|---|---|
| Projects, experience, skills, tech stack | `seed.sql`, then run the seed command |
| Name, tagline, about text, contact links | `src/site.ts` |
| A theme's colors, fonts and decorations | `src/styles/themes/<theme>.css` |
| The list of themes on the slider | `src/themes.ts` |
| A section's layout | `src/components/` and `src/styles/global.css` |
| Database tables | a new file in `migrations/` |
| Models and database access | `src/lib/models/` and `src/lib/repositories/` |
