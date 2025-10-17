# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HYROX Session Spots - A Next.js application for managing and displaying HYROX fitness locations with regional categorization. Built with Next.js 15, React 19, TypeScript, Drizzle ORM, and PostgreSQL.

## Development Commands

### Running the Application
```bash
# Start development server with Turbopack
pnpm dev

# Build for production (uses Turbopack)
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Database Operations
```bash
# Generate database migrations
pnpm drizzle-kit generate

# Push schema changes to database
pnpm drizzle-kit push

# Open Drizzle Studio for database management
pnpm drizzle-kit studio
```

## Architecture

### Database Layer (`src/db/`)
- **Schema**: `src/db/schema.ts` - Drizzle ORM schema definitions
  - `regions` table: Regional categories for filtering (1:1 with hyroxbox)
  - `hyroxbox` table: HYROX location details (name, address, Instagram, price, features, Naver Map URL)
  - Relations defined using Drizzle's `relations()` for one-to-one relationships
- **Client**: `src/db/index.ts` - PostgreSQL client using `postgres` package with Drizzle ORM
- **Configuration**: `drizzle.config.ts` - Points to PostgreSQL database, migrations in `supabase/migrations/`

### Environment Configuration
- Database connection via `DATABASE_URL` in `.env.local` or `.env`
- Drizzle config loads from `.env.local` by default

### Application Structure
- **Next.js App Router**: Uses `src/app/` directory structure
- **UI Components**: Radix UI primitives in `src/components/ui/`
- **Styling**: Tailwind CSS v4 with `class-variance-authority` and `clsx`
- **Path Aliases**: `@/*` maps to `src/*` (configured in `tsconfig.json`)
- **Route Groups**: Admin routes under `src/app/(admin)/admin/`

### Key Dependencies
- **Forms**: `react-hook-form` with `@hookform/resolvers` and `zod` validation
- **UI Library**: Comprehensive Radix UI component collection
- **Database**: `drizzle-orm` with `postgres` driver
- **Date Handling**: `date-fns` and `react-day-picker`
- **State Management**: `zustand`
- **Styling Utilities**: `tailwind-merge`, `clsx`, `class-variance-authority`

## Important Notes

### Database Schema Changes
When modifying `src/db/schema.ts`:
1. Generate migration: `pnpm drizzle-kit generate`
2. Review the generated SQL in `supabase/migrations/`
3. Apply with `pnpm drizzle-kit push`

### Turbopack Usage
This project uses Turbopack (Next.js's faster bundler) for both dev and build. All build commands include the `--turbopack` flag.

### TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Path aliases: Use `@/` for imports from `src/`
