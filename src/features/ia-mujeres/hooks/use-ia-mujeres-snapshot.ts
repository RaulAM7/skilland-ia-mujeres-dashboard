import { useEffect, useState } from 'react'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'
import { loadDashboardSnapshot } from './load-dashboard-snapshot'

type SnapshotState = {
  data: IaMujeresDashboardSnapshot | null
  loading: boolean
  error: string | null
  transportWarning: string | null
}

export function useIaMujeresSnapshot() {
  const [state, setState] = useState<SnapshotState>({
    data: null,
    loading: true,
    error: null,
    transportWarning: null,
  })

  useEffect(() => {
    let cancelled = false

    async function loadSnapshot() {
      try {
        const result = await loadDashboardSnapshot()

        if (!cancelled) {
          setState({
            data: result.data,
            loading: false,
            error: null,
            transportWarning: result.transportWarning,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown snapshot fetch error',
            transportWarning: null,
          })
        }
      }
    }

    void loadSnapshot()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
