import type {
  DashboardOpportunity,
  DashboardTask,
  IaMujeresDashboardSnapshot,
} from '../../src/features/ia-mujeres/types/dashboard-snapshot'

export type RawIaMujeresOpportunity = Partial<DashboardOpportunity> & {
  id: string
  name?: string
  iaMujeresFunnelStage?: string
  outreachStatus?: string
  firstEmailSentAt?: string
  lastEmailSentAt?: string
  lastReplyAt?: string
  followUpDueAt?: string
  gmailDraftId?: string
  gmailMessageId?: string
  gmailThreadId?: string
  lastEmailEventAt?: string
  lastEmailEventType?: string
  activeBatchId?: string
  needsManualReview?: boolean
  duplicatePossible?: boolean
  genericEmail?: boolean
}

export type RawIaMujeresTask = Partial<DashboardTask> & {
  id: string
  title?: string
  status?: string
  dueAt?: string
}

export type RawIaMujeresCompany = {
  id: string
  name: string
}

export type RawIaMujeresPerson = {
  id: string
  name?: string
}

export type CrmHealthStatus = {
  ok: boolean
  provider: 'mock' | 'twenty' | 'custom'
  message?: string
}

export type IaMujeresCrmRepository = {
  listCampaignOpportunities(params: {
    campaignKey: string
  }): Promise<RawIaMujeresOpportunity[]>

  listCampaignTasks(params: {
    campaignKey: string
  }): Promise<RawIaMujeresTask[]>

  listCampaignCompanies?(params: {
    campaignKey: string
  }): Promise<RawIaMujeresCompany[]>

  listCampaignPeople?(params: {
    campaignKey: string
  }): Promise<RawIaMujeresPerson[]>

  getHealth?(): Promise<CrmHealthStatus>
}

export type SnapshotBackedRepository = IaMujeresCrmRepository & {
  getSnapshot(): Promise<IaMujeresDashboardSnapshot>
}
