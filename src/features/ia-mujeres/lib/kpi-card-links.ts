import { getFunnelHref } from './funnel-route-filter'
import { getOperationHrefForTaskFilter } from './operation-route-filter'

export function getKpiCardHref(cardKey: string) {
  switch (cardKey) {
    case 'opportunities':
      return '/ia-mujeres/funnel'
    case 'not_sent':
      return getFunnelHref({
        search: '',
        stageKey: 'NOT_SENT',
        technicalOutcome: 'all',
      })
    case 'sent_without_bounce':
      return getFunnelHref({
        search: '',
        stageKey: 'all',
        technicalOutcome: 'sent_without_bounce',
      })
    case 'manual_review':
      return getOperationHrefForTaskFilter('review')
    case 'open_tasks':
      return getOperationHrefForTaskFilter('all')
    default:
      return undefined
  }
}
