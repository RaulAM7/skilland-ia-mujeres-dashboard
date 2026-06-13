import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const FunnelStageChartImpl = lazy(() =>
  import('./funnel-stage-chart').then((module) => ({
    default: module.FunnelStageChart,
  })),
)

export function LazyFunnelStageChart({ stages }: { stages: IaMujeresDashboardSnapshot['funnelStages'] }) {
  return (
    <Suspense fallback={<FunnelStageChartFallback />}>
      <FunnelStageChartImpl stages={stages} />
    </Suspense>
  )
}

function FunnelStageChartFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribucion por stage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          Cargando grafico...
        </div>
      </CardContent>
    </Card>
  )
}
