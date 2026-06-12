import { Badge } from '@/components/ui/badge'
import type { SnapshotStatus } from '../types/dashboard-snapshot'

const variants: Record<SnapshotStatus, 'success' | 'warning' | 'danger' | 'muted'> = {
  ok: 'success',
  stale: 'warning',
  partial: 'warning',
  error: 'danger',
}

export function SnapshotStatusBadge({ status }: { status: SnapshotStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>
}
