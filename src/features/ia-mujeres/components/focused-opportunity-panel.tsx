import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardOpportunity, DashboardTask } from '../types/dashboard-snapshot'

export function FocusedOpportunityPanel({
  opportunity,
  relatedTasks,
}: {
  opportunity: DashboardOpportunity
  relatedTasks: DashboardTask[]
}) {
  const nextTask = relatedTasks[0]

  return (
    <Card>
      <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Entidad enfocada</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            El filtro actual deja una sola oportunidad visible para revisar en detalle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={opportunity.technicalEmailOutcome === 'bounced' ? 'danger' : 'muted'}>
            {opportunity.technicalEmailOutcome ?? 'unknown'}
          </Badge>
          {opportunity.entityType ? <Badge variant="muted">{opportunity.entityType}</Badge> : null}
          {opportunity.icp ? <Badge variant="muted">{opportunity.icp}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-lg font-semibold">{opportunity.companyName ?? opportunity.name}</div>
          <div className="text-sm text-muted-foreground">{opportunity.commercialStageLabel}</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem label="Proxima accion" value={opportunity.nextActionLabel ?? 'Sin proxima accion'} />
          <InfoItem label="Owner" value={opportunity.owner ?? 'Sin owner'} />
          <InfoItem label="Territorio" value={opportunity.territory ?? 'Sin territorio'} />
          <InfoItem label="Ultimo contacto" value={formatDateTime(opportunity.lastContactAt) ?? 'Sin registro'} />
          <InfoItem label="Tareas relacionadas" value={String(relatedTasks.length)} />
          <InfoItem label="Siguiente tarea" value={nextTask?.title ?? 'Sin tareas relacionadas'} />
        </div>

        {nextTask ? (
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
            <span className="font-medium">Proximo vencimiento:</span>{' '}
            {formatDateTime(nextTask.dueAt) ?? 'Sin fecha'} {nextTask.status ? `(${nextTask.status})` : ''}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay tareas relacionadas con esta entidad en la muestra actual.</p>
        )}
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

function formatDateTime(value: string | undefined) {
  return value ? new Date(value).toLocaleString() : undefined
}
