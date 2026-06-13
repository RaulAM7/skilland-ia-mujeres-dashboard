import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import {
  getCrmReadinessChecks,
  getCrmReadinessNextStep,
  getCrmReadinessStatus,
} from '../src/features/ia-mujeres/lib/crm-readiness'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('crm-readiness', () => {
  it('keeps mock snapshots in pending readiness with a safe next step', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)
    const checks = getCrmReadinessChecks(snapshot)

    expect(getCrmReadinessStatus(checks)).toBe('pending')
    expect(checks.find((check) => check.key === 'mode')?.detail).toContain('Mock mode activo')
    expect(getCrmReadinessNextStep(snapshot, checks)).toContain('.env.local')
  })

  it('marks crm snapshots as ready only when runtime verification is complete', () => {
    const snapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      status: 'ok',
      source: {
        crmProvider: 'twenty',
        campaignKey: 'ia-mujeres',
        dataMode: 'crm',
        crmConfigured: true,
        runtimeVerified: true,
        recordsRead: 42,
        schemaDiscovery: {
          status: 'available',
          summaryPath: '04_outputs/data_contract/2026-06-12_twenty_schema_discovery_summary.md',
        },
      },
      warnings: [],
    })
    const checks = getCrmReadinessChecks(snapshot)

    expect(getCrmReadinessStatus(checks)).toBe('ready')
    expect(checks.find((check) => check.key === 'campaign_scope')?.detail).toContain('42 registros')
  })

  it('surfaces blocked crm readiness when credentials are missing in crm mode', () => {
    const snapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      status: 'error',
      source: {
        crmProvider: 'twenty',
        campaignKey: 'ia-mujeres',
        dataMode: 'crm',
        crmConfigured: false,
        runtimeVerified: false,
        schemaDiscovery: {
          status: 'missing_env',
        },
      },
      warnings: [
        {
          code: 'CRM_UNAVAILABLE',
          message: 'CRM unavailable',
          source: 'crm',
        },
      ],
    })
    const checks = getCrmReadinessChecks(snapshot)

    expect(getCrmReadinessStatus(checks)).toBe('blocked')
    expect(checks.find((check) => check.key === 'credentials')?.detail).toContain('CRM_BASE_URL')
  })
})
