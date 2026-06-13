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
    expect(html).toContain('Stage: Sin contactar')
    expect(html).toContain('Outcome: No intentado')
  })

  it('surfaces a focused entity panel when one opportunity remains after filtering', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<FunnelPage snapshot={snapshot} search="?q=Camara+Comercio+Demo" />)

    expect(html).toContain('Entidad enfocada')
    expect(html).toContain('Camara Comercio Demo')
    expect(html).toContain('Tareas relacionadas')
    expect(html).toContain('Preparar follow-up 1 para Camara Comercio Demo')
  })
})
