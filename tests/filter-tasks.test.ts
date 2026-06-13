import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { filterTasks, filterTasksByEntity, getTaskQueueEmptyMessage, getTaskQueueLabel } from '../src/features/ia-mujeres/lib/filter-tasks'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

const tasks = parseDashboardSnapshot(mockSnapshot).tasks

describe('filterTasks', () => {
  it('returns overdue tasks only', () => {
    const filtered = filterTasks(tasks, 'overdue')

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((task) => task.status === 'overdue')).toBe(true)
  })

  it('returns follow-up tasks only', () => {
    const filtered = filterTasks(tasks, 'followup')

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((task) => task.category === 'followup')).toBe(true)
  })

  it('returns review tasks from manual review and data quality categories', () => {
    const filtered = filterTasks(tasks, 'review')

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((task) => task.category === 'manual_review' || task.category === 'data_quality')).toBe(true)
  })

  it('sorts tasks by urgency and due date within each queue', () => {
    const filtered = filterTasks(
      [
        {
          id: 'task-3',
          title: 'Sin fecha',
          status: 'open',
          category: 'followup',
        },
        {
          id: 'task-1',
          title: 'Mas urgente',
          status: 'overdue',
          dueAt: '2026-06-12T08:00:00.000Z',
          category: 'followup',
        },
        {
          id: 'task-2',
          title: 'Abierta con fecha',
          status: 'open',
          dueAt: '2026-06-12T09:00:00.000Z',
          category: 'followup',
        },
      ],
      'all',
    )

    expect(filtered.map((task) => task.id)).toEqual(['task-1', 'task-2', 'task-3'])
  })

  it('filters tasks by related entity name', () => {
    const filtered = filterTasksByEntity(tasks, 'Camara Comercio Demo')

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((task) => (task.relatedCompany?.name ?? task.relatedOpportunity?.name ?? '').includes('Camara Comercio Demo'))).toBe(
      true,
    )
  })

  it('exposes stable labels and empty messages', () => {
    expect(getTaskQueueLabel('followup')).toBe('Follow-ups de la muestra')
    expect(getTaskQueueEmptyMessage('review')).toContain('revision')
  })
})
