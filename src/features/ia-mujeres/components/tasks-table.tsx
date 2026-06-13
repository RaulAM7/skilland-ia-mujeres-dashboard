import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { getTaskRelatedEntityHref } from '../lib/entity-links'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

const statusVariant = {
  open: 'default',
  overdue: 'danger',
  done: 'success',
  blocked: 'warning',
} as const

export function TasksTable({
  tasks,
  title = 'Tareas',
  emptyMessage = 'No hay tareas para mostrar en este momento.',
}: {
  tasks: IaMujeresDashboardSnapshot['tasks']
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
              <TableHead>Tarea</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vence</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Entidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : null}
            {tasks.map((task) => {
              const relatedEntityHref = getTaskRelatedEntityHref(task)

              return (
                <TableRow key={task.id}>
                  <TableCell className="min-w-72 font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[task.status as keyof typeof statusVariant] ?? 'muted'}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{task.dueAt ? new Date(task.dueAt).toLocaleString() : 'Sin fecha'}</TableCell>
                  <TableCell>{task.category ?? 'other'}</TableCell>
                  <TableCell>
                    {relatedEntityHref ? (
                      <a
                        href={relatedEntityHref}
                        onClick={(event) => {
                          if (
                            !shouldHandleAppNavigation({ event, href: relatedEntityHref, locationOrigin: window.location.origin })
                          ) {
                            return
                          }

                          event.preventDefault()
                          navigateAppTo(relatedEntityHref)
                        }}
                        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                      >
                        {task.relatedCompany?.name ?? task.relatedOpportunity?.name}
                      </a>
                    ) : (
                      'Sin relacion'
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
