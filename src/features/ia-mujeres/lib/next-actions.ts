import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'
import { getFunnelHref } from './funnel-route-filter'
import { getOperationHrefForTaskFilter } from './operation-route-filter'

export type DashboardNextAction = {
  id: string
  title: string
  href: string
}

export function buildNextActions(snapshot: IaMujeresDashboardSnapshot): DashboardNextAction[] {
  const actions: DashboardNextAction[] = []

  if (snapshot.totals.manualReview > 0) {
    actions.push({
      id: 'manual-review',
      title: `Revisar ${snapshot.totals.manualReview} oportunidades en revision manual.`,
      href: getOperationHrefForTaskFilter('review'),
    })
  }

  if (snapshot.totals.followupsPending > 0) {
    actions.push({
      id: 'followups',
      title: `Preparar ${snapshot.totals.followupsPending} follow-ups pendientes.`,
      href: getOperationHrefForTaskFilter('followup'),
    })
  }

  if (snapshot.totals.overdueTasks > 0) {
    actions.push({
      id: 'overdue',
      title: `Resolver ${snapshot.totals.overdueTasks} tareas vencidas.`,
      href: getOperationHrefForTaskFilter('overdue'),
    })
  }

  if (snapshot.totals.notSent > 0) {
    actions.push({
      id: 'not-sent',
      title: `Planificar primer contacto para ${snapshot.totals.notSent} entidades sin contactar.`,
      href: getFunnelHref({
        search: '',
        stageKey: 'NOT_SENT',
        technicalOutcome: 'all',
      }),
    })
  }

  return actions
}
