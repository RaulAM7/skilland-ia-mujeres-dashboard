import { AlertsPanel } from '../components/alerts-panel'
import { KpiCard } from '../components/kpi-card'
import { LazyFunnelStageChart } from '../components/lazy-funnel-stage-chart'
import { NextActionsPanel } from '../components/next-actions-panel'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import { SnapshotStatusBadge } from '../components/snapshot-status-badge'
import { TasksTable } from '../components/tasks-table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function OverviewPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot generado {new Date(snapshot.generatedAt).toLocaleString()}
          </p>
        </div>
        <SnapshotStatusBadge status={snapshot.status} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {snapshot.kpiCards.map((card) => (
          <KpiCard key={card.key} card={card} />
        ))}
      </section>

      <SnapshotHealthBanner snapshot={snapshot} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <LazyFunnelStageChart stages={snapshot.funnelStages} />
        <NextActionsPanel snapshot={snapshot} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <AlertsPanel alerts={snapshot.alerts} />
        <TasksTable tasks={snapshot.tasks.slice(0, 5)} />
      </section>
    </div>
  )
}
