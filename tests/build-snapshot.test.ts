import { describe, expect, it } from 'vitest'
import { MockIaMujeresRepository } from '../server/crm/mock-ia-mujeres-repository'
import { buildIaMujeresSnapshot } from '../server/ia-mujeres/build-snapshot'

describe('buildIaMujeresSnapshot', () => {
  it('returns the validated mock snapshot', async () => {
    const snapshot = await buildIaMujeresSnapshot({
      repository: new MockIaMujeresRepository(),
      campaignKey: 'ia-mujeres',
    })

    expect(snapshot.status).toBe('ok')
    expect(snapshot.totals.opportunities).toBe(100)
    expect(snapshot.totals.notSent).toBe(70)
    expect(snapshot.totals.sentWithoutBounce).toBe(28)
    expect(snapshot.totals.openTasks).toBe(30)
  })
})
