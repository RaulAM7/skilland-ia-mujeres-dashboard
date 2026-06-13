import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { KpiCard } from '../src/features/ia-mujeres/components/kpi-card'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('KpiCard', () => {
  it('renders an internal link for actionable KPI cards', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)
    const card = snapshot.kpiCards.find((entry) => entry.key === 'manual_review')

    expect(card).toBeDefined()

    const html = renderToStaticMarkup(<KpiCard card={card!} />)

    expect(html).toContain('href="/ia-mujeres/operation?filter=manual_review"')
    expect(html).toContain('Revision manual')
  })

  it('renders plain content for KPI cards without a target route', () => {
    const html = renderToStaticMarkup(
      <KpiCard
        card={{
          key: 'custom',
          title: 'Custom KPI',
          value: 5,
          helper: 'No route',
        }}
      />,
    )

    expect(html).not.toContain('href=')
    expect(html).toContain('Custom KPI')
  })
})
