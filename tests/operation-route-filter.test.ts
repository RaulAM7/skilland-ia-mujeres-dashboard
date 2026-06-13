import { describe, expect, it } from 'vitest'
import {
  getOperationHref,
  getOperationHrefForTaskFilter,
  getOperationRouteFiltersFromSearch,
  getTaskFilterFromSearch,
  hasActiveOperationRouteFilters,
  isOperationFilterActive,
} from '../src/features/ia-mujeres/lib/operation-route-filter'

describe('operation route filter helpers', () => {
  it('maps query params to task queue filters safely', () => {
    expect(getTaskFilterFromSearch('')).toBe('all')
    expect(getTaskFilterFromSearch('?filter=overdue')).toBe('overdue')
    expect(getTaskFilterFromSearch('?filter=followup')).toBe('followup')
    expect(getTaskFilterFromSearch('?filter=review')).toBe('review')
    expect(getTaskFilterFromSearch('?filter=manual_review')).toBe('review')
    expect(getTaskFilterFromSearch('?filter=unexpected')).toBe('all')

    expect(getOperationRouteFiltersFromSearch('?filter=manual_review&entity=Camara+Demo')).toEqual({
      taskFilter: 'review',
      entitySearch: 'Camara Demo',
    })
  })

  it('builds stable operation hrefs for each task queue filter', () => {
    expect(getOperationHrefForTaskFilter('all')).toBe('/ia-mujeres/operation')
    expect(getOperationHrefForTaskFilter('overdue')).toBe('/ia-mujeres/operation?filter=overdue')
    expect(getOperationHrefForTaskFilter('followup')).toBe('/ia-mujeres/operation?filter=followup')
    expect(getOperationHrefForTaskFilter('review')).toBe('/ia-mujeres/operation?filter=manual_review')
    expect(getOperationHref({ taskFilter: 'review', entitySearch: 'Camara Demo' })).toBe(
      '/ia-mujeres/operation?filter=manual_review&entity=Camara+Demo',
    )
  })

  it('detects whether the current task queue is filtered', () => {
    expect(isOperationFilterActive('all')).toBe(false)
    expect(isOperationFilterActive('review')).toBe(true)
    expect(hasActiveOperationRouteFilters({ taskFilter: 'all', entitySearch: '' })).toBe(false)
    expect(hasActiveOperationRouteFilters({ taskFilter: 'all', entitySearch: 'Camara Demo' })).toBe(true)
  })
})
