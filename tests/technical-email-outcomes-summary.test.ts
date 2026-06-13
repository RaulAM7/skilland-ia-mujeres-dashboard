import { describe, expect, it } from 'vitest'
import { getTechnicalEmailOutcomeSummaries } from '../src/features/ia-mujeres/lib/technical-email-outcomes-summary'

describe('technical-email-outcomes-summary', () => {
  it('builds actionable summaries for technical outreach outcomes', () => {
    expect(
      getTechnicalEmailOutcomeSummaries({
        attempted: 30,
        sentWithoutBounce: 28,
        bounceOrManualReviewIncidents: 2,
      }),
    ).toEqual([
      {
        key: 'attempted',
        label: 'Intentos de outreach',
        value: 30,
        helper: '100% del trabajo tecnico previsto',
      },
      {
        key: 'sent_without_bounce',
        label: 'Enviados sin bounce',
        value: 28,
        helper: '93% de los intentos',
        href: '/ia-mujeres/funnel?outcome=sent_without_bounce',
        actionLabel: 'Abrir entidades limpias',
      },
      {
        key: 'incidents',
        label: 'Incidencias tecnicas',
        value: 2,
        helper: '7% de los intentos',
        href: '/ia-mujeres/operation?filter=manual_review',
        actionLabel: 'Ir a revision manual',
      },
    ])
  })

  it('returns 0% helpers safely when no attempts exist', () => {
    const summaries = getTechnicalEmailOutcomeSummaries({
      attempted: 0,
      sentWithoutBounce: 0,
      bounceOrManualReviewIncidents: 0,
    })

    expect(summaries[0]?.helper).toBe('Sin outreach tecnico registrado')
    expect(summaries[1]?.helper).toBe('0% de los intentos')
    expect(summaries[2]?.helper).toBe('0% de los intentos')
  })
})
