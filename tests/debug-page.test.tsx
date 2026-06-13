import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { DebugPage } from '../src/features/ia-mujeres/pages/debug-page'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('DebugPage', () => {
  it('surfaces generated timestamp and crm readiness summary', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<DebugPage snapshot={snapshot} />)

    expect(html).toContain('Generated at')
    expect(html).toContain('Readiness CRM local')
    expect(html).toContain('Mock mode activo; CRM read-only aun no esta habilitado.')
    expect(html).toContain('Siguiente paso')
  })
})
