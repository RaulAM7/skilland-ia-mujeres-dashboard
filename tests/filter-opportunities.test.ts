import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { filterOpportunities } from '../src/features/ia-mujeres/lib/filter-opportunities'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

const opportunities = parseDashboardSnapshot(mockSnapshot).opportunities

describe('filterOpportunities', () => {
  it('filters by search text across relevant fields', () => {
    const filtered = filterOpportunities(opportunities, {
      search: 'fundacion',
      stageKey: 'all',
      technicalOutcome: 'all',
    })

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((opportunity) => (opportunity.companyName ?? opportunity.name).toLowerCase().includes('fundacion'))).toBe(true)
  })

  it('filters by commercial stage key', () => {
    const filtered = filterOpportunities(opportunities, {
      search: '',
      stageKey: 'NOT_SENT',
      technicalOutcome: 'all',
    })

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((opportunity) => opportunity.commercialStage === 'NOT_SENT')).toBe(true)
  })

  it('filters by technical outcome including unknown fallback', () => {
    const filtered = filterOpportunities(opportunities, {
      search: '',
      stageKey: 'all',
      technicalOutcome: 'manual_review',
    })

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((opportunity) => (opportunity.technicalEmailOutcome ?? 'unknown') === 'manual_review')).toBe(true)
  })
})
