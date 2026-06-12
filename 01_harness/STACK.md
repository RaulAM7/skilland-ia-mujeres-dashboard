# STACK

## Runtime/framework
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Recharts
- Zod
- Vercel Functions under root `api/`

## Package manager
- pnpm

## Project layout conventions
- App lives at repository root alongside scaffold folders.
- Frontend: `src/`
- Vercel API routes: `api/`
- Server modules: `server/`
- Mock data: `public/mock-data/`
- Scaffold docs/specs remain in `00_inbox/`, `01_harness/`, `02_context/`, `03_specs/`, `04_outputs/`, `05_scratch/`, `shared/`.

## Build/test/dev commands
- `pnpm dev` — Vite plus local mock API server
- `pnpm build` — TypeScript build plus Vite production build
- `pnpm typecheck` — TypeScript checks
- `pnpm lint` — ESLint
- `pnpm test` — Vitest
