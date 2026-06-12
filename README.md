# SkilLand IA Mujeres Dashboard

Internal, read-only dashboard for the SkilLand IA Mujeres funnel. The app is a root Vite/React/Vercel project that lives alongside the agent scaffold folders.

The MVP runs in mock mode. It does not connect to real CRM, send emails, create drafts, edit opportunities, or perform write-back.

## Local Development

```bash
corepack enable
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal and use:

- `/ia-mujeres`
- `/ia-mujeres/funnel`
- `/ia-mujeres/operation`
- `/ia-mujeres/debug`

`pnpm dev` runs Vite plus a local mock API server for `/api`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

## Deploying mock dashboard to Vercel

Connect this repository to Vercel as a Vite project.

- Framework preset: `Vite`
- Build command: `pnpm build`
- Output directory: `dist`
- Package manager: `pnpm`

Set only mock-safe environment variables for the first deployment:

```env
DASHBOARD_DATA_MODE=mock
DASHBOARD_ENV=production
CRON_SECRET=<set in Vercel only if GET refresh is used>
DASHBOARD_REFRESH_SECRET=<set in Vercel only if POST refresh is used>
```

Do not configure `CRM_API_KEY` or `CRM_BASE_URL` until the CRM/Twenty schema discovery phase is complete. Do not configure any `VITE_CRM_API_KEY`; CRM credentials are server-side only and must never be exposed to browser code.

If future snapshots include internal or sensitive operational data, protect the deployment with Vercel access controls or dashboard auth before sharing the URL.

## API Endpoints

- `GET /api/ia-mujeres/snapshot` returns a validated mock snapshot by default.
- `GET /api/ia-mujeres/refresh` is reserved for Vercel Cron and requires `CRON_SECRET`.
- `POST /api/ia-mujeres/refresh` is reserved for manual admin refresh and requires `DASHBOARD_REFRESH_SECRET`.

Refresh currently returns a controlled response because persistent cache is phase 2.

## Data Mode

Default mode is mock:

```env
DASHBOARD_DATA_MODE=mock
```

CRM mode is intentionally stubbed until `CRM_BASE_URL`, `CRM_API_KEY`, and the runtime Twenty schema are verified.

Never use `VITE_CRM_API_KEY`. CRM credentials are server-side only.

## Scaffold

The project still follows the repo harness:

1. Raw material: `00_inbox/`
2. Context: `02_context/`
3. Active specs: `03_specs/now/`
4. Deliverables: `04_outputs/`
5. Scratch: `05_scratch/`
