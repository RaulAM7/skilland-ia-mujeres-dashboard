import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import {
  createSnapshotLoadErrorState,
  createSnapshotLoadStartState,
  createSnapshotLoadSuccessState,
  shouldApplySnapshotLoadResult,
  type SnapshotState,
} from '../src/features/ia-mujeres/hooks/snapshot-load-state'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

const snapshot = parseDashboardSnapshot(mockSnapshot)

describe('snapshot load state', () => {
  it('starts a preserving reload without dropping current data', () => {
    const current: SnapshotState = {
      data: snapshot,
      loading: false,
      refreshing: false,
      error: null,
      transportWarning: null,
    }

    expect(createSnapshotLoadStartState(current, true)).toEqual({
      ...current,
      loading: false,
      refreshing: true,
      error: null,
    })
  })

  it('keeps prior data on preserving reload failure', () => {
    const current: SnapshotState = {
      data: snapshot,
      loading: false,
      refreshing: true,
      error: null,
      transportWarning: 'Snapshot endpoint returned 503.',
    }

    expect(createSnapshotLoadErrorState(current, true, new Error('reload failed'))).toEqual({
      data: snapshot,
      loading: false,
      refreshing: false,
      error: 'reload failed',
      transportWarning: 'Snapshot endpoint returned 503.',
    })
  })

  it('replaces state on successful load', () => {
    expect(
      createSnapshotLoadSuccessState({
        data: snapshot,
        transportWarning: null,
      }),
    ).toEqual({
      data: snapshot,
      loading: false,
      refreshing: false,
      error: null,
      transportWarning: null,
    })
  })

  it('only applies the latest in-flight request result', () => {
    expect(shouldApplySnapshotLoadResult({ isMounted: true, latestRequestId: 3, requestId: 3 })).toBe(true)
    expect(shouldApplySnapshotLoadResult({ isMounted: true, latestRequestId: 3, requestId: 2 })).toBe(false)
    expect(shouldApplySnapshotLoadResult({ isMounted: false, latestRequestId: 3, requestId: 3 })).toBe(false)
  })
})
