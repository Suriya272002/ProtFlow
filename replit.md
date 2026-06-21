# Fusion Starter — Laundry Shop Management System

A full-stack laundry shop management system with a customer-facing portal and an admin dashboard.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, Radix UI (Shadcn), TanStack Query, React Router, Framer Motion, Three.js
- **Backend**: Node.js + Express (TypeScript), integrated into Vite dev server via a middleware plugin
- **Database**: PostgreSQL (Replit built-in), accessed via Knex.js query builder
- **Package manager**: pnpm (system pnpm at `/nix/store/.../bin/pnpm`)

## Project Structure

- `client/` — React SPA source
- `server/` — Express API routes and Knex DB setup
- `server/migrations/` — Knex migration files (TypeScript)
- `server/seeds/` — Seed data
- `shared/` — Shared TypeScript types (used by both client and server)
- `scripts/migrate.ts` — Migration runner script (uses tsx)

## Running the App

The dev workflow is: `npx vite` (configured on port 5000 with `host: 0.0.0.0`).

The Express backend is embedded as a Vite middleware plugin (see `vite.config.ts` → `expressPlugin()`), so a single Vite process handles both the frontend and all `/api/*` routes in development.

## Database

- Uses Replit's built-in PostgreSQL (env vars: `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`)
- Run migrations: `tsx scripts/migrate.ts migrate`
- Run seeds: `tsx scripts/migrate.ts seed`
- Note: Use system pnpm for scripts to avoid the bundled pnpm v11 Node.js v22 requirement: `/nix/store/61lr9izijvg30pcribjdxgjxvh3bysp4-pnpm-10.26.1/bin/pnpm`

## Deployment

Configured as `autoscale` with:
- Build: `npm run build` (compiles React SPA + Express server)
- Run: `node dist/server/node-build.mjs`

## Key Notes

- The project was originally configured for MySQL. It was adapted to PostgreSQL for Replit.
- `vitest` was removed from devDependencies (blocked by Replit's package firewall).
- MySQL-specific SQL (YEAR(), MONTH()) was replaced with PostgreSQL equivalents (EXTRACT()).
- Insert operations now use `.returning('id')` for PostgreSQL compatibility.

## User Preferences

(none recorded yet)
