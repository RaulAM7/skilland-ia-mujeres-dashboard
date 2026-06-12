# Vercel Mock Deploy Checklist

Use this checklist for the first mock-only Vercel deployment of the IA Mujeres dashboard.

## Build configuration

- [ ] Repository is connected to Vercel.
- [ ] Framework preset is `Vite`.
- [ ] Build command is `pnpm build`.
- [ ] Output directory is `dist`.
- [ ] Package manager is `pnpm`.
- [ ] Vercel build passes.

## Environment

- [ ] `DASHBOARD_DATA_MODE=mock` is configured.
- [ ] `DASHBOARD_ENV=production` is configured.
- [ ] `CRON_SECRET` is configured only if `GET /api/ia-mujeres/refresh` will be used.
- [ ] `DASHBOARD_REFRESH_SECRET` is configured only if `POST /api/ia-mujeres/refresh` will be used.
- [ ] `CRM_API_KEY` is not configured for the mock deployment.
- [ ] `CRM_BASE_URL` is not configured for the mock deployment.
- [ ] No `VITE_CRM_API_KEY` exists.

## Routes

- [ ] `/ia-mujeres` loads.
- [ ] `/ia-mujeres/funnel` loads.
- [ ] `/ia-mujeres/operation` loads.
- [ ] `/ia-mujeres/debug` loads.
- [ ] `/api/ia-mujeres/snapshot` returns JSON.
- [ ] `/api/ia-mujeres/snapshot` includes `schemaVersion`.
- [ ] `/api/ia-mujeres/snapshot` includes `totals`.
- [ ] `/api/ia-mujeres/snapshot` includes `funnelStages`.
- [ ] `/api/ia-mujeres/snapshot` includes `warnings`.

## Refresh endpoints

- [ ] `GET /api/ia-mujeres/refresh` without a secret returns a controlled `401` or `503`.
- [ ] `POST /api/ia-mujeres/refresh` without a secret returns a controlled `401` or `503`.
- [ ] Refresh endpoints do not mutate CRM data.
- [ ] Refresh endpoints do not require or expose CRM credentials.

## Security and data mode

- [ ] Dashboard remains in mock mode.
- [ ] No secrets are visible in frontend bundles or browser network payloads.
- [ ] Frontend calls only dashboard API routes, not CRM/Twenty directly.
- [ ] No CRM real connection is active.
- [ ] No write-back behavior is active.
