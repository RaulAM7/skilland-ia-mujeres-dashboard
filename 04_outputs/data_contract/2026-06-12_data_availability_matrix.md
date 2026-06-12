# Data Availability Matrix — 2026-06-12

| Metric | Needed for MVP? | Expected source | Confirmed in docs? | Confirmed via runtime API? | Fallback if missing | Phase |
|---|---|---|---|---|---|---|
| Total opportunities | Yes | CRM/Twenty opportunities filtered by campaign | Yes | No; discovery/probe tooling added | Mock totals and empty-state UI | MVP |
| Not sent | Yes | `iaMujeresFunnelStage` or `outreachStatus` | Yes, source-confirmed/runtime-unverified | No; `pnpm crm:probe` must confirm field | Derive from stage/status if present; otherwise warn | MVP |
| Email 1 sent | Yes | `outreachStatus`, `firstEmailSentAt`, `lastEmailSentAt` | Yes, source-confirmed/runtime-unverified | No; `pnpm crm:probe` must confirm field | Use mock; warn in CRM mode if missing | MVP |
| Sent without bounce | Yes | Email event fields and bounce/manual review flags | Partially | No; derived until probe confirms event fields | Derive from sent minus bounce/manual review; mark derived | MVP |
| Bounces | Yes | `lastEmailEventType`, `needsManualReview`, bounce-like status | Partially | No; `pnpm crm:probe` must confirm field | Show unknown/0 with warning | MVP |
| Replies | Yes | `lastReplyAt` or reply event | Yes, source-confirmed/runtime-unverified | No; `pnpm crm:probe` must confirm field | Show unknown/0 with warning | MVP |
| Meeting proposed | Yes | CRM stage or task/note field | Expected by funnel docs | No; stage values need runtime probe | Show 0 until stage exists | MVP |
| Meeting scheduled | Yes | CRM stage or meeting object | Expected by funnel docs | No; stage values need runtime probe | Show 0 until stage exists | MVP |
| Manual review | Yes | `needsManualReview`, `iaMujeresFunnelStage`, quality flags | Yes, source-confirmed/runtime-unverified | No; `pnpm crm:probe` must confirm field | Derive from stage/status; warn if missing | MVP |
| Open tasks | Yes | CRM/Twenty tasks | Expected by CRM/funnel docs | No; tasks object needs runtime probe | Mock tasks; show 0 with warning in CRM mode | MVP |
| Overdue tasks | Yes | Task due date/status | Expected by CRM/funnel docs | No; task fields need runtime probe | Derive if due dates exist; otherwise warn | MVP |
| Due today tasks | Yes | Task due date/status | Expected by CRM/funnel docs | No; task fields need runtime probe | Derive if due dates exist; otherwise warn | MVP |
| Followups pending | Yes | `followUpDueAt`, task category/status | Yes, source-confirmed/runtime-unverified | No; `pnpm crm:probe` must confirm field | Derive from sent-without-reply; mark derived | MVP |
| Batches | No | `activeBatchId`, email event metadata | Partially | No; phase 2 probe needed | Mock/future page only | Phase 2 |
| Organizations | Yes | CRM companies/opportunities | Expected | No; companies object needs runtime probe | Use opportunity/company name only | MVP |
| Owner | Useful | CRM owner field | Possible, not confirmed | No; owner relation needs runtime probe | Show "Equipo IA Mujeres" or omit | MVP |
| Territory/entity type/ICP | Useful | CRM custom fields or inferred context | Possible, not confirmed | No; custom fields need runtime probe | Optional filters hidden or mock-only | MVP/Phase 2 |
