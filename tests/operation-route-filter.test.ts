import { describe, expect, it } from 'vitest'
import { getOperationHrefForTaskFilter, getTaskFilterFromSearch } from '../src/features/ia-mujeres/lib/operation-route-filter'

describe('operation route filter helpers', () => {
  it('maps query params to task queue filters safely', () => {
    expect(getTaskFilterFromSearch('')).toBe('all')
    expect(getTaskFilterFromSearch('?filter=overdue')).toBe('overdue')
    expect(getTaskFilterFromSearch('?filter=followup')).toBe('followup')
    expect(getTaskFilterFromSearch('?filter=review')).toBe('review')
    expect(getTaskFilterFromSearch('?filter=manual_review')).toBe('review')
    expect(getTaskFilterFromSearch('?filter=unexpected')).toBe('all')
  })

  it('builds stable operation hrefs for each task queue filter', () => {
    expect(getOperationHrefForTaskFilter('all')).toBe('/ia-mujeres/operation')
    expect(getOperationHrefForTaskFilter('overdue')).toBe('/ia-mujeres/operation?filter=overdue')
    expect(getOperationHrefForTaskFilter('followup')).toBe('/ia-mujeres/operation?filter=followup')
    expect(getOperationHrefForTaskFilter('review')).toBe('/ia-mujeres/operation?filter=manual_review')
  })
})
