import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const semanticVariant = {
  neutral: 'muted',
  active: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  future: 'muted',
  unknown: 'warning',
} as const

export function FunnelStageTable({ stages }: { stages: IaMujeresDashboardSnapshot['funnelStages'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stages</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((stage) => (
              <TableRow key={stage.key}>
                <TableCell className="font-medium">{stage.label}</TableCell>
                <TableCell>{stage.count}</TableCell>
                <TableCell>{stage.percentage}%</TableCell>
                <TableCell>
                  <Badge variant={semanticVariant[stage.semantic]}>{stage.semantic}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
