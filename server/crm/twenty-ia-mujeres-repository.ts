import type {
  CrmHealthStatus,
  IaMujeresCrmRepository,
  RawIaMujeresCompany,
  RawIaMujeresOpportunity,
  RawIaMujeresPerson,
  RawIaMujeresTask,
} from './ia-mujeres-crm-repository'
import {
  createTwentyClient,
  redactSensitiveText,
  type TwentyApiMode,
  type TwentyClient,
  TwentyClientError,
} from './twenty-client'
import { DEFAULT_TWENTY_IA_MUJERES_MAPPING, type TwentyIaMujeresMapping } from './twenty-ia-mujeres-mapping'

export const CRM_STUB_MESSAGE =
  'Twenty CRM mode requires CRM_BASE_URL, CRM_API_KEY and runtime schema verification before real IA Mujeres metrics can be trusted.'

const DEFAULT_RECORD_LIMIT = 60

type TwentyRepositoryOptions = {
  client?: TwentyClient
  mapping?: TwentyIaMujeresMapping
  configError?: string
  limit?: number
}

type TwentyRecord = Record<string, unknown>

export class TwentyIaMujeresRepository implements IaMujeresCrmRepository {
  private readonly client?: TwentyClient
  private readonly mapping: TwentyIaMujeresMapping
  private readonly configError?: string
  private readonly limit: number

  constructor(options: TwentyRepositoryOptions = {}) {
    this.client = options.client
    this.mapping = options.mapping ?? DEFAULT_TWENTY_IA_MUJERES_MAPPING
    this.configError = options.configError
    this.limit = options.limit ?? DEFAULT_RECORD_LIMIT
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env) {
    const baseUrl = env.CRM_BASE_URL?.trim()
    const apiKey = env.CRM_API_KEY?.trim()
    const apiMode = parseApiMode(env.CRM_API_MODE)

    if (!baseUrl || !apiKey) {
      return new TwentyIaMujeresRepository({
        configError: 'Missing server-side CRM configuration. Set CRM_BASE_URL and CRM_API_KEY outside git.',
      })
    }

    try {
      return new TwentyIaMujeresRepository({
        client: createTwentyClient({
          baseUrl,
          apiKey,
          apiMode,
        }),
      })
    } catch (error) {
      return new TwentyIaMujeresRepository({
        configError: safeErrorMessage(error, apiKey),
      })
    }
  }

  async listCampaignOpportunities(params: { campaignKey: string }): Promise<RawIaMujeresOpportunity[]> {
    const records = await this.listCampaignRecords(this.mapping.opportunityObjectName, params.campaignKey)
    return records.map((record, index) => ({
      id: readString(record, ['id', 'recordId']) ?? `twenty-opportunity-${index + 1}`,
      name:
        readString(record, ['name', 'title']) ??
        readRelatedName(record, this.mapping.companyRelationCandidates) ??
        'Oportunidad sin nombre',
      companyName: readRelatedName(record, this.mapping.companyRelationCandidates),
      iaMujeresFunnelStage: readString(record, this.mapping.stageFieldCandidates),
      outreachStatus: readString(record, this.mapping.outreachStatusFieldCandidates),
      firstEmailSentAt: readString(record, this.mapping.firstEmailSentAtFieldCandidates),
      lastEmailSentAt: readString(record, this.mapping.lastEmailSentAtFieldCandidates),
      lastReplyAt: readString(record, this.mapping.lastReplyAtFieldCandidates),
      followUpDueAt: readString(record, this.mapping.followupDueAtFieldCandidates),
      lastEmailEventAt: readString(record, this.mapping.lastEmailEventAtFieldCandidates),
      lastEmailEventType:
        readString(record, this.mapping.lastEmailEventTypeFieldCandidates) ??
        (readString(record, this.mapping.lastBounceAtFieldCandidates) ? 'bounce' : undefined),
      activeBatchId: readString(record, this.mapping.activeBatchIdFieldCandidates),
      needsManualReview: readBoolean(record, this.mapping.manualReviewFieldCandidates),
      duplicatePossible: readBoolean(record, this.mapping.duplicatePossibleFieldCandidates),
      genericEmail: readBoolean(record, this.mapping.genericEmailFieldCandidates),
      manualReviewReason: readString(record, this.mapping.manualReviewReasonFieldCandidates),
      owner: readRelatedName(record, this.mapping.ownerFieldCandidates) ?? readString(record, this.mapping.ownerFieldCandidates),
    }))
  }

