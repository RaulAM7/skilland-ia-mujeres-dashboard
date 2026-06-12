export type TwentyIaMujeresMapping = {
  opportunityObjectName: string
  taskObjectName: string
  companyObjectName: string
  personObjectName: string
  campaignFieldCandidates: string[]
  stageFieldCandidates: string[]
  outreachStatusFieldCandidates: string[]
  firstEmailSentAtFieldCandidates: string[]
  lastEmailSentAtFieldCandidates: string[]
  lastReplyAtFieldCandidates: string[]
  lastBounceAtFieldCandidates: string[]
  followupDueAtFieldCandidates: string[]
  lastEmailEventAtFieldCandidates: string[]
  lastEmailEventTypeFieldCandidates: string[]
  manualReviewFieldCandidates: string[]
  manualReviewReasonFieldCandidates: string[]
  duplicatePossibleFieldCandidates: string[]
  genericEmailFieldCandidates: string[]
  activeBatchIdFieldCandidates: string[]
  ownerFieldCandidates: string[]
  companyRelationCandidates: string[]
  personRelationCandidates: string[]
  taskTitleFieldCandidates: string[]
  taskStatusFieldCandidates: string[]
  taskDueAtFieldCandidates: string[]
  taskOwnerFieldCandidates: string[]
  taskCategoryFieldCandidates: string[]
}

export const DEFAULT_TWENTY_IA_MUJERES_MAPPING: TwentyIaMujeresMapping = {
  opportunityObjectName: 'opportunities',
  taskObjectName: 'tasks',
  companyObjectName: 'companies',
  personObjectName: 'people',
  campaignFieldCandidates: ['iaMujeresCampaign', 'campaignKey', 'campaign', 'campaignName', 'activeCampaignId'],
  stageFieldCandidates: ['iaMujeresFunnelStage', 'commercialStage', 'stage', 'stageName'],
  outreachStatusFieldCandidates: ['outreachStatus', 'emailOutreachStatus', 'status'],
  firstEmailSentAtFieldCandidates: ['firstEmailSentAt', 'email1SentAt', 'sentAt'],
  lastEmailSentAtFieldCandidates: ['lastEmailSentAt', 'lastSentAt'],
  lastReplyAtFieldCandidates: ['lastReplyAt', 'replyDetectedAt'],
  lastBounceAtFieldCandidates: ['lastBounceAt', 'bounceDetectedAt'],
  followupDueAtFieldCandidates: ['followUpDueAt', 'followupDueAt', 'nextFollowUpAt'],
  lastEmailEventAtFieldCandidates: ['lastEmailEventAt'],
  lastEmailEventTypeFieldCandidates: ['lastEmailEventType'],
  manualReviewFieldCandidates: ['needsManualReview', 'manualReview', 'requiresManualReview'],
  manualReviewReasonFieldCandidates: ['manualReviewReason', 'reviewReason'],
  duplicatePossibleFieldCandidates: ['duplicatePossible'],
  genericEmailFieldCandidates: ['genericEmail'],
  activeBatchIdFieldCandidates: ['activeBatchId', 'lastBatchId'],
  ownerFieldCandidates: ['owner', 'assignee', 'assignedTo'],
  companyRelationCandidates: ['company', 'companyId', 'organization', 'account'],
  personRelationCandidates: ['person', 'personId', 'contact', 'primaryContact'],
  taskTitleFieldCandidates: ['title', 'name', 'body'],
  taskStatusFieldCandidates: ['status', 'taskStatus'],
  taskDueAtFieldCandidates: ['dueAt', 'dueDate', 'followUpDueAt', 'followupDueAt'],
  taskOwnerFieldCandidates: ['owner', 'assignee', 'assignedTo'],
  taskCategoryFieldCandidates: ['category', 'type', 'taskType'],
}

export const TWENTY_MAPPING_RUNTIME_STATUS = {
  status: 'runtime-unverified',
  note: 'Defaults come from IA Mujeres source docs and must be checked with pnpm crm:discover and pnpm crm:probe before trusting CRM mode metrics.',
} as const
