import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

type ManualReviewOpportunity = IaMujeresDashboardSnapshot['opportunities'][number]

export function ManualReviewList({
  opportunities,
}: {
  opportunities: ManualReviewOpportunity[]
}) {
  return (
    <Card>
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Revision manual y senales tecnicas</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Incidencias que requieren validacion humana antes de continuar el funnel.
          </p>
        </div>
        <Badge variant="warning">{opportunities.length} en cola</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay oportunidades en revision manual ni incidencias tecnicas pendientes.
          </p>
        ) : null}

        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="rounded-md border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{opportunity.companyName ?? opportunity.name}</p>
                  <p className="text-sm text-muted-foreground">{opportunity.commercialStageLabel}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={opportunity.technicalEmailOutcome === 'bounced' ? 'danger' : 'warning'}>
                    {opportunity.technicalEmailOutcome ?? 'unknown'}
                  </Badge>
                  {opportunity.entityType ? <Badge variant="muted">{opportunity.entityType}</Badge> : null}
                </div>

                <div className="rounded-md bg-muted/60 px-3 py-2 text-sm text-foreground">
                  {opportunity.manualReviewReason ?? 'Sin motivo de revision manual documentado.'}
                </div>
              </div>

              <div className="flex max-w-xs gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                <div>
                  <div className="font-medium">Siguiente accion</div>
                  <div>{opportunity.nextActionLabel ?? 'Definir siguiente accion manual'}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
