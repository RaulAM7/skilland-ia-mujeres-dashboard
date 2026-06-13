import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export type DashboardBatch = NonNullable<IaMujeresDashboardSnapshot['batches']>[number]

export function getRecentBatches(batches: IaMujeresDashboardSnapshot['batches']) {
  return [...(batches ?? [])].sort((left, right) => {
    const leftTime = left.sentAt ? new Date(left.sentAt).getTime() : 0
    const rightTime = right.sentAt ? new Date(right.sentAt).getTime() : 0

    if (leftTime !== rightTime) {
      return rightTime - leftTime
    }

    return left.label.localeCompare(right.label)
  })
}
