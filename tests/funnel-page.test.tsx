import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { FunnelPage } from '../src/features/ia-mujeres/pages/funnel-page'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('FunnelPage', () => {
  it('surfaces active filters and a clear action when the route is filtered', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(
      <FunnelPage snapshot={snapshot} search="?q=universidad&stage=NOT_SENT&outcome=not_attempted" />,
    )

    expect(html).toContain('Limpiar filtros')
    expect(html).toContain('Busqueda: universidad')
    expect(html).toContain('Stage: NOT_SENT')
    expect(html).toContain('Outcome: not_attempted')
  })
})
