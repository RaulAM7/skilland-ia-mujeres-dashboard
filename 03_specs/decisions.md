# DECISIONS

Short decision log.

- 2026-03-01: Decision template initialized. Status: pending
- [inferred] 2026-06-12: This repo is a separate IA Mujeres dashboard repo, not the CRM and not an email execution system. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: Runtime funnel data should come from deployed CRM/Twenty. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: The dashboard owns and generates its snapshot through its own server API; the CRM repo should not generate a static dashboard JSON for normal runtime. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: MVP should be read-only and must not send emails or modify CRM records. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: Deploy target is Vercel. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: UI base/reference is shadcn-admin. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: CRM credentials must remain server-side; do not use `VITE_CRM_API_KEY`. Source: `00_inbox/what-is-this-repo-about.md`.
- [inferred] 2026-06-12: `email_opened` is a weak signal, not a primary stage; `reply_received` and `meeting_booked` drive stronger action/conversion. Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`.
- [inferred] 2026-06-12: The first commercial touch should seek institutional conversation or meeting, not a direct cold sale. Source: `00_inbox/2026-06-07_offer_positioning_v1.md`.
- [inferred] 2026-06-12: Use `pnpm` as package manager for the future app, aligned with shadcn-admin. Source: planning pack.
- [inferred] 2026-06-12: Integrate shadcn-admin carefully as UI base/reference, preserving basic-scaffolding folders. Source: planning pack.
- [inferred] 2026-06-12: The Vite/Vercel app will live at repository root alongside the scaffold documentation folders. Source: planning pack.
- [inferred] 2026-06-12: Build mock-first so local MVP work can proceed before CRM credentials/runtime schema are confirmed. Source: planning pack.
- [inferred] 2026-06-12: Use an adapter pattern for CRM access with `MockIaMujeresRepository` and future `TwentyIaMujeresRepository`. Source: planning pack.
