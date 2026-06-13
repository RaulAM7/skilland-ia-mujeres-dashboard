import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('parseDashboardSnapshot', () => {
  it('accepts a valid snapshot payload', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    expect(snapshot.schemaVersion).toBe('1.0')
    expect(snapshot.status).toBe('ok')
  })

  it('throws a safe schema error for invalid payloads', () => {
    expect(() => parseDashboardSnapshot({ status: 'ok' })).toThrow(/Snapshot payload failed schema validation/)
  })
})
