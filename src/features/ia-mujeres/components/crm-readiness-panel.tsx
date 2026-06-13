import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCrmReadinessChecks, getCrmReadinessNextStep, getCrmReadinessStatus } from '../lib/crm-readiness'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const stateLabels = {
  ready: 'Listo',
  pending: 'Pendiente',
  blocked: 'Bloqueado',
} as const

const stateVariants = {
  ready: 'success',
  pending: 'warning',
  blocked: 'danger',
} as const

export function CrmReadinessPanel({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const checks = getCrmReadinessChecks(snapshot)
  const overallState = getCrmReadinessStatus(checks)
  const nextStep = getCrmReadinessNextStep(snapshot, checks)

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Readiness CRM local</CardTitle>
          <CardDescription>Resumen operativo de lo que falta para pasar de mock a CRM read-only.</CardDescription>
        </div>
        <Badge variant={stateVariants[overallState]}>{stateLabels[overallState]}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {checks.map((check) => (
            <div key={check.key} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium">{check.label}</div>
                <Badge variant={stateVariants[check.state]}>{stateLabels[check.state]}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{check.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/40 p-3">
          <div className="text-sm font-medium">Siguiente paso</div>
          <p className="mt-1 text-sm text-muted-foreground">{nextStep}</p>
        </div>
      </CardContent>
    </Card>
  )
}
