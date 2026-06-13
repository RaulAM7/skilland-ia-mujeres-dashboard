import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { OperationPage } from '../src/features/ia-mujeres/pages/operation-page'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('OperationPage', () => {
  it('surfaces the active task queue and clear action when the route is filtered', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<OperationPage snapshot={snapshot} search="?filter=manual_review" />)

    expect(html).toContain('Limpiar filtro')
    expect(html).toContain('Cola activa: Revision')
  })
})
