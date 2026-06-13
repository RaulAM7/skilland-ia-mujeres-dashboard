# IA Mujeres Dashboard Progress Handoff — 2026-06-13

## Purpose

This handoff freezes the current state of the IA Mujeres dashboard so work can resume later without replaying prior iterations.

It covers:

- what is implemented and already pushed;
- what is verified today;
- what is still blocked;
- what should happen next depending on whether `.env.local` exists.

## Authoritative Current State

- Repository: `skilland-ia-mujeres-dashboard`
- Branch: `main`
- Remote tracking: `origin/main`
- Working tree: clean
- Latest pushed commit at handoff time: `86f16a8 Surface recent outreach batches in overview`
- `.env.local`: absent
- CRM real mode: not active
- Dev server status at handoff time: stopped deliberately

This means the project is still in **Variant A** of the documented autonomous goal flow.

## What Is Already Implemented

### 1. Root App / Runtime / Tooling

Implemented:

- Root Vite + React + TypeScript app at repository root.
- Tailwind-based admin-style UI.
- Root `api/` Vercel Functions layout.
- Root `server/` modules for snapshot/API/CRM logic.
- `pnpm` scripts for dev, build, test, lint, typecheck, CRM discovery, CRM probe.
- CI workflow for mock-safe checks.
- Vercel mock deployment documentation and checklist.

Stable commands:

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm crm:discover
pnpm crm:probe
```

### 2. Mock Snapshot MVP

Implemented:

- Dashboard-owned snapshot contract and schema validation.
- Mock snapshot under `public/mock-data/ia-mujeres-snapshot.mock.json`.
- Mock repository feeding the UI through `/api/ia-mujeres/snapshot`.
- Safe `refresh` endpoints with protected/no-op behavior.
- Unknown-stage handling and `partial/error` safe snapshot behavior.

Current data mode behavior:

- `DASHBOARD_DATA_MODE=mock` -> full local dashboard experience.
- `DASHBOARD_DATA_MODE=crm` -> defensive CRM path exists, but not activated here because `.env.local` is absent.

### 3. CRM / Twenty Read-Only Foundation

Implemented:

- `TwentyClient` server-only read client.
- read-only GraphQL/REST safeguards:
  - GraphQL `POST` only for read queries/introspection;
  - GraphQL mutations blocked;
  - REST `POST/PUT/PATCH/DELETE` to CRM blocked.
- `TwentyIaMujeresRepository` defensive foundation.
- centralized Twenty mapping file.
- server-only `.env.local` loader for scripts and local dev API.
- safe `crm:discover` and `crm:probe` scripts.

What is **not** yet validated:

- real workspace schema discovery;
- real IA Mujeres campaign filter;
- real object names/field names;
- trusted runtime mapping;
- local CRM read-only snapshot.

### 4. Human Preflight / Autonomous Goal Protocol

Implemented:

- human secrets preflight doc;
- human decision checklist;
- pre-goal autonomy protocol;
- goal-ready prompt with Variant A and Variant B.

These files are already the source of truth for safe autonomous continuation:

- `04_outputs/architecture/2026-06-13_human_secrets_preflight.md`
- `04_outputs/architecture/2026-06-13_human_decision_checklist.md`
- `04_outputs/architecture/2026-06-13_pre_goal_autonomy_protocol.md`
- `04_outputs/architecture/2026-06-13_goal_ready_prompt.md`

## What The UI Already Does

### Overview

Implemented:

- KPI cards;
- snapshot health banner;
- lazy-loaded funnel chart;
- next actions panel;
- alerts panel;
- tasks table;
- manual review queue preview;
- recent outreach batches table.

Notable behavior:

- KPI cards navigate to filtered dashboard views.
- manual review queue is surfaced directly in Overview, not hidden only in Operation.
- recent batches come from the snapshot contract field `batches`, which is now actually used.

### Funnel

Implemented:

- chart + stage table;
- local filters for:
  - text search;
  - stage;
  - technical outcome;
- filters persisted in the URL;
- active filter badges;
- clear-filter action;
- opportunity table;
- focused entity panel when filters narrow to one opportunity.

Notable behavior:

- routes like `/ia-mujeres/funnel?stage=NOT_SENT&outcome=sent_without_bounce&q=...` are supported.
- focused entity panel links into Operation with entity context.

### Operation

Implemented:

- KPI summary for tasks;
- snapshot health banner;
- next actions + alerts;
- queue filters:
  - all;
  - overdue;
  - follow-up;
  - review;
- queue filters persisted in the URL;
- entity-scoped filtering;
- focused entity panel;
- task table;
- manual review queue.

Notable behavior:

- Operation accepts `?filter=` and `?entity=` query params.
- queue counts are recalculated within the current entity scope.

### Debug

Implemented:

- status;
- generated timestamp;
- data mode;
- provider;
- campaign key;
- runtime verified;
- warnings count;
- batches count;
- CRM configured;
- records read;
- schema discovery status;
- safe last error;
- warnings list;
- raw snapshot panel in local/dev only;
- CRM readiness panel.

The CRM readiness panel is important because it now explains, from the current snapshot alone:

- whether mock or CRM mode is active;
- whether credentials appear configured;
- whether schema discovery is available;
- whether runtime mapping is verified;
- whether there is evidence of safe IA Mujeres scoping;
- what the next safe step is.

## Product / UX Work Completed During Autonomous Variant A

The following areas were advanced after the mock MVP and CRM foundation existed:

### Navigation and routing

- client-side navigation without full reloads;
- route normalization to `/ia-mujeres`;
- route persistence for Funnel filters;
- route persistence for Operation filters;
- query-aware navigation updates.

### Operational drill-down

- KPI cards now jump to relevant filtered views;
- alerts now jump to relevant filtered queues;
- next actions now jump to relevant filtered queues;
- tasks link to related entity context;
- manual review items link to funnel context;
- opportunities link to entity-scoped operation context;
- focused entity panels close the loop between Funnel and Operation.

### Snapshot resilience

- shared snapshot schema between server and client;
- safe client-side validation of API payloads;
- transport warnings do not blank the UI if a valid snapshot still exists;
- reload controls preserve current data while refreshing;
- stale parallel reloads are ignored safely.

### Empty / partial / health states

- explicit empty states across tables and panels;
- snapshot health banners on main pages;
- CRM readiness summary in Debug;
- local-only raw snapshot visibility in Debug.

### Contract usage coverage

Fields now meaningfully surfaced in the UI include:

- `kpiCards`
- `funnelStages`
- `alerts`
- `tasks`
- `opportunities`
- `warnings`
- `source`
- `batches`

Fields still underused in the UI:

- `technicalEmailOutcomes` is present in the contract and mock data, but still does not have a dedicated panel.

## Verification Status

Last fully green code verification before this handoff:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
jq empty public/mock-data/ia-mujeres-snapshot.mock.json
pnpm crm:discover
pnpm crm:probe
```

