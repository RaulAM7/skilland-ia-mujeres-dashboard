import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { AlertsPanel } from '../src/features/ia-mujeres/components/alerts-panel'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('AlertsPanel', () => {
  it('renders alert actions when the snapshot provides a CTA href', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<AlertsPanel alerts={snapshot.alerts} />)

    expect(html).toContain('Ver revision')
    expect(html).toContain('/ia-mujeres/operation?filter=manual_review')
  })

  it('renders a safe empty state when there are no alerts', () => {
    const html = renderToStaticMarkup(<AlertsPanel alerts={[]} />)

    expect(html).toContain('Sin alertas activas.')
  })
})
