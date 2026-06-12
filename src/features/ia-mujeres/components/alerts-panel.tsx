import { AlertTriangle, Info, OctagonAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

type Alert = IaMujeresDashboardSnapshot['alerts'][number]

const iconByLevel = {
  info: Info,
  warning: AlertTriangle,
  critical: OctagonAlert,
}

const badgeByLevel = {
  info: 'default',
  warning: 'warning',
  critical: 'danger',
} as const

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? <p className="text-sm text-muted-foreground">Sin alertas activas.</p> : null}
        {alerts.map((alert) => {
          const Icon = iconByLevel[alert.level]
          return (
            <div key={alert.id} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Icon className="mt-0.5 text-muted-foreground" size={17} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <Badge variant={badgeByLevel[alert.level]}>{alert.level}</Badge>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
