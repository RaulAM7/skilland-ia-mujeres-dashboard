# Data Availability Matrix — 2026-06-12

Phase 4C status: real Twenty discovery and probe were skipped because local `CRM_BASE_URL` and `CRM_API_KEY` were not available. No runtime CRM object, campaign filter or field mapping is confirmed yet.

Committed summaries may contain only object names, field names, field types, counts, aggregate metrics, mapping status, gaps and warnings. Raw CRM samples stay ignored under `05_scratch/crm-schema/`.

| Metric | Needed for MVP? | Expected source | Availability status | Runtime-confirmed objects/fields | Fallback if missing | Phase |
|---|---|---|---|---|---|---|
| Total opportunities | Yes | CRM/Twenty opportunities filtered by IA Mujeres campaign | source-confirmed / runtime-missing | None; discovery skipped | Mock totals and safe CRM error/partial state | MVP |
| Not sent | Yes | `iaMujeresFunnelStage` or `outreachStatus` | source-confirmed / runtime-missing | None; field not probed | Derive from confirmed stage/status only; otherwise warn | MVP |
| Email 1 sent | Yes | `outreachStatus`, `firstEmailSentAt`, `lastEmailSentAt` | source-confirmed / runtime-missing | None; fields not probed | Use mock; warn in CRM mode if missing | MVP |
| Sent without bounce | Yes | Email event fields plus bounce/manual-review flags | ambiguous / runtime-missing | None; event fields not probed | Derive only from confirmed fields; mark derived | MVP |
| Bounces | Yes | `lastEmailEventType`, `lastBounceAt`, `needsManualReview`, bounce-like status | ambiguous / runtime-missing | None; fields not probed | Show 0/unknown with warning | MVP |
| Replies | Yes | `lastReplyAt` or reply event field | source-confirmed / runtime-missing | None; field not probed | Show 0/unknown with warning | MVP |
| Meeting proposed | Yes | CRM stage or task/note field | source-confirmed / runtime-missing | None; stage values not probed | Show 0 until stage exists | MVP |
| Meeting scheduled | Yes | CRM stage or meeting object | source-confirmed / runtime-missing | None; stage values not probed | Show 0 until stage exists | MVP |
| Manual review | Yes | `needsManualReview`, stage, quality flags | source-confirmed / runtime-missing | None; fields not probed | Derive from confirmed stage/status only; otherwise warn | MVP |
| Open tasks | Yes | CRM/Twenty tasks object filtered by campaign | source-confirmed / runtime-missing | None; task object not probed | Mock tasks; show 0/warning in CRM mode | MVP |
| Overdue tasks | Yes | Task due date and status | source-confirmed / runtime-missing | None; task fields not probed | Derive only from confirmed due/status fields | MVP |
| Due today tasks | Yes | Task due date and status | source-confirmed / runtime-missing | None; task fields not probed | Derive only from confirmed due/status fields | MVP |
| Followups pending | Yes | `followUpDueAt`, task category/status | source-confirmed / runtime-missing | None; fields not probed | Derive only from confirmed fields; mark partial | MVP |
| Batches | No | `activeBatchId`, email event metadata | phase-2 / runtime-missing | None; not probed | Future page only | Phase 2 |
| Organizations | Yes | CRM companies/opportunities | source-confirmed / runtime-missing | None; no public org names may be committed | Use opportunity/company display only after filtered CRM read | MVP |
| Owner | Useful | CRM owner field/relation | ambiguous / runtime-missing | None; relation not probed | Omit or use generic team label | MVP |
| Territory/entity type/ICP | Useful | CRM custom fields or inferred context | ambiguous / runtime-missing | None; custom fields not probed | Optional filters hidden or mock-only | MVP/Phase 2 |

## Blocking Gap For Live CRM Data

The dashboard must not read all CRM opportunities/tasks globally. A reliable IA Mujeres campaign filter must be runtime-confirmed first through `pnpm crm:probe`.
