import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { ManualReviewList } from '../src/features/ia-mujeres/components/manual-review-list'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

const snapshot = parseDashboardSnapshot(mockSnapshot)
const manualReview = snapshot.opportunities.filter(
  (opportunity) =>
    opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW' ||
    opportunity.technicalEmailOutcome === 'manual_review' ||
    opportunity.technicalEmailOutcome === 'bounced',
)

describe('ManualReviewList', () => {
  it('renders the manual review queue with reasons and next actions', () => {
    const html = renderToStaticMarkup(<ManualReviewList opportunities={manualReview} />)

    expect(html).toContain('Revision manual y senales tecnicas')
    expect(html).toContain('Buscar contacto alternativo')
    expect(html).toContain('Mock bounce/contacto incorrecto')
  })

  it('renders a safe empty state when there are no review items', () => {
    const html = renderToStaticMarkup(<ManualReviewList opportunities={[]} />)

    expect(html).toContain('No hay oportunidades en revision manual ni incidencias tecnicas pendientes.')
  })
})
