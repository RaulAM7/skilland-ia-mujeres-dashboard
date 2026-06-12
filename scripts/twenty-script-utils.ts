import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  createTwentyClient,
  redactSensitiveText,
  sanitizeTwentyPayload,
  type TwentyApiMode,
  type TwentyClient,
} from '../server/crm/twenty-client'

export type TwentyScriptEnv =
  | {
      ok: true
      client: TwentyClient
      baseUrl: string
      apiMode: TwentyApiMode
      apiKey: string
      campaignKey: string
    }
  | {
      ok: false
      missing: string[]
      campaignKey: string
    }

export const CRM_SCHEMA_SCRATCH_DIR = '05_scratch/crm-schema'
export const DATA_CONTRACT_OUTPUT_DIR = '04_outputs/data_contract'

export function loadTwentyScriptEnv(env: NodeJS.ProcessEnv = process.env): TwentyScriptEnv {
  const baseUrl = env.CRM_BASE_URL?.trim()
  const apiKey = env.CRM_API_KEY?.trim()
  const apiMode = env.CRM_API_MODE === 'rest' ? 'rest' : 'graphql'
  const campaignKey = env.CRM_CAMPAIGN_KEY?.trim() || 'ia-mujeres'
  const requiredEnv: Array<[string, string | undefined]> = [
    ['CRM_BASE_URL', baseUrl],
    ['CRM_API_KEY', apiKey],
  ]
  const missing = requiredEnv
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (!baseUrl || !apiKey || missing.length > 0) {
    return {
      ok: false,
      missing,
      campaignKey,
    }
  }

  return {
    ok: true,
    client: createTwentyClient({
      baseUrl,
      apiKey,
      apiMode,
    }),
    baseUrl,
    apiMode,
    apiKey,
    campaignKey,
  }
}

export async function writeJsonOutput(relativePath: string, payload: unknown, secrets: string[] = []) {
  await mkdir(path.dirname(relativePath), { recursive: true })
  await writeFile(relativePath, `${JSON.stringify(sanitizeTwentyPayload(payload, secrets), null, 2)}\n`, 'utf8')
}

export async function writeMarkdownOutput(relativePath: string, markdown: string) {
  await mkdir(path.dirname(relativePath), { recursive: true })
  await writeFile(relativePath, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8')
}

export function safeErrorMessage(error: unknown, secrets: string[] = []) {
  const message = error instanceof Error ? error.message : 'Unknown Twenty script error.'
  return redactSensitiveText(message, secrets)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord)
  return []
}

export function extractRestRecords(payload: unknown, objectName: string): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter(isRecord)
  if (!isRecord(payload)) return []

  const data = payload.data
  if (Array.isArray(data)) return data.filter(isRecord)
  if (isRecord(data)) {
    const nested = extractRecordsFromRecord(data, objectName)
    if (nested.length > 0) return nested
  }

  return extractRecordsFromRecord(payload, objectName)
}

export function uniqueStrings(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

function extractRecordsFromRecord(record: Record<string, unknown>, objectName: string): Record<string, unknown>[] {
  for (const candidate of [objectName, singularize(objectName), 'items', 'records', 'nodes']) {
    const value = record[candidate]
    if (Array.isArray(value)) return value.filter(isRecord)
    if (isRecord(value) && Array.isArray(value.nodes)) return value.nodes.filter(isRecord)
    if (isRecord(value) && Array.isArray(value.edges)) {
      return value.edges
        .filter(isRecord)
        .map((edge) => edge.node)
        .filter(isRecord)
    }
  }
  return []
}

function singularize(value: string) {
  return value.endsWith('ies') ? `${value.slice(0, -3)}y` : value.replace(/s$/, '')
}
