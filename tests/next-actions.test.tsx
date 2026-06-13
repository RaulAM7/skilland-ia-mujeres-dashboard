import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { NextActionsPanel } from '../src/features/ia-mujeres/components/next-actions-panel'
import { buildNextActions } from '../src/features/ia-mujeres/lib/next-actions'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('buildNextActions', () => {
  it('derives safe internal links for current priorities', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    expect(buildNextActions(snapshot)).toEqual([
      {
        id: 'manual-review',
        title: 'Revisar 2 oportunidades en revision manual.',
        href: '/ia-mujeres/operation?filter=manual_review',
      },
      {
        id: 'followups',
        title: 'Preparar 28 follow-ups pendientes.',
        href: '/ia-mujeres/operation?filter=followup',
      },
      {
        id: 'overdue',
        title: 'Resolver 2 tareas vencidas.',
        href: '/ia-mujeres/operation?filter=overdue',
      },
      {
        id: 'not-sent',
        title: 'Planificar primer contacto para 70 entidades sin contactar.',
        href: '/ia-mujeres/funnel?stage=NOT_SENT',
      },
    ])
  })
})

describe('NextActionsPanel', () => {
  it('renders actionable links for the derived priorities', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<NextActionsPanel snapshot={snapshot} />)

    expect(html).toContain('Ir a la cola')
    expect(html).toContain('/ia-mujeres/operation?filter=manual_review')
    expect(html).toContain('/ia-mujeres/funnel?stage=NOT_SENT')
  })

  it('renders an empty state when no priorities are pending', () => {
    const snapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      totals: {
        ...mockSnapshot.totals,
        manualReview: 0,
        followupsPending: 0,
        overdueTasks: 0,
        notSent: 0,
      },
    })

    const html = renderToStaticMarkup(<NextActionsPanel snapshot={snapshot} />)

    expect(html).toContain('No hay acciones prioritarias calculadas para este snapshot.')
  })
})
