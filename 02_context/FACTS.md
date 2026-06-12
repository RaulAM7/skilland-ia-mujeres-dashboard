# FACTS

## Repository and Dashboard
- Fact: This repository exists to build an internal, deployable dashboard for SkilLand IA Mujeres / Mujeres, IA y el Futuro del Trabajo.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The dashboard is intended to show funnel status including opportunities, contacted entities, sends, replies, bounces, manual reviews, pending tasks, follow-ups, proposed meetings, scheduled meetings and next actions.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The dashboard is a separate repo from the CRM and should be deployed on Vercel.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The source of truth for runtime funnel data should be the deployed CRM/Twenty environment, not local files in the CRM repo.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The chosen architecture is a dashboard-owned snapshot: dashboard server API queries CRM/Twenty, normalizes the data, computes metrics and returns JSON to the UI.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The frontend must not talk directly to the CRM and must not expose CRM tokens in browser-accessible variables.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The main planned endpoint is `GET /api/ia-mujeres/snapshot`; a refresh endpoint and Twenty webhook are future or optional surfaces.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: The MVP should be read-only by default and should not change stages, send emails, create tasks, edit contacts, modify opportunities, create drafts or delete information.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: Target frontend stack named in the inbox is React, Vite, TypeScript, shadcn/ui, shadcn-admin, Tailwind, TanStack Router if used by the base, TanStack Query if useful, and Recharts or an equivalent chart library if already present.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: Target backend/deployment stack named in the inbox is Vercel Functions, TypeScript, server-side fetch, a CRM/Twenty API client and optional Zod schemas.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

- Fact: Local development should support mock data without CRM access and CRM mode with `CRM_BASE_URL` and `CRM_API_KEY`.
  Source: `00_inbox/what-is-this-repo-about.md`
  Confidence: high

## Funnel and Operations
- Fact: The validated funnel direction is "conversation institutional first"; the first email should seek a conversation or meeting, not sell a course or close a deal cold.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`; `00_inbox/2026-06-07_offer_positioning_v1.md`
  Confidence: high

- Fact: The validated funnel has three main paths after first send: response/interest, no-response follow-up/retargeting/nurturing, and closure/blocking.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`; `00_inbox/2026-06-07_funnel_map_v1.excalidraw`
  Confidence: high

- Fact: `email_opened` is a weak signal and should not be a primary funnel stage; `reply_received` is a strong event and `meeting_booked` is the primary conversion.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`
  Confidence: high

- Fact: `Sin respuesta` is a temporary operational state that should feed follow-up or nurturing, not an automatic close.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`
  Confidence: high

- Fact: CRM/Twenty is expected to hold deals, commercial state, business line, campaign, priority, segment, manual review flags, tasks, meetings, notes and future nurturing.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`
  Confidence: high

- Fact: GWS CLI is described as the operational source for drafts, sends, message/thread IDs, replies, bounces if available and openings only if reliable tracking exists.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`
  Confidence: high

- Fact: Humans remain responsible for list validation, draft approval, responding to interested entities, proposing meetings, maintaining conversations and interpreting institutional signals.
  Source: `00_inbox/2026-06-07_user_validated_funnel_direction.md`; `00_inbox/2026-06-07_funnel_map_v1.md`
  Confidence: high

## Business Context
- Fact: SkilLand IA Mujeres is positioned as programs of women empowerment in AI with diagnosis, platform, adaptive itineraries, microcredentials, accompaniment, analytics and impact measurement, not as a standalone basic AI course.
  Source: `00_inbox/skilland_ia_mujeres_documento_estrategico.md`; `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: high

- Fact: Target buyer/entity types include associations and NGOs, public administrations, companies/RSC/ESG/FUNDAE, universities, FP and training centers.
  Source: `00_inbox/skilland_ia_mujeres_documento_estrategico.md`; `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: high

- Fact: The IA Mujeres path has eight levels: Foundation, Productividad, Comunicacion, Estrategia, Investigacion, Financiacion, Marketing y ventas, and Escalado.
  Source: `00_inbox/skilland_ia_mujeres_documento_estrategico.md`; `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: high

- Fact: Main participant profiles named in the strategy are unemployed women, active workers, SME business owners and women entrepreneurs.
  Source: `00_inbox/skilland_ia_mujeres_documento_estrategico.md`; `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: high

- Fact: The PDF presentation frames the collaboration process as three steps: initial meeting, territorial divulgation, and custom project.
  Source: `00_inbox/Mujeres, IA y el futuro del Trabajo - Presentación — SkilLand (1).pdf`
  Confidence: high

- Fact: The longer strategic document frames delivery as a five-step process: diagnosis, co-design, pilot, deployment, measurement/reporting.
  Source: `00_inbox/skilland_ia_mujeres_documento_estrategico.md`
  Confidence: high

## Market Data Present in Sources
- Fact: The dossier states that women hold 19% of technology roles in Europe in McKinsey 2026, down from 22% in 2023.
  Source: `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: medium

- Fact: The dossier states that in Spain women are 19.5% of digital specialists, 14.8% of Computer Science university students and 28.7% of Engineering students, citing ONTSI 2025.
  Source: `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`
  Confidence: medium

- Fact: The dossier states that Canary Islands female unemployment was 14.25% in 2025 versus 11.15% for men, citing OBECAN/Government of Canary Islands.
  Source: `00_inbox/Mujeres, IA y el Futuro del Trabajo — SkilLand.md`; `00_inbox/Mujeres, IA y el futuro del Trabajo - Presentación — SkilLand (1).pdf`
  Confidence: medium

## Unknowns and Assumptions
- Unknown: Exact CRM/Twenty base URL, API type (GraphQL, REST or custom), read-only API key availability and workspace configuration.
- Unknown: Exact CRM fields for opportunities, tasks, replies, bounces, follow-up due dates, campaign membership and IA Mujeres stage mapping.
- Unknown: Whether replies and bounces are already synchronized into CRM or only exist in Gmail/GWS/local outputs.
- Unknown: Final auth approach for the dashboard.
- Unknown: Final cache/storage choice and whether history is required in MVP.
- Unknown: Final snapshot v1 field list beyond the conceptual contract in `what-is-this-repo-about.md`.
- Unknown: Final repo/product naming capitalization; sources use both `Skilland` and `SkilLand`.
- Assumption: The current workspace is still documentation-first until implementation scaffolding is introduced.
