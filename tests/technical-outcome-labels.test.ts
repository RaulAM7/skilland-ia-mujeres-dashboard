import { describe, expect, it } from 'vitest'
import { getTechnicalOutcomeLabel } from '../src/features/ia-mujeres/lib/technical-outcome-labels'

describe('getTechnicalOutcomeLabel', () => {
  it('returns human-readable labels for supported outcomes', () => {
    expect(getTechnicalOutcomeLabel('not_attempted')).toBe('No intentado')
    expect(getTechnicalOutcomeLabel('sent_without_bounce')).toBe('Enviado sin bounce')
    expect(getTechnicalOutcomeLabel('bounced')).toBe('Bounce detectado')
    expect(getTechnicalOutcomeLabel('manual_review')).toBe('Revision manual')
  })

  it('falls back safely for unknown outcomes', () => {
    expect(getTechnicalOutcomeLabel(undefined)).toBe('Unknown')
  })
})
