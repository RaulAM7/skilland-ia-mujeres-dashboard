import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FunnelStageTable } from '../src/features/ia-mujeres/components/funnel-stage-table'
import { NextActionsPanel } from '../src/features/ia-mujeres/components/next-actions-panel'
import { OpportunitiesTable } from '../src/features/ia-mujeres/components/opportunities-table'
import { TasksTable } from '../src/features/ia-mujeres/components/tasks-table'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'

describe('empty states', () => {
  it('renders a message when no opportunities are available', () => {
    const html = renderToStaticMarkup(
      <OpportunitiesTable
        opportunities={[]}
        title="Revision manual y señales tecnicas"
        emptyMessage="No hay oportunidades en revision manual ni incidencias tecnicas pendientes."
      />,
    )

    expect(html).toContain('Revision manual y señales tecnicas')
    expect(html).toContain('No hay oportunidades en revision manual ni incidencias tecnicas pendientes.')
  })

  it('renders a linked opportunity entity towards the operation view', () => {
    const html = renderToStaticMarkup(
      <OpportunitiesTable
        opportunities={[
          {
            id: 'opp-entity',
            name: 'Fundacion Demo',
            companyName: 'Fundacion Demo',
            commercialStage: 'NOT_SENT',
            commercialStageLabel: 'Sin contactar',
            technicalEmailOutcome: 'not_attempted',
          },
        ]}
      />,
    )

    expect(html).toContain('href="/ia-mujeres/operation?entity=Fundacion+Demo"')
    expect(html).toContain('Fundacion Demo')
  })

  it('renders a message when no tasks are available', () => {
    const html = renderToStaticMarkup(<TasksTable tasks={[]} />)

    expect(html).toContain('No hay tareas para mostrar en este momento.')
  })

  it('renders a linked related entity when a task provides one', () => {
    const html = renderToStaticMarkup(
      <TasksTable
        tasks={[
          {
            id: 'task-entity',
            title: 'Validar contacto',
            status: 'open',
            relatedCompany: {
              id: 'co-entity',
              name: 'Universidad Demo',
            },
          },
        ]}
      />,
    )

    expect(html).toContain('href="/ia-mujeres/funnel?q=Universidad+Demo"')
    expect(html).toContain('Universidad Demo')
  })

  it('renders a message when no stages are available', () => {
    const html = renderToStaticMarkup(<FunnelStageTable stages={[]} />)

    expect(html).toContain('No hay stages disponibles en el snapshot actual.')
  })

  it('renders a message when there are no next actions', () => {
    const quietSnapshot = parseDashboardSnapshot({
      ...mockSnapshot,
      totals: {
        ...mockSnapshot.totals,
        manualReview: 0,
        followupsPending: 0,
        overdueTasks: 0,
        notSent: 0,
      },
    })
    const html = renderToStaticMarkup(<NextActionsPanel snapshot={quietSnapshot} />)

    expect(html).toContain('No hay acciones prioritarias calculadas para este snapshot.')
  })
})
