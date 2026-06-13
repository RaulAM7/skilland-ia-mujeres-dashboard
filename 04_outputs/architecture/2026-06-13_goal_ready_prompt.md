# Goal-Ready Prompt — 2026-06-13

Copy one of these variants into the next run when ready.

## Variant A — No Human Secrets Available

```text
/goal
Objective: Advance the IA Mujeres Dashboard as far as possible without CRM or Vercel secrets.

Use the repo at:
/home/reboot/Escritorio/Skilland.ai/Skilland.ai-CRM/SkilLand-ia-mujeres-dashboard

Follow:
- 01_harness/RULES.md
- 01_harness/STACK.md
- 01_harness/TASKFLOW.md
- 04_outputs/architecture/2026-06-13_pre_goal_autonomy_protocol.md
- 04_outputs/architecture/2026-06-13_human_secrets_preflight.md

Scope:
- Audit repo state.
- Improve docs, tests, error handling, mock UI polish, and Vercel mock readiness.
- Keep mock mode fully working.
- Strengthen CRM discovery/probe safety if needed.
- Leave exact blockers for CRM real mode.
- Commit and push safe tested changes autonomously.

Do not:
- create or use CRM secrets;
- create .env.local;
- connect CRM real mode;
- configure Vercel envs;
- deploy production with real data;
- perform CRM write-back;
- execute mutations;
- read global CRM data.

Stop only when the objective is complete or a stop condition in the autonomy protocol is hit.
```

## Variant B — `.env.local` Present And Vercel Mock Configured

```text
/goal
Objective: Advance IA Mujeres Dashboard to a local read-only CRM MVP, using existing local .env.local only.

Use the repo at:
/home/reboot/Escritorio/Skilland.ai/Skilland.ai-CRM/SkilLand-ia-mujeres-dashboard

Follow:
- 01_harness/RULES.md
- 01_harness/STACK.md
- 01_harness/TASKFLOW.md
- 04_outputs/architecture/2026-06-13_pre_goal_autonomy_protocol.md
- 04_outputs/architecture/2026-06-13_human_secrets_preflight.md

Preconditions:
- .env.local exists and is ignored by git.
- CRM_BASE_URL and CRM_API_KEY are present in .env.local.
- Vercel mock deployment is configured or ready.

Scope:
- Run pnpm crm:discover.
- Run pnpm crm:probe.
- Keep raw outputs in ignored 05_scratch/crm-schema/.
- Commit only sanitized summaries.
- Confirm or reject a reliable IA Mujeres campaign filter.
- If campaign filter is reliable, update mapping and enable local CRM read-only snapshot.
- If campaign filter is missing, leave CRM mode partial/error and document the blocker.
- Validate /api/ia-mujeres/snapshot in DASHBOARD_DATA_MODE=crm.
- Keep mock fallback working.
- Prepare Vercel CRM env instructions, but do not configure production envs.
- Commit and push safe tested changes autonomously.

Do not:
- print or commit secrets;
- commit PII, real organization names, or raw record payloads;
- deploy production with real CRM data;
- configure Vercel CRM envs;
- perform CRM write-back;
- execute GraphQL mutations;
- execute REST POST/PUT/PATCH/DELETE toward CRM;
- read all CRM data without a reliable campaign filter.

Stop only when local CRM read-only mode is validated, or when a stop condition in the autonomy protocol is hit.
```
