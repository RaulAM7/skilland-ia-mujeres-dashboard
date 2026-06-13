import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export type TaskQueueFilter = 'all' | 'overdue' | 'followup' | 'review'

export function filterTasks(
  tasks: IaMujeresDashboardSnapshot['tasks'],
  filter: TaskQueueFilter,
) {
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