  async listCampaignTasks(params: { campaignKey: string }): Promise<RawIaMujeresTask[]> {
    const records = await this.listCampaignRecords(this.mapping.taskObjectName, params.campaignKey)
    return records.map((record, index) => ({
      id: readString(record, ['id', 'recordId']) ?? `twenty-task-${index + 1}`,
      title: readString(record, this.mapping.taskTitleFieldCandidates) ?? 'Tarea sin titulo',
      status: readString(record, this.mapping.taskStatusFieldCandidates) ?? 'open',
      dueAt: readString(record, this.mapping.taskDueAtFieldCandidates),
      owner:
        readRelatedName(record, this.mapping.taskOwnerFieldCandidates) ?? readString(record, this.mapping.taskOwnerFieldCandidates),
      category: normalizeTaskCategory(readString(record, this.mapping.taskCategoryFieldCandidates)),
    }))
  }

  async listCampaignCompanies(params: { campaignKey: string }): Promise<RawIaMujeresCompany[]> {
    const records = await this.listOptionalCampaignRecords(this.mapping.companyObjectName, params.campaignKey)
    return records.map((record, index) => ({
      id: readString(record, ['id', 'recordId']) ?? `twenty-company-${index + 1}`,
      name: readString(record, ['name', 'displayName']) ?? `Empresa ${index + 1}`,
    }))
  }

  async listCampaignPeople(params: { campaignKey: string }): Promise<RawIaMujeresPerson[]> {
    const records = await this.listOptionalCampaignRecords(this.mapping.personObjectName, params.campaignKey)
    return records.map((record, index) => ({
      id: readString(record, ['id', 'recordId']) ?? `twenty-person-${index + 1}`,
      name: readString(record, ['name', 'displayName', 'firstName']) ?? undefined,
    }))
  }

  async getHealth(): Promise<CrmHealthStatus> {
    if (this.configError) {
      return {
        ok: false,
        provider: 'twenty',
        message: this.configError,
      }
    }

    try {
      await this.requireClient().health()
      return {
        ok: true,
        provider: 'twenty',
        message: 'Twenty CRM is reachable in read-only mode.',
      }
    } catch (error) {
      return {
        ok: false,
        provider: 'twenty',
        message: safeErrorMessage(error),
      }
    }
  }

  isConfigured() {
    return !this.configError && Boolean(this.client)
  }

  private async listCampaignRecords(objectName: string, campaignKey: string) {
    const records = await this.listObjectRecords(objectName)
    if (records.length === 0) return []

    const filtered = filterByCampaign(records, campaignKey, this.mapping.campaignFieldCandidates)
    if (filtered === null) {
      throw new Error(
        `Twenty object "${objectName}" does not expose a recognized campaign field. Run pnpm crm:probe before enabling real dashboard data.`,
      )
    }

    return filtered
  }

  private async listOptionalCampaignRecords(objectName: string, campaignKey: string) {
    const records = await this.listObjectRecords(objectName)
    if (records.length === 0) return []
    return filterByCampaign(records, campaignKey, this.mapping.campaignFieldCandidates) ?? []
  }

  private async listObjectRecords(objectName: string) {
    const client = this.requireClient()
    const payload = await client.rest<unknown>(`${objectName}?limit=${this.limit}`)
    return extractRecords(payload, objectName)
  }

