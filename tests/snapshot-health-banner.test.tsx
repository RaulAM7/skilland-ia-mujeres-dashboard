import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { SnapshotHealthBanner } from '../src/features/ia-mujeres/components/snapshot-health-banner'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('SnapshotHealthBanner', () => {
  it('renders snapshot mode, warning count and warning codes', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)
    const html = renderToStaticMarkup(<SnapshotHealthBanner snapshot={snapshot} />)

    expect(html).toContain('Salud del snapshot')
    expect(html).toContain('Modo mock')
    expect(html).toContain('Warnings 5')
    expect(html).toContain('MOCK_DATA')
  })

  it('renders a no-warning state when the snapshot is clean', () => {
    const snapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      status: 'ok',
      warnings: [],
    })
    const html = renderToStaticMarkup(<SnapshotHealthBanner snapshot={snapshot} />)

    expect(html).toContain('No hay warnings activos en el snapshot actual.')
  })
})
