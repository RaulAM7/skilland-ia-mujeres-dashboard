import { useEffect, useRef, useState } from 'react'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'
import { loadDashboardSnapshot } from './load-dashboard-snapshot'

type SnapshotState = {
  data: IaMujeresDashboardSnapshot | null
  loading: boolean
  refreshing: boolean
  error: string | null
  transportWarning: string | null
}

export function useIaMujeresSnapshot() {
  const isMountedRef = useRef(true)
  const [state, setState] = useState<SnapshotState>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
    transportWarning: null,
  })

  async function runLoad(options?: { preserveData?: boolean }) {
    const preserveData = options?.preserveData ?? false

    setState((current) => ({
      ...current,
      loading: preserveData ? current.loading : !current.data,
      refreshing: preserveData && Boolean(current.data),
      error: preserveData ? current.error : null,
    }))

    try {
      const result = await loadDashboardSnapshot()

      if (!isMountedRef.current) return

      setState({
        data: result.data,
        loading: false,
        refreshing: false,
        error: null,
        transportWarning: result.transportWarning,
      })
    } catch (error) {
      if (!isMountedRef.current) return

      setState((current) => ({
        data: preserveData ? current.data : null,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Unknown snapshot fetch error',
        transportWarning: preserveData ? current.transportWarning : null,
      }))
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
