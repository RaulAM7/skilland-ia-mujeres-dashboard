import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

type SnapshotFetchResponse = {
  ok: boolean
  status: number
  json(): Promise<unknown>
}

type SnapshotFetch = (input: string, init?: RequestInit) => Promise<SnapshotFetchResponse>

export type LoadedDashboardSnapshot = {
  data: IaMujeresDashboardSnapshot
  transportWarning: string | null
}

export async function loadDashboardSnapshot(fetchImpl: SnapshotFetch = fetch as SnapshotFetch): Promise<LoadedDashboardSnapshot> {
  const [response, { parseDashboardSnapshot }] = await Promise.all([
    fetchImpl('/api/ia-mujeres/snapshot'),
    import('../types/parse-dashboard-snapshot'),
  ])
  const snapshot = parseDashboardSnapshot(await response.json())

  return {
    data: snapshot,
    transportWarning: response.ok ? null : `Snapshot endpoint returned ${response.status}. Rendering the safe snapshot payload instead.`,
  }
}
