import { FunnelStageTable } from '../components/funnel-stage-table'
import { LazyFunnelStageChart } from '../components/lazy-funnel-stage-chart'
import { OpportunitiesTable } from '../components/opportunities-table'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function FunnelPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-normal">Funnel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribucion por stage comercial y oportunidades representativas del mock.
        </p>
      </section>

      <SnapshotHealthBanner snapshot={snapshot} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <LazyFunnelStageChart stages={snapshot.funnelStages} />
        <FunnelStageTable stages={snapshot.funnelStages} />
      </section>

      <OpportunitiesTable opportunities={snapshot.opportunities} />
    </div>
  )
}
