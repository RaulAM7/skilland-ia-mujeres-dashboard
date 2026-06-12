# OPEN QUESTIONS

## Blocking Before Implementation
- Is there any legal/licensing constraint that prevents using shadcn-admin as the visual/structural base?
- Is there any repo policy that forbids a Vite/Vercel app at repository root alongside the scaffold folders?

## Can Be Answered During Implementation
- What is the final runtime CRM/Twenty base URL?
- Will CRM access use Twenty GraphQL, REST, or a custom read-only endpoint?
- Is a read-only CRM API key available?
- What are the exact deployed object names and relation names for opportunities, tasks, companies and people?
- How is an opportunity reliably filtered into the IA Mujeres campaign?
- Are `iaMujeresFunnelStage` and `outreachStatus` available through the runtime API exactly as named in source docs?
- Are replies and bounces synchronized into CRM/Twenty or only present in GWS/local execution outputs?
- What task fields represent status, due date, owner, related opportunity and category?
- What auth/protection should be used for the first real-data deployment?
- Should the Debug page expose raw snapshot only in local/dev or also behind admin auth in preview?

## Can Wait Until Phase 2
- Which persistent cache should be used: Vercel KV, Redis/Upstash, Blob, Postgres/Neon or another store?
- Do we need historical snapshots in MVP+1?
- Should batches become a first-class page?
- Should Twenty webhooks trigger snapshot invalidation?
- Should the dashboard become multi-campaign later?
- Do we need role-based views for admin vs broader team?
- Should the dashboard generate weekly report exports?
- Should write-back actions ever be allowed, and under which approval/audit model?
