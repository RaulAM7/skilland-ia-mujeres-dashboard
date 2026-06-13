import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { getTechnicalEmailOutcomeSummaries } from '../lib/technical-email-outcomes-summary'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function TechnicalEmailOutcomesPanel({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const outcomes = snapshot.technicalEmailOutcomes

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Salud tecnica del outreach</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Resume intentos, entregabilidad aparente e incidencias derivadas del snapshot actual.
          </p>
        </div>
        <Badge variant="muted">{outcomes?.attempted ?? 0} intentos</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {!outcomes ? <p className="text-sm text-muted-foreground">No hay resumen tecnico de outreach en el snapshot actual.</p> : null}

        {outcomes ? (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              {getTechnicalEmailOutcomeSummaries(outcomes).map((item) => (
                <div key={item.key} className="rounded-md border border-border p-3">
                  <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-3xl font-semibold">{item.value}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.helper}</p>
                  {item.href && item.actionLabel ? (
                    <a
                      href={item.href}
                      onClick={(event) => {
                        if (!shouldHandleAppNavigation({ event, href: item.href!, locationOrigin: window.location.origin })) {
                          return
                        }

                        event.preventDefault()
                        navigateAppTo(item.href!)
                      }}
                      className="mt-3 inline-flex rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {item.actionLabel}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>

            {outcomes.notes ? <p className="text-sm text-muted-foreground">{outcomes.notes}</p> : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
