import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { DashboardBatch } from '../lib/recent-batches'

const statusVariant: Record<string, 'muted' | 'success' | 'warning' | 'danger'> = {
  mock: 'muted',
  sent: 'success',
  processing: 'warning',
  failed: 'danger',
}

export function BatchesTable({
  batches,
  title = 'Lotes recientes de outreach',
}: {
  batches: DashboardBatch[]
  title?: string
}) {
  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="muted">{batches.length} lotes</Badge>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lote</TableHead>
              <TableHead>Enviado</TableHead>
              <TableHead>Enviados</TableHead>
              <TableHead>Bounces</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No hay lotes recientes en el snapshot actual.
                </TableCell>
              </TableRow>
            ) : null}

            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="min-w-56 font-medium">{batch.label}</TableCell>
                <TableCell>{batch.sentAt ? new Date(batch.sentAt).toLocaleString() : 'Pendiente'}</TableCell>
                <TableCell>{batch.sentCount}</TableCell>
                <TableCell>{batch.bounceCount}</TableCell>
                <TableCell>{batch.replyCount}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[batch.status] ?? 'muted'}>{batch.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
