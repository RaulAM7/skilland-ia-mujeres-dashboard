import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SnapshotStatusBadge } from './snapshot-status-badge'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const toneByStatus = {
  ok: 'border-emerald-200 bg-emerald-50/60',
  stale: 'border-amber-200 bg-amber-50/60',
  partial: 'border-amber-200 bg-amber-50/60',
  error: 'border-rose-200 bg-rose-50/60',
} as const

export function SnapshotHealthBanner({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const warningCount = snapshot.warnings.length
  const warningCodes = snapshot.warnings.slice(0, 3)

  return (
    <Card className={toneByStatus[snapshot.status]}>
      <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Salud del snapshot</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Generado {new Date(snapshot.generatedAt).toLocaleString()} con provider {snapshot.source.crmProvider}.
          </p>
        </div>
        <SnapshotStatusBadge status={snapshot.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">Modo {snapshot.source.dataMode ?? 'unknown'}</Badge>
          <Badge variant="muted">Warnings {warningCount}</Badge>
          {snapshot.source.runtimeVerified !== undefined ? (
            <Badge variant={snapshot.source.runtimeVerified ? 'success' : 'warning'}>
              Runtime {snapshot.source.runtimeVerified ? 'verified' : 'unverified'}
            </Badge>
          ) : null}
        </div>

        {warningCodes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {warningCodes.map((warning) => (
              <Badge key={`${warning.code}-${warning.message}`} variant="warning">
                {warning.code}
              </Badge>
            ))}
            {warningCount > warningCodes.length ? <Badge variant="muted">+{warningCount - warningCodes.length} mas</Badge> : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay warnings activos en el snapshot actual.</p>
        )}

        {snapshot.source.lastError ? <p className="text-sm text-rose-800">{snapshot.source.lastError}</p> : null}
      </CardContent>
    </Card>
  )
}
