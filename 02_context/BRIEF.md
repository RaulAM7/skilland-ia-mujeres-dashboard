# BRIEF

## What This Project Is
- Internal, deployable dashboard for **SkilLand IA Mujeres / Mujeres, IA y el Futuro del Trabajo**.
- It is a visualization, reporting and coordination layer for the institutional/commercial funnel.
- It is not the CRM, not an email campaign runner, and not a replacement for Twenty or Gmail.
- Core architecture: browser UI -> dashboard API -> deployed CRM/Twenty -> normalized dashboard-owned snapshot -> shadcn-admin UI.

## Who It Is For
- Primary users: the SkilLand team coordinating the IA Mujeres funnel, follow-ups, CRM tasks, meetings and operational next actions.
- Business context: IA Mujeres targets associations, public administrations, companies, universities/FP and other entities that may deploy women-in-AI empowerment programs.
- End beneficiaries of the broader program: women with different starting points, including unemployed women, active workers, women entrepreneurs and SME business owners.

## Outcome
- The team can open one dashboard and quickly answer:
  - How is the IA Mujeres funnel performing?
  - Which entities are in each stage?
  - What changed since the last review?
  - What problems, bounces, manual reviews and overdue tasks exist?
  - What should the team do today?
- MVP outcome: local and Vercel-deployed dashboard with mock and real CRM snapshot paths, protected server-side credentials, and usable Overview/Funnel/Tasks views.

## Time Horizon
- MVP first, then advanced operations, intelligence layer and controlled write-back only if explicitly decided.
- Exact implementation dates and delivery deadline: Unknown — no committed schedule found in sources.

## Success Definition
- A team member can use a URL to understand funnel health and next actions in seconds.
- `/api/ia-mujeres/snapshot` returns a normalized snapshot from mock data and, with real env vars, from CRM/Twenty.
- The frontend never talks directly to CRM and no CRM token is exposed to the browser.
- The MVP remains read-only: no email sending, no CRM edits, no bulk destructive actions.
- Missing CRM data is documented as a gap instead of being invented.
