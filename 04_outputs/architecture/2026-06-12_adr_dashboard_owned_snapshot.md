# ADR — Dashboard-Owned Snapshot

## Status
Accepted for MVP planning.

## Decision
The IA Mujeres Dashboard owns and generates its own snapshot through a server-side dashboard API. The CRM/Twenty workspace remains the source of truth, but the dashboard API is responsible for querying CRM data, normalizing it, calculating metrics and returning the UI contract.

## Context
- The dashboard is a separate repo from `skilland-crm`.
- The dashboard must be deployed on Vercel.
- The frontend must not call CRM/Twenty directly or expose CRM credentials.
- The team needs a stable, UI-friendly representation of opportunities, tasks, alerts and funnel metrics.
- Exact runtime CRM schema and credentials are not yet confirmed.

## Alternatives Considered

## CRM Repo Generates Static JSON
- Rejected.
- Couples dashboard runtime to `skilland-crm` outputs.
- Requires extra scripts or manual generation.
- Makes Vercel dashboard refresh dependent on another repo.

## Frontend Calls CRM/Twenty Directly
- Rejected.
- Exposes credentials or requires unsafe browser auth.
- Couples UI to Twenty API shape.
- Makes data minimization harder.

## Full Data Warehouse / BI Layer
- Rejected for MVP.
- Overengineered for current need.
- Adds persistence, ETL and governance before the dashboard proves value.

## Dashboard-Owned Snapshot
- Accepted.
- Gives the UI a stable contract.
- Keeps CRM credentials server-side.
- Allows mock-first development.
- Keeps runtime responsibility inside this dashboard repo.

## Consequences
- The dashboard repo must contain server-side data access and snapshot builder code.
- The snapshot contract must be documented and tested.
- CRM fields must be mapped defensively because runtime schema is not verified.
- The dashboard can evolve independently from CRM UI and CRM repo outputs.

## Risks
- Some desired metrics may only exist in local CRM execution files, not in CRM/Twenty.
- CRM API permissions may be too broad or unavailable.
- Field names may drift or differ from source docs.
- Queries may be slow if every page view recalculates from CRM.

## Mitigations
- Use mock-first implementation and a CRM adapter pattern.
- Mark CRM fields as source-confirmed but runtime-unverified until API validation.
- Centralize field mapping and stage mapping.
- Emit warnings for missing fields or unknown stages.
- Add simple cache headers/memoization in MVP and persistent cache in phase 2.
- Use read-only API credentials where possible.

## Related Decisions
- Do not touch `skilland-crm` in MVP unless a data gap blocks a critical read-only metric.
- Do not expose tokens in frontend code.
- Do not use `VITE_CRM_API_KEY`.
- Use mock-first development.
- Keep MVP read-only.
