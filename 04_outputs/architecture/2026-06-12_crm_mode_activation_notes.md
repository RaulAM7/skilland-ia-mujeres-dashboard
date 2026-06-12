# CRM Mode Activation Notes — 2026-06-12

## Status

Phase 4C real discovery was not executed because `.env.local` is absent and this shell does not expose `CRM_BASE_URL` or `CRM_API_KEY`.

Current result:

- `pnpm crm:discover` exits with `SKIPPED`.
- `pnpm crm:probe` exits with `SKIPPED`.
- No CRM request was made.
- No runtime object names, campaign fields or metric fields are confirmed.
- Mock mode remains the only trusted local mode.

## Read-Only Boundary

- GraphQL `POST` is allowed only for query, introspection and read operations.
- GraphQL mutations are forbidden.
- REST `POST`, `PUT`, `PATCH` and `DELETE` toward CRM are forbidden.
- The refresh endpoint `POST` is an internal dashboard endpoint and does not write to CRM.

## Public Repo Sanitization

Because this repository is public, committed CRM summaries must not include:

- real person names;
- emails;
- phone numbers;
- notes;
- snippets;
- Gmail/thread/message IDs;
- raw record payloads;
- real organization names from CRM.

Allowed committed findings:

- object names;
- field names;
- field types;
- counts;
- aggregate metrics;
- confirmed mapping;
- gaps;
- warnings.

Raw discovery/probe payloads belong only in ignored `05_scratch/crm-schema/*.json`.

## Required Next Step

Create local `.env.local` outside git with at least:

```env
CRM_PROVIDER=twenty
CRM_BASE_URL=
CRM_API_KEY=
CRM_API_MODE=graphql
CRM_CAMPAIGN_KEY=ia-mujeres
DASHBOARD_DATA_MODE=crm
```

Then run:

```bash
pnpm crm:discover
pnpm crm:probe
```

Only after `pnpm crm:probe` confirms a reliable IA Mujeres campaign filter should `TwentyIaMujeresRepository` be trusted for live CRM mode.
