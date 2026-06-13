import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { TechnicalEmailOutcomesPanel } from '../src/features/ia-mujeres/components/technical-email-outcomes-panel'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('TechnicalEmailOutcomesPanel', () => {
  it('renders the technical outreach summary with actionable links', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)
    const html = renderToStaticMarkup(<TechnicalEmailOutcomesPanel snapshot={snapshot} />)

    expect(html).toContain('Salud tecnica del outreach')
    expect(html).toContain('30 intentos')
    expect(html).toContain('Enviados sin bounce')
    expect(html).toContain('href="/ia-mujeres/funnel?outcome=sent_without_bounce"')
    expect(html).toContain('href="/ia-mujeres/operation?filter=manual_review"')
    expect(html).toContain('Mock distinguishes commercial stage from technical email result.')
  })

  it('renders a safe empty state when technical outcomes are missing', () => {
    const snapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      technicalEmailOutcomes: undefined,
    })
    const html = renderToStaticMarkup(<TechnicalEmailOutcomesPanel snapshot={snapshot} />)

    expect(html).toContain('No hay resumen tecnico de outreach en el snapshot actual.')
  })
})
