import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DebugSnapshotPanel } from '../components/debug-snapshot-panel'
import { SnapshotStatusBadge } from '../components/snapshot-status-badge'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function DebugPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-normal">Debug</h2>
        <p className="mt-1 text-sm text-muted-foreground">Estado tecnico seguro del snapshot. No muestra secretos.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DebugItem title="Status">
          <SnapshotStatusBadge status={snapshot.status} />
        </DebugItem>
        <DebugItem title="Provider">
          <Badge variant="muted">{snapshot.source.crmProvider}</Badge>
        </DebugItem>
        <DebugItem title="Campaign">{snapshot.source.campaignKey}</DebugItem>
        <DebugItem title="Runtime verified">{String(snapshot.source.runtimeVerified ?? false)}</DebugItem>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {snapshot.warnings.map((warning) => (
            <div key={`${warning.code}-${warning.message}`} className="rounded-md border border-border p-3 text-sm">
              <div className="font-medium">{warning.code}</div>
              <div className="mt-1 text-muted-foreground">{warning.message}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <DebugSnapshotPanel snapshot={snapshot} />
    </div>
  )
}

function DebugItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{children}</div>
      </CardContent>
    </Card>
  )
}
