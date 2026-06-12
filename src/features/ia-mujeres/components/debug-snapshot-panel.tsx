import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function DebugSnapshotPanel({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const isLocal = import.meta.env.DEV

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        {isLocal ? (
          <details className="rounded-md border border-border bg-muted p-3">
            <summary className="cursor-pointer text-sm font-medium">Mostrar JSON local</summary>
            <pre className="mt-3 max-h-[520px] overflow-auto text-xs">{JSON.stringify(snapshot, null, 2)}</pre>
          </details>
        ) : (
          <p className="text-sm text-muted-foreground">Raw snapshot solo se muestra en entorno local/dev.</p>
        )}
      </CardContent>
    </Card>
  )
}
