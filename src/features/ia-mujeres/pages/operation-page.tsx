import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { navigateAppTo } from '@/lib/app-navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertsPanel } from '../components/alerts-panel'
import { FocusedOpportunityPanel } from '../components/focused-opportunity-panel'
import { filterTasks, filterTasksByEntity, getTaskQueueEmptyMessage, getTaskQueueLabel, type TaskQueueFilter } from '../lib/filter-tasks'
import { getOpportunityFunnelHref } from '../lib/entity-links'
import { filterOpportunities } from '../lib/filter-opportunities'
import { filterManualReviewOpportunitiesByEntity, getManualReviewOpportunities } from '../lib/manual-review-opportunities'
import {
  getOperationHref,
  getOperationRouteFiltersFromSearch,
  hasActiveOperationRouteFilters,
  isOperationFilterActive,
} from '../lib/operation-route-filter'
import { ManualReviewList } from '../components/manual-review-list'
import { NextActionsPanel } from '../components/next-actions-panel'
import { getRelatedTasksForOpportunity } from '../lib/opportunity-related-tasks'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import { TasksTable } from '../components/tasks-table'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function OperationPage({
  snapshot,
  search = '',
}: {
  snapshot: IaMujeresDashboardSnapshot
  search?: string
}) {
  const routeFilters = useMemo(() => getOperationRouteFiltersFromSearch(search), [search])
  const [taskFilter, setTaskFilter] = useState<TaskQueueFilter>(routeFilters.taskFilter)
  const [entitySearch, setEntitySearch] = useState(routeFilters.entitySearch)
  const matchingOpportunities = filterOpportunities(snapshot.opportunities, {
    search: entitySearch,
    stageKey: 'all',
    technicalOutcome: 'all',
  })
  const focusedOpportunity = entitySearch && matchingOpportunities.length === 1 ? matchingOpportunities[0] : undefined
  const entityScopedTasks = filterTasksByEntity(snapshot.tasks, entitySearch)
  const filteredTasks = filterTasks(entityScopedTasks, taskFilter)
  const manualReview = filterManualReviewOpportunitiesByEntity(
    getManualReviewOpportunities(snapshot.opportunities),
    entitySearch,
  )
  const focusedOpportunityTasks = focusedOpportunity ? getRelatedTasksForOpportunity(snapshot.tasks, focusedOpportunity) : []
  const taskQueueOptions: Array<{ key: TaskQueueFilter; label: string; count: number }> = [
    { key: 'all', label: 'Todas', count: entityScopedTasks.length },
    { key: 'overdue', label: 'Vencidas', count: filterTasks(entityScopedTasks, 'overdue').length },
    { key: 'followup', label: 'Follow-up', count: filterTasks(entityScopedTasks, 'followup').length },
    { key: 'review', label: 'Revision', count: filterTasks(entityScopedTasks, 'review').length },
  ]

  useEffect(() => {
    setTaskFilter(routeFilters.taskFilter)
    setEntitySearch(routeFilters.entitySearch)
  }, [routeFilters])

  const syncRoute = (nextFilters: { taskFilter: TaskQueueFilter; entitySearch: string }) => {
    navigateAppTo(getOperationHref(nextFilters), undefined, { historyMode: 'replace' })
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-normal">Operacion</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tareas, follow-ups y revision manual del funnel.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric title="Tareas abiertas" value={snapshot.totals.openTasks} />
        <Metric title="Vencidas" value={snapshot.totals.overdueTasks} />
        <Metric title="Para hoy" value={snapshot.totals.dueTodayTasks} />
        <Metric title="Follow-ups" value={snapshot.totals.followupsPending} />
      </section>

      <SnapshotHealthBanner snapshot={snapshot} />

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <NextActionsPanel snapshot={snapshot} />
        <AlertsPanel alerts={snapshot.alerts} />
      </section>

      <Card>
        <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Colas operativas</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Filtra la muestra actual de tareas por urgencia o tipo de trabajo operativo.
            </p>
          </div>
          {hasActiveOperationRouteFilters({ taskFilter, entitySearch }) ? (
            <Button
              variant="ghost"
              onClick={() => {
                setTaskFilter('all')
                setEntitySearch('')
                navigateAppTo('/ia-mujeres/operation', undefined, { historyMode: 'replace' })
              }}
            >
              Limpiar filtros
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {hasActiveOperationRouteFilters({ taskFilter, entitySearch }) ? (
            <div className="flex flex-wrap gap-2">
              {isOperationFilterActive(taskFilter) ? <Badge variant="muted">Cola activa: {getTaskQueueLabel(taskFilter)}</Badge> : null}
              {entitySearch ? <Badge variant="muted">Entidad: {entitySearch}</Badge> : null}
            </div>
          ) : null}

          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Filtrar entidad</span>
            <input
              value={entitySearch}
              onChange={(event) => {
                const nextEntitySearch = event.target.value
                setEntitySearch(nextEntitySearch)
                syncRoute({
                  taskFilter,
                  entitySearch: nextEntitySearch,
                })
              }}
              placeholder="Ej. Camara Comercio Demo"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {taskQueueOptions.map((option) => (
              <Button
                key={option.key}
                variant={taskFilter === option.key ? 'default' : 'secondary'}
                onClick={() => {
                  setTaskFilter(option.key)
                  syncRoute({
                    taskFilter: option.key,
                    entitySearch,
                  })
                }}
              >
                {option.label} ({option.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {focusedOpportunity ? (
        <FocusedOpportunityPanel
          opportunity={focusedOpportunity}
          relatedTasks={focusedOpportunityTasks}
          actionLink={{
            href: getOpportunityFunnelHref(focusedOpportunity),
            label: 'Abrir entidad en funnel',
          }}
        />
      ) : null}

      <TasksTable
        tasks={filteredTasks}
        title={entitySearch ? `${getTaskQueueLabel(taskFilter)} · ${entitySearch}` : getTaskQueueLabel(taskFilter)}
        emptyMessage={getTaskQueueEmptyMessage(taskFilter)}
      />
      <ManualReviewList opportunities={manualReview} />
    </div>
  )
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
