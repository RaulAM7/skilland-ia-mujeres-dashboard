import { describe, expect, it } from 'vitest'
import { getSnapshotResponse } from '../server/api/ia-mujeres-http'

describe('CRM mode snapshot endpoint', () => {
  it('returns a controlled error snapshot when CRM env is missing', async () => {
    const response = await getSnapshotResponse({
      DASHBOARD_DATA_MODE: 'crm',
    })

    expect(response.status).toBe(503)
    expect(response.body).toMatchObject({
      status: 'error',
      source: {
        crmProvider: 'twenty',
        dataMode: 'crm',
        crmConfigured: false,
        schemaDiscovery: {
          status: 'missing_env',
        },
      },
    })
  })

  it('does not leak API keys in safe error snapshots', async () => {
    const response = await getSnapshotResponse({
      DASHBOARD_DATA_MODE: 'crm',
      CRM_API_KEY: 'super-secret-token',
    })

    expect(JSON.stringify(response.body)).not.toContain('super-secret-token')
  })
})
