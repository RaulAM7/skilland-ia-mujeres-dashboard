import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { buildNextActions } from '../lib/next-actions'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function NextActionsPanel({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const actions = buildNextActions(snapshot)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Que toca hoy</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay acciones prioritarias calculadas para este snapshot.</p>
        ) : null}
        <ol className="space-y-3">
          {actions.map((action, index) => (
            <li key={action.id} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={15} aria-hidden="true" />
              </span>
              <div className="space-y-2">
                <span className="font-medium">{index + 1}. </span>
                {action.title}
                <div>
                  <a
                    href={action.href}
                    onClick={(event) => {
                      if (!shouldHandleAppNavigation({ event, href: action.href, locationOrigin: window.location.origin })) {
                        return
                      }

                      event.preventDefault()
                      navigateAppTo(action.href)
                    }}
                    className="inline-flex rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Ir a la cola
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
