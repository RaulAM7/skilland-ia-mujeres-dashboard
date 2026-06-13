import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { cn } from '@/lib/utils'
import { getKpiCardHref } from '../lib/kpi-card-links'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

type KpiCardData = IaMujeresDashboardSnapshot['kpiCards'][number]

export function KpiCard({ card }: { card: KpiCardData }) {
  const TrendIcon =
    card.trend?.direction === 'up' ? ArrowUpRight : card.trend?.direction === 'down' ? ArrowDownRight : ArrowRight
  const href = getKpiCardHref(card.key)

  const cardContent = (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-normal">{card.value}</div>
        {card.helper ? <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p> : null}
        {card.trend ? (
          <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <TrendIcon size={14} aria-hidden="true" />
            {card.trend.value} {card.trend.label}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )

  if (!href) {
    return cardContent
  }

  return (
    <a
      href={href}
      onClick={(event) => {
        if (!shouldHandleAppNavigation({ event, href, locationOrigin: window.location.origin })) {
          return
        }

        event.preventDefault()
        navigateAppTo(href)
      }}
      className={cn(
        'block rounded-lg outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      )}
    >
      {cardContent}
    </a>
  )
}
