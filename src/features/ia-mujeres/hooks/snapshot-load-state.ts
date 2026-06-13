import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'
import type { LoadedDashboardSnapshot } from './load-dashboard-snapshot'

export type SnapshotState = {
  data: IaMujeresDashboardSnapshot | null
  loading: boolean
  refreshing: boolean
  error: string | null
  transportWarning: string | null
}

export function createSnapshotLoadStartState(current: SnapshotState, preserveData: boolean): SnapshotState {
  return {
    ...current,
    loading: preserveData ? current.loading : !current.data,
    refreshing: preserveData && Boolean(current.data),
    error: preserveData ? current.error : null,
  }
}

export function createSnapshotLoadSuccessState(result: LoadedDashboardSnapshot): SnapshotState {
  return {
    data: result.data,
    loading: false,
    refreshing: false,
    error: null,
    transportWarning: result.transportWarning,
  }
}

export function createSnapshotLoadErrorState(
  current: SnapshotState,
  preserveData: boolean,
  error: unknown,
): SnapshotState {
  return {
    data: preserveData ? current.data : null,
    loading: false,
    refreshing: false,
    error: error instanceof Error ? error.message : 'Unknown snapshot fetch error',
    transportWarning: preserveData ? current.transportWarning : null,
  }
}

export function shouldApplySnapshotLoadResult(params: {
  isMounted: boolean
  latestRequestId: number
  requestId: number
}) {
  return params.isMounted && params.requestId === params.latestRequestId
}
