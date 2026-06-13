import type { TaskQueueFilter } from './filter-tasks'

export function isOperationFilterActive(filter: TaskQueueFilter) {
  return filter !== 'all'
}

export type OperationRouteFilters = {
  taskFilter: TaskQueueFilter
  entitySearch: string
}

export function getOperationRouteFiltersFromSearch(search: string): OperationRouteFilters {
  const params = new URLSearchParams(search)
  const filter = params.get('filter')
  const entitySearch = params.get('entity')?.trim() ?? ''

  return {
    taskFilter:
      filter === 'overdue'
        ? 'overdue'
        : filter === 'followup'
          ? 'followup'
          : filter === 'review' || filter === 'manual_review'
            ? 'review'
            : 'all',
    entitySearch,
  }
}

export function getTaskFilterFromSearch(search: string) {
  return getOperationRouteFiltersFromSearch(search).taskFilter
}

export function hasActiveOperationRouteFilters(filters: OperationRouteFilters) {
  return isOperationFilterActive(filters.taskFilter) || Boolean(filters.entitySearch.trim())
}

export function getOperationHref(filters: OperationRouteFilters) {
  const params = new URLSearchParams()

  if (filters.taskFilter === 'review') {
    params.set('filter', 'manual_review')
  } else if (filters.taskFilter !== 'all') {
    params.set('filter', filters.taskFilter)
  }

  if (filters.entitySearch.trim()) {
    params.set('entity', filters.entitySearch.trim())
  }

  const query = params.toString()
  return query ? `/ia-mujeres/operation?${query}` : '/ia-mujeres/operation'
}

export function getOperationHrefForTaskFilter(filter: TaskQueueFilter) {
  return getOperationHref({ taskFilter: filter, entitySearch: '' })
}
