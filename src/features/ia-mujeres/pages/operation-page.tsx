import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertsPanel } from '../components/alerts-panel'
import { NextActionsPanel } from '../components/next-actions-panel'
import { OpportunitiesTable } from '../components/opportunities-table'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import { TasksTable } from '../components/tasks-table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function OperationPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const manualReview = snapshot.opportunities.filter(
    (opportunity) =>
      opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW' ||
      opportunity.technicalEmailOutcome === 'manual_review' ||
      opportunity.technicalEmailOutcome === 'bounced',
  )

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

      <TasksTable tasks={snapshot.tasks} />
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
