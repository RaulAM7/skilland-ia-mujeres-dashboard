import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function NextActionsPanel({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const actions = [
    snapshot.totals.manualReview > 0
      ? `Revisar ${snapshot.totals.manualReview} oportunidades en revision manual.`
      : null,
    snapshot.totals.followupsPending > 0
      ? `Preparar ${snapshot.totals.followupsPending} follow-ups pendientes.`
      : null,
    snapshot.totals.overdueTasks > 0 ? `Resolver ${snapshot.totals.overdueTasks} tareas vencidas.` : null,
    snapshot.totals.notSent > 0 ? `Planificar primer contacto para ${snapshot.totals.notSent} entidades sin contactar.` : null,
  ].filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Que toca hoy</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {actions.map((action, index) => (
            <li key={action} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={15} aria-hidden="true" />
              </span>
              <span>
                <span className="font-medium">{index + 1}. </span>
                {action}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
