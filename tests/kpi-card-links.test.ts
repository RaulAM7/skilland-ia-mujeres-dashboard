import { describe, expect, it } from 'vitest'
import { getKpiCardHref } from '../src/features/ia-mujeres/lib/kpi-card-links'

describe('getKpiCardHref', () => {
  it('maps known KPI cards to safe internal routes', () => {
    expect(getKpiCardHref('opportunities')).toBe('/ia-mujeres/funnel')
    expect(getKpiCardHref('not_sent')).toBe('/ia-mujeres/funnel?stage=NOT_SENT')
    expect(getKpiCardHref('sent_without_bounce')).toBe('/ia-mujeres/funnel?outcome=sent_without_bounce')
    expect(getKpiCardHref('manual_review')).toBe('/ia-mujeres/operation?filter=manual_review')
    expect(getKpiCardHref('open_tasks')).toBe('/ia-mujeres/operation')
  })

  it('returns undefined for KPI cards without a navigation target', () => {
    expect(getKpiCardHref('custom_card')).toBeUndefined()
  })
})