Result at the latest safe checkpoint:

- `pnpm typecheck` OK
- `pnpm lint` OK
- `pnpm test` OK
- `pnpm build` OK
- `jq empty public/mock-data/ia-mujeres-snapshot.mock.json` OK
- `pnpm crm:discover` -> `SKIPPED Twenty schema discovery: missing CRM_BASE_URL, CRM_API_KEY.`
- `pnpm crm:probe` -> `SKIPPED IA Mujeres CRM probe: missing CRM_BASE_URL, CRM_API_KEY.`

Test scale at latest green checkpoint:

- `36` test files
- `90` tests

Build notes:

- production build is green;
- the separate `funnel-stage-chart` chunk remains large, but the main bundle warning that previously mattered was already mitigated by code-splitting.

## Safety State

Verified at handoff:

- no `.env` file in repo;
- no `.env.local` file in repo;
- `.env.local` remains ignored by git;
- no real CRM secrets committed;
- no `VITE_CRM_API_KEY` runtime usage;
- no CRM write-back;
- no GraphQL mutations;
- no REST `POST/PUT/PATCH/DELETE` toward CRM;
- raw CRM scratch outputs remain outside versioned deliverables.

## Important Known Constraint

The main blocker has not changed:

- `.env.local` is absent.

Because of that:

- real discovery cannot run;
- real probe cannot run;
- real field mapping cannot be confirmed;
- CRM read-only mode cannot be trusted;
- Vercel CRM env setup must not proceed yet.

This is a **real blocker for Variant B**, but **not** a blocker for continued Variant A UI/docs/tests/mock work.

## What Still Remains To Be Done

### A. Human prerequisite before CRM work

Someone must create local `.env.local` with at least:

```env
DASHBOARD_DATA_MODE=crm
DASHBOARD_ENV=local
CRM_PROVIDER=twenty
CRM_BASE_URL=https://<crm-url>
CRM_API_KEY=
CRM_API_MODE=graphql
CRM_CAMPAIGN_KEY=ia-mujeres
CRON_SECRET=<local-random-secret>
DASHBOARD_REFRESH_SECRET=<local-random-secret>
```

