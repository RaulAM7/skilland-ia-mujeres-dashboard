import type { z } from 'zod'
import type { iaMujeresDashboardSnapshotSchema } from './dashboard-snapshot-schema'

export type IaMujeresDashboardSnapshot = z.infer<typeof iaMujeresDashboardSnapshotSchema>
export type IaMujeresDashboardSnapshotFromSchema = IaMujeresDashboardSnapshot
export type SnapshotStatus = IaMujeresDashboardSnapshot['status']
export type SnapshotSourceProvider = IaMujeresDashboardSnapshot['source']['crmProvider']
export type AlertLevel = IaMujeresDashboardSnapshot['alerts'][number]['level']
export type StageSemantic = IaMujeresDashboardSnapshot['funnelStages'][number]['semantic']
export type WarningCode = IaMujeresDashboardSnapshot['warnings'][number]['code']
export type DashboardTask = IaMujeresDashboardSnapshot['tasks'][number]
export type DashboardOpportunity = IaMujeresDashboardSnapshot['opportunities'][number]
