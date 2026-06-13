import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { filterTasks, getTaskQueueEmptyMessage, getTaskQueueLabel } from '../src/features/ia-mujeres/lib/filter-tasks'
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

  it('exposes stable labels and empty messages', () => {
    expect(getTaskQueueLabel('followup')).toBe('Follow-ups de la muestra')
    expect(getTaskQueueEmptyMessage('review')).toContain('revision')
  })
})