Do not commit that file.

### B. Variant B work once `.env.local` exists

Execute in this order:

1. `pnpm crm:discover`
2. `pnpm crm:probe`
3. inspect sanitized summaries
4. confirm or reject a reliable IA Mujeres campaign filter
5. update mapping from runtime-confirmed findings only
6. validate `DASHBOARD_DATA_MODE=crm pnpm dev`
7. inspect `/api/ia-mujeres/snapshot`
8. accept `ok` or `partial`; reject unsafe/ambiguous CRM mode

### C. Vercel CRM work after local CRM success

Only after local CRM read-only works safely:

1. decide whether repo/deployment should remain public;
2. enable deployment protection if real data will be exposed;
3. configure CRM env vars in Vercel;
4. validate preview deployment before any broader exposure.

## Highest-Value Next Steps If No Secrets Exist Yet

If the next autonomous run still has no `.env.local`, the most useful remaining Variant A work is:

1. surface `technicalEmailOutcomes` in Overview or Funnel as a proper operational panel;
2. continue improving contract coverage rather than adding ornamental UI;
3. expand Debug with more explicit mock-vs-CRM cues only if they help future activation;
4. keep tests/docs strong and avoid refactors that do not move the dashboard forward.

The next best Variant A unit is therefore likely:

- **use `technicalEmailOutcomes` in the UI**, because that contract field is present, verified in mock data, and still underused.

## Highest-Value Next Steps If Secrets Exist Later

If `.env.local` exists in the next run:

1. switch immediately to Variant B;
2. run discovery/probe before any CRM UI assumption;
3. do not trust any field names until runtime-confirmed;
4. do not read global CRM data if campaign scoping is ambiguous;
5. keep committed outputs sanitized.

## Recent Commit Ledger

Most recent commits relevant to the current safe state:

- `86f16a8 Surface recent outreach batches in overview`
- `e67e78e Surface CRM readiness in debug view`
- `dc3b185 Reuse focused entity context across funnel and operation`
- `244a6bb Link opportunity rows to entity-scoped operation view`
- `a56c3de Add entity-aware operation drill-down`
- `4582346 Humanize technical outcome labels across the dashboard`
- `4687a2d Surface focused funnel entities with related task context`
- `41c2345 Add entity drill-down links from review and task queues`
- `67741d8 Sort filtered dashboard queues by urgency`
- `8300db3 Show and clear active dashboard filters`
- `84cf21b Link KPI cards to filtered dashboard views`
- `92a3841 Make next actions link to filtered views`

Earlier work in the same stream also covered:

- snapshot/client schema sharing;
- transport warning handling;
- reload controls;
- empty states;
- test expansion;
- build chunk cleanup;
- autonomous protocol docs.

## One Practical Note About The Last Dev Session

During the last live dev session, Vite briefly showed an HMR import error for `batches-table` while the file was being created.

That was an intermediate dev-only state, not the final repository state.

The authoritative state is:

- file exists in repo;
- tests passed after the file existed;
- build passed after the file existed;
- repo was clean after push.

So if that error is ever seen in a stale browser tab, restart `pnpm dev`.

## Resume Command Pattern

When resuming later:

1. read:
   - `01_harness/RULES.md`
   - `01_harness/STACK.md`
   - `01_harness/TASKFLOW.md`
   - `04_outputs/architecture/2026-06-13_pre_goal_autonomy_protocol.md`
   - `04_outputs/architecture/2026-06-13_human_secrets_preflight.md`
   - `04_outputs/architecture/2026-06-13_goal_ready_prompt.md`
   - this handoff file
2. check:
   - `git status -sb`
   - `.env.local` presence
3. choose:
   - Variant A if `.env.local` is absent
   - Variant B if `.env.local` exists with `CRM_BASE_URL` and `CRM_API_KEY`

## Short Resume Summary

If you need the shortest possible truthful summary:

- The mock dashboard is solid and already quite usable.
- CRM/Twenty read-only foundation exists but is **not activated** because `.env.local` is absent.
- Autonomous Variant A work has mostly been improving operational UX, contract coverage, tests, and debug readiness.
- The next meaningful branch point is still `.env.local`.
- If secrets are still absent, the next best work item is to surface `technicalEmailOutcomes` in the UI.
