import { describe, expect, it } from 'vitest'
import { getRefreshResponse } from '../server/api/ia-mujeres-http'

describe('refresh endpoint handler', () => {
  it('rejects missing cron secret configuration', async () => {
    const response = await getRefreshResponse({
      method: 'GET',
      headers: {},
      env: {},
    })

    expect(response.status).toBe(503)
  })

  it('rejects requests without the configured secret', async () => {
    const response = await getRefreshResponse({
      method: 'POST',
      headers: {},
      env: {
        DASHBOARD_REFRESH_SECRET: 'expected',
      },
    })

    expect(response.status).toBe(401)
  })
})
