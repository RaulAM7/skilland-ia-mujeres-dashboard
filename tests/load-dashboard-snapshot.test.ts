import { describe, expect, it, vi } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { loadDashboardSnapshot } from '../src/features/ia-mujeres/hooks/load-dashboard-snapshot'

describe('loadDashboardSnapshot', () => {
  it('returns a valid snapshot without transport warning on 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSnapshot,
    })

    const result = await loadDashboardSnapshot(fetchMock)

    expect(result.data.status).toBe('ok')
    expect(result.transportWarning).toBeNull()
  })

  it('keeps rendering a valid snapshot on non-200 responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        ...mockSnapshot,
        status: 'error',
      }),
    })

    const result = await loadDashboardSnapshot(fetchMock)

    expect(result.data.status).toBe('error')
    expect(result.transportWarning).toContain('503')
  })

  it('throws a safe schema error when the payload is invalid', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok' }),
    })

    await expect(loadDashboardSnapshot(fetchMock)).rejects.toThrow(/schema validation/)
  })
})
