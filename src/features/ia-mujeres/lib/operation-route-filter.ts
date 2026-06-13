import type { TaskQueueFilter } from './filter-tasks'

export function isOperationFilterActive(filter: TaskQueueFilter) {
  return filter !== 'all'
}

export function getTaskFilterFromSearch(search: string) {
  const params = new URLSearchParams(search)
  const filter = params.get('filter')

  if (filter === 'overdue') return 'overdue'
  if (filter === 'followup') return 'followup'
  if (filter === 'review' || filter === 'manual_review') return 'review'
  return 'all'
}

export function getOperationHrefForTaskFilter(filter: TaskQueueFilter) {
  if (filter === 'all') return '/ia-mujeres/operation'
  if (filter === 'review') return '/ia-mujeres/operation?filter=manual_review'
  return `/ia-mujeres/operation?filter=${filter}`
}
