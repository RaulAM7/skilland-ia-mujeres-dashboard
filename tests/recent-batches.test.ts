import { describe, expect, it } from 'vitest'
import { getRecentBatches } from '../src/features/ia-mujeres/lib/recent-batches'

describe('recent-batches', () => {
  it('sorts batches by sentAt descending', () => {
    const batches = getRecentBatches([
      {
        id: 'batch-older',
        label: 'Older batch',
        sentAt: '2026-06-07T09:00:00.000Z',
        sentCount: 20,
        bounceCount: 1,
        replyCount: 0,
        status: 'sent',
      },
      {
        id: 'batch-newer',
        label: 'Newer batch',
        sentAt: '2026-06-08T09:00:00.000Z',
        sentCount: 15,
        bounceCount: 0,
        replyCount: 1,
        status: 'sent',
      },
    ])

    expect(batches.map((batch) => batch.id)).toEqual(['batch-newer', 'batch-older'])
  })

  it('returns an empty list when batches are missing', () => {
    expect(getRecentBatches(undefined)).toEqual([])
  })
})
