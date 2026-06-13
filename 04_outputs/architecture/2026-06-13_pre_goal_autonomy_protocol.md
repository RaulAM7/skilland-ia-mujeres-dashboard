# Pre-Goal Autonomy Protocol — 2026-06-13

## Purpose

This protocol governs the next autonomous `/goal` run. It is designed so Codex can keep working without human review between small iterations, while stopping when human authority or secrets are required.

## Autonomous Work Loop

When a future `/goal` starts, Codex should repeat this loop until the goal is complete or a stop condition is hit:

1. Refresh repo state with `git status -sb`, recent commits, and current docs.
2. Check whether `.env.local` exists and whether CRM secrets are available without printing values.
3. Pick the next useful unit of work from the active objective.
4. Make the smallest coherent change.
5. Run relevant checks.
6. Inspect diff for secrets, PII, CRM write behavior, and unrelated changes.
7. Commit and push completed safe units when checks pass.
8. Update docs or notes with decisions, blockers, and next action.
9. Continue autonomously unless a stop condition applies.

## Codex May Do Autonomously

- Safe refactors.
- Tests and test fixes.
- Documentation updates.
- Mock-mode UI polish.
- Error and partial-state handling.
- Mapping changes from sanitized summaries.
- Discovery/probe hardening.
- Vercel mock deployment checklist updates.
- CI fixes.
- Build/lint/typecheck fixes.
- Simple chunk warning optimization if it does not complicate the app.
- Commit and push safe, tested changes.

## Codex Must Not Do Without Human Approval

- Create, reveal, rotate, or publish secrets.
- Connect CRM real mode if `.env.local` is absent.
- Configure Vercel production env vars.
- Change repo public/private visibility.
- Publish real CRM data.
- Deploy production with real CRM data.
- Perform CRM write-back.
- Execute GraphQL mutations.
- Execute REST `POST`, `PUT`, `PATCH`, or `DELETE` toward CRM.
- Read all CRM opportunities/tasks globally without a reliable IA Mujeres campaign filter.
- Commit summaries containing PII, real organization names, or raw record payloads.

## Stop Conditions

Codex must stop and report clearly if:

- A real secret appears in git diff.
- `CRM_BASE_URL` or `CRM_API_KEY` is required but unavailable.
- A campaign filter for IA Mujeres is missing or ambiguous.
- Discovery/probe outputs include PII in versioned files.
- Tests/build fail due to a large architectural issue.
- Vercel access or production env configuration is required.
- Repo privacy must be decided.
- A requested step requires CRM write-back.
- Codex cannot verify that CRM mode is read-only.
- Real-data deployment would proceed without explicit approval.

## CRM Read-Only Rules

- GraphQL `POST` is allowed only for queries, introspection, and read operations.
- GraphQL mutations are forbidden.
- REST `POST`, `PUT`, `PATCH`, and `DELETE` toward CRM are forbidden.
- Dashboard refresh `POST` is an internal dashboard endpoint and must not write CRM data.

## Public Repo Sanitization

Because this repository is public unless Raul changes it, committed outputs must not include:

- API keys;
- emails;
- phone numbers;
- person names;
- real organization names from CRM;
- notes;
- snippets;
- Gmail/thread/message IDs;
- raw record payloads.

Allowed committed CRM findings:

- object names;
- field names;
- field types;
- counts;
- aggregate metrics;
- confirmed mapping;
- gaps;
- warnings.
