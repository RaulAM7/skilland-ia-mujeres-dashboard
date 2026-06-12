import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { iaMujeresDashboardSnapshotSchema } from '../server/ia-mujeres/snapshot-schema'

describe('snapshot schema', () => {
  it('validates the mock snapshot', () => {
    const parsed = iaMujeresDashboardSnapshotSchema.parse(mockSnapshot)
    expect(parsed.totals.opportunities).toBe(100)
    expect(parsed.totals.sentWithoutBounce).toBe(28)
  })
})
