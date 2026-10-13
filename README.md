# Gbert Pilapil portfolio

Astro site on Cloudflare Workers. Content lives in a Cloudflare D1 database.
The plan and what is still to build are in [docs/phase-1-plan.md](docs/phase-1-plan.md).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Run the site locally at http://localhost:4321 |
| `npm test` | Run the model and repository tests |
| `npm run build` | Type-check and build |
| `npm run deploy` | Build and publish to Cloudflare |
| `npm run db:migrate` / `db:migrate:remote` | Create or update the tables (local / live) |
| `npm run db:seed` / `db:seed:remote` | Replace all content with what is in `seed.sql` (local / live) |
| `npm run resume:upload` / `resume:upload:remote` | Replace the resume with `content/resume.pdf` (local / live). No redeploy needed. |

First run on a new machine: `npm install`, `npm run db:migrate`, `npm run db:seed`, then `npm run dev`.

## Where things are

| To change | Edit |
|---|---|
| Projects, experience, skills, tech stack | `seed.sql`, then run the seed command |
| Name, tagline, summary, about text, contact links | `src/site.ts` |
| The resume PDF | `content/resume.pdf`, then run the resume upload command |
| A theme's colors, fonts and decorations | `src/styles/themes/<theme>.css` |
| The list of themes and their order | `src/themes.ts` |
| A section's layout | `src/components/` and `src/styles/global.css` |
| Database tables | a new file in `migrations/` |
| Models and database access | `src/lib/models/` and `src/lib/repositories/` |

## Dashboard

The private dashboard is at `/admin`. It can add, edit and delete projects (with picture upload) and replace the resume.

- **Who gets in:** Cloudflare Access puts a login in front of `/admin` on gbertpilapil.com. The site also checks Access's signed token itself (`src/middleware.ts`, `src/lib/access.ts`), so the workers.dev address can't be used to get around the login.
- **Settings:** `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` and `ADMIN_EMAIL` under `vars` in `wrangler.jsonc`. While the first two are empty the dashboard answers "not set up yet" to everyone.
- **On your own machine:** `npm run dev` skips the login, so `http://localhost:4321/admin` opens directly and edits your local copy of the data.
- **Undoing a mistake:** the live database can be rolled back to any point in the last 30 days with `npx wrangler d1 time-travel restore gbert-portfolio --timestamp=<when>`.
