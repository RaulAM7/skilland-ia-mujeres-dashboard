import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export type TaskQueueFilter = 'all' | 'overdue' | 'followup' | 'review'

export function filterTasks(
  tasks: IaMujeresDashboardSnapshot['tasks'],
  filter: TaskQueueFilter,
) {
  const filtered = (() => {
    switch (filter) {
      case 'overdue':
        return tasks.filter((task) => task.status === 'overdue')
      case 'followup':
        return tasks.filter((task) => task.category === 'followup')
      case 'review':
        return tasks.filter((task) => task.category === 'manual_review' || task.category === 'data_quality')
      default:
        return tasks
    }
  })()

  return sortTasksByUrgency(filtered)
}

export function getTaskQueueLabel(filter: TaskQueueFilter) {
  switch (filter) {
    case 'overdue':
      return 'Tareas vencidas'
    case 'followup':
      return 'Follow-ups de la muestra'
    case 'review':
      return 'Revision manual y calidad de datos'
    default:
      return 'Tareas'
  }
}

export function getTaskQueueEmptyMessage(filter: TaskQueueFilter) {
  switch (filter) {
    case 'overdue':
      return 'No hay tareas vencidas en la muestra actual.'
    case 'followup':
      return 'No hay follow-ups en la muestra actual.'
    case 'review':
      return 'No hay tareas de revision o calidad de datos en la muestra actual.'
    default:
      return 'No hay tareas para mostrar en este momento.'
  }
}

export function sortTasksByUrgency(tasks: IaMujeresDashboardSnapshot['tasks']) {
  return [...tasks].sort(compareTasks)
}

function compareTasks(left: IaMujeresDashboardSnapshot['tasks'][number], right: IaMujeresDashboardSnapshot['tasks'][number]) {
  return compareTaskStatus(left.status, right.status) || compareDates(left.dueAt, right.dueAt) || left.title.localeCompare(right.title)
}

function compareTaskStatus(left: string, right: string) {
  return getTaskStatusPriority(left) - getTaskStatusPriority(right)
}

function getTaskStatusPriority(status: string) {
  switch (status) {
    case 'overdue':
      return 0
    case 'open':
      return 1
    case 'blocked':
      return 2
    case 'done':
      return 3
    default:
      return 4
  }
}

function compareDates(left: string | undefined, right: string | undefined) {
  if (left && right) {
    return new Date(left).getTime() - new Date(right).getTime()
  }

  if (left) return -1
  if (right) return 1
  return 0
}
