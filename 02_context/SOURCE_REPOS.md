# SOURCE REPOS

## Basic Scaffolding
- URL: https://github.com/RaulAM7/basic-scaffolding
- Use as: working methodology and scaffold pattern.
- Do: preserve `00_inbox/`, `01_harness/`, `02_context/`, `03_specs/`, `04_outputs/`, `05_scratch/`, `shared/`.
- Do not: let app scaffolding overwrite documentation/spec structure.

## Funnel Academy Context
- URL: https://github.com/RaulAM7/funnel-and-offer-academy/tree/master/04_outputs/ia-mujeres-funnel
- Use as: business/product/funnel context.
- Do: consult for offer positioning, ICP, funnel map, copy direction and commercial narrative.
- Do not: implement the dashboard there or treat it as runtime data.

## Skilland CRM Execution Context
- URL: https://github.com/Skilland-ai/skilland-crm/tree/main/04_outputs/ia_mujeres_crm_execution
- Use as: operational CRM/GWS context.
- Do: consult for stage mapping, execution reports, CRM field names, batch plans, audit outputs and data gaps.
- Do not: implement the dashboard there or depend on local repo files for stable runtime.

## shadcn-admin
- URL: https://github.com/satnaing/shadcn-admin
- Use as: dashboard UI base/reference.
- Source fact: shadcn-admin is a Vite dashboard using React, TypeScript, shadcn/ui, Tailwind, TanStack Router, TanStack Query and chart/table tooling.
- Do: inspect before copying, integrate carefully at repo root, preserve scaffold folders.
- Do not: copy irrelevant code or treat it as an untouchable black box.

## Twenty Docs / API
- URL: https://docs.twenty.com/developers/extend/api
- Use as: source for CRM/Twenty API integration.
- Source fact: Twenty exposes REST and GraphQL APIs generated from workspace schema and uses Bearer API key auth.
- Do: keep API access server-side and verify runtime schema before treating fields as confirmed.
- Do not: expose CRM API keys in browser code or use `VITE_CRM_API_KEY`.
