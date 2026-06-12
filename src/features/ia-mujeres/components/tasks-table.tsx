import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const statusVariant = {
  open: 'default',
  overdue: 'danger',
  done: 'success',
  blocked: 'warning',
} as const

export function TasksTable({ tasks }: { tasks: IaMujeresDashboardSnapshot['tasks'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vence</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Entidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="min-w-72 font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[task.status as keyof typeof statusVariant] ?? 'muted'}>{task.status}</Badge>
                </TableCell>
                <TableCell>{task.dueAt ? new Date(task.dueAt).toLocaleString() : 'Sin fecha'}</TableCell>
                <TableCell>{task.category ?? 'other'}</TableCell>
                <TableCell>{task.relatedCompany?.name ?? task.relatedOpportunity?.name ?? 'Sin relacion'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
