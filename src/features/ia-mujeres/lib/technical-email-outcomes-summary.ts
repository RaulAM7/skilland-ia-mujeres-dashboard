import { getFunnelHref } from './funnel-route-filter'

export type TechnicalEmailOutcomeSummary = {
  key: 'attempted' | 'sent_without_bounce' | 'incidents'
  label: string
  value: number
  helper: string
  href?: string
  actionLabel?: string
}

export function getTechnicalEmailOutcomeSummaries(params: {
  attempted: number
  sentWithoutBounce: number
  bounceOrManualReviewIncidents: number
}) {
  const { attempted, sentWithoutBounce, bounceOrManualReviewIncidents } = params

  return [
    {
      key: 'attempted',
      label: 'Intentos de outreach',
      value: attempted,
      helper: attempted > 0 ? `${formatRate(attempted, attempted)} del trabajo tecnico previsto` : 'Sin outreach tecnico registrado',
    },
    {
      key: 'sent_without_bounce',
      label: 'Enviados sin bounce',
      value: sentWithoutBounce,
      helper: `${formatRate(sentWithoutBounce, attempted)} de los intentos`,
      href: getFunnelHref({
        search: '',
        stageKey: 'all',
        technicalOutcome: 'sent_without_bounce',
      }),
      actionLabel: 'Abrir entidades limpias',
    },
    {
      key: 'incidents',
      label: 'Incidencias tecnicas',
      value: bounceOrManualReviewIncidents,
      helper: `${formatRate(bounceOrManualReviewIncidents, attempted)} de los intentos`,
      href: '/ia-mujeres/operation?filter=manual_review',
      actionLabel: 'Ir a revision manual',
    },
  ] satisfies TechnicalEmailOutcomeSummary[]
}

function formatRate(value: number, total: number) {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
