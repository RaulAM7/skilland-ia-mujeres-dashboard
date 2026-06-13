# Human Decision Checklist — 2026-06-13

Use this checklist before launching a long autonomous `/goal` run.

- [x] Verify commit `bedda59` is present in `origin/main`.
- [ ] Decide if the repository remains public or becomes private before real CRM data is used.
- [ ] Create a Twenty API key.
- [ ] Confirm whether the Twenty API key is read-only or role-limited.
- [ ] Create local `.env.local` in the dashboard repo.
- [ ] Confirm `.env.local` is ignored by git.
- [ ] Run `pnpm crm:discover`.
- [ ] Run `pnpm crm:probe`.
- [ ] Review sanitized summaries in `04_outputs/data_contract/`.
- [ ] Confirm no PII, real organization names, or record payloads appear in committed summaries.
- [ ] Confirm a reliable IA Mujeres campaign filter exists.
- [ ] Validate `DASHBOARD_DATA_MODE=crm` locally.
- [ ] Connect the repo to Vercel in mock mode.
- [ ] Activate deployment protection if real data may be exposed.
- [ ] Configure CRM env vars in Vercel only after local CRM mode succeeds.
- [ ] Launch `/goal` only after the minimum human checks above are complete.

## Minimum Required Before CRM `/goal`

- `.env.local` exists locally.
- `CRM_BASE_URL` and `CRM_API_KEY` are available server-side.
- `pnpm crm:probe` confirms a reliable IA Mujeres campaign filter.
- Real-data deployment protection decision is made.

## Minimum Required Before Mock-Only `/goal`

- No secrets are required.
- Repo builds and tests pass.
- The future `/goal` must stop before CRM real mode.
