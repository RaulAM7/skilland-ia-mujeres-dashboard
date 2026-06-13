import { describe, expect, it } from 'vitest'
import { getFunnelFiltersFromSearch, getFunnelHref, hasActiveFunnelFilters } from '../src/features/ia-mujeres/lib/funnel-route-filter'

describe('funnel route filter helpers', () => {
  it('parses funnel filters from the query string with safe defaults', () => {
    expect(getFunnelFiltersFromSearch('')).toEqual({
      search: '',
      stageKey: 'all',
      technicalOutcome: 'all',
    })

    expect(getFunnelFiltersFromSearch('?q=universidad&stage=EMAIL_1_SENT&outcome=sent_without_bounce')).toEqual({
      search: 'universidad',
      stageKey: 'EMAIL_1_SENT',
      technicalOutcome: 'sent_without_bounce',
    })
  })

  it('serializes funnel filters into a stable shareable href', () => {
    expect(
      getFunnelHref({
        search: '  universidad  ',
        stageKey: 'EMAIL_1_SENT',
        technicalOutcome: 'sent_without_bounce',
      }),
    ).toBe('/ia-mujeres/funnel?q=universidad&stage=EMAIL_1_SENT&outcome=sent_without_bounce')

    expect(
      getFunnelHref({
        search: '',
        stageKey: 'all',
        technicalOutcome: 'all',
      }),
    ).toBe('/ia-mujeres/funnel')
  })

  it('detects whether any funnel filter is active', () => {
    expect(
      hasActiveFunnelFilters({
        search: '',
        stageKey: 'all',
        technicalOutcome: 'all',
      }),
    ).toBe(false)

    expect(
      hasActiveFunnelFilters({
        search: 'universidad',
        stageKey: 'all',
        technicalOutcome: 'all',
      }),
    ).toBe(true)
  })
})
