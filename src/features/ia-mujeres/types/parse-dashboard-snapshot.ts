import type { IaMujeresDashboardSnapshot } from './dashboard-snapshot'
import { iaMujeresDashboardSnapshotSchema } from './dashboard-snapshot-schema'

export function parseDashboardSnapshot(payload: unknown): IaMujeresDashboardSnapshot {
  const parsed = iaMujeresDashboardSnapshotSchema.safeParse(payload)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const path = firstIssue?.path.length ? firstIssue.path.join('.') : 'root'
    throw new Error(`Snapshot payload failed schema validation at ${path}.`)
  }

  return parsed.data
}
