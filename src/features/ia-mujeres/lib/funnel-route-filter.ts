export type FunnelRouteFilters = {
  search: string
  stageKey: string
  technicalOutcome: string
}

export function hasActiveFunnelFilters(filters: FunnelRouteFilters) {
  return Boolean(filters.search.trim() || filters.stageKey !== 'all' || filters.technicalOutcome !== 'all')
}

export function getFunnelFiltersFromSearch(search: string): FunnelRouteFilters {
  const params = new URLSearchParams(search)

  return {
    search: params.get('q') ?? '',
    stageKey: params.get('stage') ?? 'all',
    technicalOutcome: params.get('outcome') ?? 'all',
  }
}

export function getFunnelHref(filters: FunnelRouteFilters) {
  const params = new URLSearchParams()

  if (filters.search.trim()) params.set('q', filters.search.trim())
  if (filters.stageKey !== 'all') params.set('stage', filters.stageKey)
  if (filters.technicalOutcome !== 'all') params.set('outcome', filters.technicalOutcome)

  const query = params.toString()
  return query ? `/ia-mujeres/funnel?${query}` : '/ia-mujeres/funnel'
}
