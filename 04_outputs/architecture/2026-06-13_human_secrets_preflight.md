# Human Secrets Preflight — 2026-06-13

## Purpose

This document defines the human actions required before the IA Mujeres dashboard can safely use real Twenty CRM data.

The dashboard can run in mock mode without secrets. CRM mode must not be trusted until a local `.env.local` exists, discovery/probe have run, and a reliable IA Mujeres campaign filter is confirmed.

## Current State

- `bedda59 Harden Twenty CRM discovery flow` is present in `origin/main`.
- `.env` is absent.
- `.env.local` is absent.
- `.env.local` is ignored by git.
- `05_scratch/crm-schema/*.json` is ignored by git.
- `CRM_BASE_URL` and `CRM_API_KEY` are not exported in this shell.
- `pnpm crm:discover` and `pnpm crm:probe` currently exit safely with `SKIPPED`.

## Create Local `.env.local`

Create this file locally and never commit it:

```text
.env.local
```

Template:

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

Rules:

- Do not commit `.env.local`.
- Do not paste API keys in prompts.
- Do not print API keys in logs.
- Prefer a read-only or role-limited Twenty API key if available.
- If Twenty cannot issue a read-only API key, document that risk before using real CRM data.
- Do not create any `VITE_CRM_API_KEY`.

## Where Codex May Look For Secrets

Codex may inspect only variable names first, not values, in these local sources:

- dashboard `.env.local`;
- `skilland-crm/scripts/.env`;
- `skilland-crm/.cursor/environment.json`;
- any exact local path explicitly approved by Raul.

If only login credentials are found and no API key/base URL exist, Codex must stop and ask for an API key location or for `.env.local` to be created. Codex must not infer or generate an API key from email/password unless Raul explicitly authorizes that separate action.

## Run Real Discovery

After `.env.local` exists:

```bash
pnpm crm:discover
pnpm crm:probe
```

Expected outputs:

- raw redacted JSON: `05_scratch/crm-schema/`;
- sanitized summaries: `04_outputs/data_contract/`.

Committed summaries may contain only:

- object names;
- field names;
- field types;
- counts;
- aggregate metrics;
- confirmed mapping;
- gaps;
- warnings.

Committed summaries must not contain:

- API keys;
- personal emails;
- phone numbers;
- person names;
- real organization names from CRM;
- notes;
- snippets;
- Gmail/thread/message IDs;
- raw record payloads.

## Campaign Filter Gate

Do not activate live CRM mode unless `pnpm crm:probe` confirms a reliable IA Mujeres campaign filter.

If no reliable campaign filter exists:

- do not read all CRM opportunities/tasks globally;
- keep CRM mode in safe `partial` or `error`;
- document the missing campaign filter as a blocker.

## Activate Local CRM Mode

Only after discovery/probe are safe:

```bash
DASHBOARD_DATA_MODE=crm pnpm dev
```

Validate:

```bash
curl http://localhost:5173/api/ia-mujeres/snapshot
```

Then inspect:

- `/ia-mujeres`
- `/ia-mujeres/funnel`
- `/ia-mujeres/operation`
- `/ia-mujeres/debug`

The UI must render `partial` or warnings instead of breaking if fields are missing.

## Future Vercel Env Vars

Configure these in Vercel only after CRM mode works locally:

```text
DASHBOARD_DATA_MODE=crm
DASHBOARD_ENV=production
CRM_PROVIDER=twenty
CRM_BASE_URL=...
CRM_API_KEY=
CRM_API_MODE=graphql
CRM_CAMPAIGN_KEY=ia-mujeres
CRON_SECRET=...
DASHBOARD_REFRESH_SECRET=...
```

Rules:

- First deploy Vercel in mock mode.
- Do not configure CRM env vars in Vercel until local CRM mode succeeds.
- Protect the deployment before real CRM data is exposed.
- Do not deploy production with real CRM data without explicit approval.
