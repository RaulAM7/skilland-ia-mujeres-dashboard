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

CRM mode is read-only and defensive. It requires `CRM_BASE_URL`, `CRM_API_KEY`, and runtime schema discovery before live metrics can be trusted.

Never use `VITE_CRM_API_KEY`. CRM credentials are server-side only.

## CRM/Twenty real mode

Twenty APIs are generated from the workspace schema, so object names and fields must be discovered before trusting dashboard mappings. Official docs: https://docs.twenty.com/developers/extend/api

Configure these variables only outside git, for example in your local shell or Vercel project settings:

```env
DASHBOARD_DATA_MODE=crm
CRM_PROVIDER=twenty
CRM_BASE_URL=https://api.twenty.com
CRM_API_KEY=
CRM_API_MODE=graphql
CRM_CAMPAIGN_KEY=ia-mujeres
```

For local development, `.env.local` may be used because it is ignored by git. The `.env.local` loader is server-only: it is used by Node scripts and the local API server, never by `src/` frontend code. Do not put any `VITE_` CRM variables in `.env.local`.

Create the API key in Twenty under Settings -> API & Webhooks. Use a read-only or role-limited key if the workspace allows it.

Discovery workflow:

```bash
pnpm crm:discover
pnpm crm:probe
```

- `pnpm crm:discover` reads schema/metadata only and writes a redacted raw output under `05_scratch/crm-schema/` plus a summary under `04_outputs/data_contract/`.
- `pnpm crm:probe` samples a small number of records read-only to verify campaign filtering and field availability.
- If CRM env vars are missing, both commands exit safely with a clear `SKIPPED` message.
- These commands do not run in CI and must not be given secrets in frontend env vars.
- Do not configure `CRM_API_KEY` as `VITE_CRM_API_KEY`.

Read-only rules:

- GraphQL `POST` is allowed only for queries, introspection and read operations.
- GraphQL mutations are blocked.
- REST `POST`, `PUT`, `PATCH` and `DELETE` to CRM are blocked.
- If no reliable IA Mujeres campaign filter is confirmed, the dashboard must not read global CRM data as if it were campaign data.
- Because this repository is public, committed summaries must not include real people, emails, phones, notes, snippets, thread ids, record payloads or real organization names from CRM.

## Scaffold

The project still follows the repo harness:

1. Raw material: `00_inbox/`
2. Context: `02_context/`
3. Active specs: `03_specs/now/`
4. Deliverables: `04_outputs/`
5. Scratch: `05_scratch/`
