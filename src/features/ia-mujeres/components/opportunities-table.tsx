import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { getOpportunityOperationHref } from '../lib/entity-links'
import { getTechnicalOutcomeLabel } from '../lib/technical-outcome-labels'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function OpportunitiesTable({
  opportunities,
  title = 'Oportunidades representativas',
  emptyMessage = 'No hay oportunidades para mostrar en este momento.',
}: {
  opportunities: IaMujeresDashboardSnapshot['opportunities']
  title?: string
  emptyMessage?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entidad</TableHead>
              <TableHead>Stage comercial</TableHead>
              <TableHead>Resultado tecnico</TableHead>
              <TableHead>Proxima accion</TableHead>
              <TableHead>ICP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : null}
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <a
                    href={getOpportunityOperationHref(opportunity)}
                    onClick={(event) => {
                      const href = getOpportunityOperationHref(opportunity)
                      if (!shouldHandleAppNavigation({ event, href, locationOrigin: window.location.origin })) {
                        return
                      }

                      event.preventDefault()
                      navigateAppTo(href)
                    }}
                    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                  >
                    {opportunity.companyName ?? opportunity.name}
                  </a>
                  <div className="text-xs text-muted-foreground">{opportunity.entityType ?? 'Tipo no confirmado'}</div>
                </TableCell>
                <TableCell>{opportunity.commercialStageLabel}</TableCell>
                <TableCell>
                  <Badge variant={opportunity.technicalEmailOutcome === 'bounced' ? 'danger' : 'muted'}>
                    {getTechnicalOutcomeLabel(opportunity.technicalEmailOutcome)}
                  </Badge>
                </TableCell>
                <TableCell>{opportunity.nextActionLabel ?? 'Sin proxima accion'}</TableCell>
                <TableCell>{opportunity.icp ?? 'Unknown'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
