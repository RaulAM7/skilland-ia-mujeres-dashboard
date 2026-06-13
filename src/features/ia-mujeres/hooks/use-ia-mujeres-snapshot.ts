import { useEffect, useRef, useState } from 'react'
import { loadDashboardSnapshot } from './load-dashboard-snapshot'
import {
  createSnapshotLoadErrorState,
  createSnapshotLoadStartState,
  createSnapshotLoadSuccessState,
  shouldApplySnapshotLoadResult,
  type SnapshotState,
} from './snapshot-load-state'

export function useIaMujeresSnapshot() {
  const isMountedRef = useRef(true)
  const latestRequestIdRef = useRef(0)
  const [state, setState] = useState<SnapshotState>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
    transportWarning: null,
  })

  async function runLoad(options?: { preserveData?: boolean }) {
    const preserveData = options?.preserveData ?? false
    const requestId = latestRequestIdRef.current + 1
    latestRequestIdRef.current = requestId

    setState((current) => createSnapshotLoadStartState(current, preserveData))

    try {
      const result = await loadDashboardSnapshot()

      if (
        !shouldApplySnapshotLoadResult({
          isMounted: isMountedRef.current,
          latestRequestId: latestRequestIdRef.current,
          requestId,
        })
      ) {
        return
      }

      setState(createSnapshotLoadSuccessState(result))
    } catch (error) {
      if (
        !shouldApplySnapshotLoadResult({
          isMounted: isMountedRef.current,
          latestRequestId: latestRequestIdRef.current,
          requestId,
        })
      ) {
        return
      }

      setState((current) => createSnapshotLoadErrorState(current, preserveData, error))
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    void runLoad()
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    ...state,
    reload: () => runLoad({ preserveData: true }),
  }
}
