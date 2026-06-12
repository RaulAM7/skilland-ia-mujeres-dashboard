import { FunnelStageChart } from '../components/funnel-stage-chart'
import { FunnelStageTable } from '../components/funnel-stage-table'
import { OpportunitiesTable } from '../components/opportunities-table'
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

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <FunnelStageChart stages={snapshot.funnelStages} />
        <FunnelStageTable stages={snapshot.funnelStages} />
      </section>

      <OpportunitiesTable opportunities={snapshot.opportunities} />
    </div>
  )
}