  private requireClient() {
    if (this.configError) {
      throw new Error(this.configError)
    }
    if (!this.client) {
      throw new Error(CRM_STUB_MESSAGE)
    }
    return this.client
  }
}

function parseApiMode(value: string | undefined): TwentyApiMode {
  return value === 'rest' ? 'rest' : 'graphql'
}

function filterByCampaign(records: TwentyRecord[], campaignKey: string, candidates: string[]) {
  let sawCampaignField = false
  const filtered = records.filter((record) => {
    const value = readValue(record, candidates)
    if (value === undefined) return false
    sawCampaignField = true
    return matchesCampaign(value, campaignKey)
  })

  if (!sawCampaignField) return null
  return filtered
}

function matchesCampaign(value: unknown, campaignKey: string): boolean {
  if (typeof value === 'string') return value === campaignKey
  if (Array.isArray(value)) return value.some((item) => matchesCampaign(item, campaignKey))
  if (isRecord(value)) {
    return ['key', 'slug', 'name', 'id'].some((field) => matchesCampaign(value[field], campaignKey))
  }
  return false
}

function extractRecords(payload: unknown, objectName: string): TwentyRecord[] {
  if (Array.isArray(payload)) return payload.filter(isRecord)
  if (!isRecord(payload)) return []

  const data = payload.data
  if (Array.isArray(data)) return data.filter(isRecord)
  if (isRecord(data)) {
    const fromDataObject = extractRecordsFromRecord(data, objectName)
    if (fromDataObject.length > 0) return fromDataObject
  }

  return extractRecordsFromRecord(payload, objectName)
}

function extractRecordsFromRecord(record: TwentyRecord, objectName: string): TwentyRecord[] {
  const candidates = [objectName, singularize(objectName), 'items', 'records', 'nodes']
  for (const candidate of candidates) {
    const value = record[candidate]
    if (Array.isArray(value)) return value.filter(isRecord)
    const nodes = extractNodes(value)
    if (nodes.length > 0) return nodes
  }
  return []
}

function extractNodes(value: unknown): TwentyRecord[] {
  if (!isRecord(value)) return []
  if (Array.isArray(value.nodes)) return value.nodes.filter(isRecord)
  if (Array.isArray(value.edges)) {
    return value.edges
      .filter(isRecord)
      .map((edge) => edge.node)
      .filter(isRecord)
  }
  return []
}

function readString(record: TwentyRecord, candidates: string[]) {
  const value = readValue(record, candidates)
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

function readBoolean(record: TwentyRecord, candidates: string[]) {
  const value = readValue(record, candidates)
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return undefined
}

function readRelatedName(record: TwentyRecord, candidates: string[]) {
  const value = readValue(record, candidates)
  if (typeof value === 'string') return value
  if (!isRecord(value)) return undefined
  return readString(value, ['name', 'displayName', 'title', 'email'])
}

function readValue(record: TwentyRecord, candidates: string[]): unknown {
  for (const candidate of candidates) {
    if (candidate in record) return record[candidate]
  }
  return undefined
}

function normalizeTaskCategory(value: string | undefined): RawIaMujeresTask['category'] {
  if (!value) return undefined
  const normalized = value.toLowerCase()
  if (normalized.includes('follow')) return 'followup'
  if (normalized.includes('manual') || normalized.includes('review')) return 'manual_review'
  if (normalized.includes('meeting') || normalized.includes('reunion')) return 'meeting'
  if (normalized.includes('quality') || normalized.includes('data')) return 'data_quality'
  return 'other'
}

function singularize(value: string) {
  return value.endsWith('ies') ? `${value.slice(0, -3)}y` : value.replace(/s$/, '')
}

function isRecord(value: unknown): value is TwentyRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function safeErrorMessage(error: unknown, secret?: string) {
  const message = error instanceof Error ? error.message : 'Unknown Twenty CRM error.'
  if (error instanceof TwentyClientError) return redactSensitiveText(message, secret ? [secret] : [])
  return redactSensitiveText(message, secret ? [secret] : [])
}
