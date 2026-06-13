import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertsPanel } from '../components/alerts-panel'
import { filterTasks, getTaskQueueEmptyMessage, getTaskQueueLabel, type TaskQueueFilter } from '../lib/filter-tasks'
import { NextActionsPanel } from '../components/next-actions-panel'
import { OpportunitiesTable } from '../components/opportunities-table'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import { TasksTable } from '../components/tasks-table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function OperationPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const [taskFilter, setTaskFilter] = useState<TaskQueueFilter>('all')
  const manualReview = snapshot.opportunities.filter(
    (opportunity) =>
      opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW' ||
      opportunity.technicalEmailOutcome === 'manual_review' ||
      opportunity.technicalEmailOutcome === 'bounced',
  )
  const filteredTasks = filterTasks(snapshot.tasks, taskFilter)
  const taskQueueOptions: Array<{ key: TaskQueueFilter; label: string; count: number }> = [
    { key: 'all', label: 'Todas', count: snapshot.tasks.length },
    { key: 'overdue', label: 'Vencidas', count: filterTasks(snapshot.tasks, 'overdue').length },
    { key: 'followup', label: 'Follow-up', count: filterTasks(snapshot.tasks, 'followup').length },
    { key: 'review', label: 'Revision', count: filterTasks(snapshot.tasks, 'review').length },
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-normal">Operacion</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tareas, follow-ups y revision manual del funnel.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric title="Tareas abiertas" value={snapshot.totals.openTasks} />
        <Metric title="Vencidas" value={snapshot.totals.overdueTasks} />
        <Metric title="Para hoy" value={snapshot.totals.dueTodayTasks} />
        <Metric title="Follow-ups" value={snapshot.totals.followupsPending} />
      </section>

      <SnapshotHealthBanner snapshot={snapshot} />

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <NextActionsPanel snapshot={snapshot} />
        <AlertsPanel alerts={snapshot.alerts} />
      </section>

      <Card>
        <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Colas operativas</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Filtra la muestra actual de tareas por urgencia o tipo de trabajo operativo.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {taskQueueOptions.map((option) => (
            <Button
              key={option.key}
              variant={taskFilter === option.key ? 'default' : 'secondary'}
              onClick={() => setTaskFilter(option.key)}
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </CardContent>
      </Card>

      <TasksTable
        tasks={filteredTasks}
        title={getTaskQueueLabel(taskFilter)}
        emptyMessage={getTaskQueueEmptyMessage(taskFilter)}
      />
      <OpportunitiesTable
        opportunities={manualReview}
        title="Revision manual y señales tecnicas"
        emptyMessage="No hay oportunidades en revision manual ni incidencias tecnicas pendientes."
      />
    </div>
  )
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
