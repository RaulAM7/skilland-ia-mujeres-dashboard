import { useEffect, useState } from 'react'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

type SnapshotState = {
  data: IaMujeresDashboardSnapshot | null
  loading: boolean
  error: string | null
}

export function useIaMujeresSnapshot() {
  const [state, setState] = useState<SnapshotState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function loadSnapshot() {
      try {
        const response = await fetch('/api/ia-mujeres/snapshot')
        const json = (await response.json()) as IaMujeresDashboardSnapshot

        if (!cancelled) {
          setState({
            data: json,
            loading: false,
            error: response.ok ? null : `Snapshot endpoint returned ${response.status}`,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown snapshot fetch error',
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
