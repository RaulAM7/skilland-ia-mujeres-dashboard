import { DEFAULT_TWENTY_IA_MUJERES_MAPPING } from '../server/crm/twenty-ia-mujeres-mapping'
import {
  CRM_SCHEMA_SCRATCH_DIR,
  DATA_CONTRACT_OUTPUT_DIR,
  extractRestRecords,
  loadTwentyScriptEnv,
  safeErrorMessage,
  uniqueStrings,
  writeJsonOutput,
  writeMarkdownOutput,
} from './twenty-script-utils'

const RAW_OUTPUT = `${CRM_SCHEMA_SCRATCH_DIR}/ia_mujeres_probe.raw.redacted.json`
const SUMMARY_OUTPUT = `${DATA_CONTRACT_OUTPUT_DIR}/2026-06-12_ia_mujeres_crm_probe_summary.md`
const PROBE_LIMIT = 5

type ObjectProbeResult = {
  objectName: string
  status: 'ok' | 'failed'
  recordCount: number
  fields: string[]
  campaignFieldsFound: string[]
  snapshotCandidateFieldsFound: string[]
  message?: string
}

async function main() {
  const env = loadTwentyScriptEnv()
  const generatedAt = new Date().toISOString()

  if (!env.ok) {
    const payload = {
      status: 'skipped',
      generatedAt,
      reason: 'Missing required server-side CRM env vars.',
      missingEnv: env.missing,
      campaignKey: env.campaignKey,
    }
    await writeJsonOutput(RAW_OUTPUT, payload)
    await writeMarkdownOutput(SUMMARY_OUTPUT, renderSkippedSummary(env.missing))
    console.log(`SKIPPED IA Mujeres CRM probe: missing ${env.missing.join(', ')}.`)
    return
  }

  const objects = [
    DEFAULT_TWENTY_IA_MUJERES_MAPPING.opportunityObjectName,
    DEFAULT_TWENTY_IA_MUJERES_MAPPING.taskObjectName,
    DEFAULT_TWENTY_IA_MUJERES_MAPPING.companyObjectName,
    DEFAULT_TWENTY_IA_MUJERES_MAPPING.personObjectName,
  ]
  const rawPayloads: Record<string, unknown> = {}
  const results: ObjectProbeResult[] = []

  for (const objectName of objects) {
    try {
      const payload = await env.client.rest<unknown>(`${objectName}?limit=${PROBE_LIMIT}`)
      rawPayloads[objectName] = payload
      const records = extractRestRecords(payload, objectName)
      const fields = uniqueStrings(records.flatMap((record) => Object.keys(record)))
      results.push({
        objectName,
        status: 'ok',
        recordCount: records.length,
        fields,
        campaignFieldsFound: fields.filter((field) =>
          DEFAULT_TWENTY_IA_MUJERES_MAPPING.campaignFieldCandidates.includes(field),
        ),
        snapshotCandidateFieldsFound: fields.filter((field) => allSnapshotCandidateFields().includes(field)),
      })
    } catch (error) {
      results.push({
        objectName,
        status: 'failed',
        recordCount: 0,
        fields: [],
        campaignFieldsFound: [],
        snapshotCandidateFieldsFound: [],
        message: safeErrorMessage(error, [env.apiKey]),
      })
    }
  }

  await writeJsonOutput(
    RAW_OUTPUT,
    {
      status: 'completed',
      generatedAt,
      campaignKey: env.campaignKey,
      results,
      rawPayloads,
    },
    [env.apiKey],
  )
  await writeMarkdownOutput(SUMMARY_OUTPUT, renderProbeSummary(generatedAt, env.campaignKey, results))
  console.log(`IA Mujeres CRM probe summary written to ${SUMMARY_OUTPUT}.`)
}

function renderSkippedSummary(missing: string[]) {
  return `# IA Mujeres CRM Probe Summary

Status: skipped

Reason: Missing required server-side CRM environment variables.

Missing:
${missing.map((name) => `- ${name}`).join('\n')}

No CRM request was made and no secrets were read.
`
}

function renderProbeSummary(generatedAt: string, campaignKey: string, results: ObjectProbeResult[]) {
  return `# IA Mujeres CRM Probe Summary

Generated at: ${generatedAt}

Status: completed

Campaign key tested: \`${campaignKey}\`

Raw redacted output path: \`${RAW_OUTPUT}\`

| Object | Status | Records sampled | Campaign fields found | Snapshot candidate fields found | Notes |
|---|---|---:|---|---|---|
${results
  .map(
    (result) =>
      `| \`${result.objectName}\` | ${result.status} | ${result.recordCount} | ${formatList(
        result.campaignFieldsFound,
      )} | ${formatList(result.snapshotCandidateFieldsFound)} | ${result.message ?? 'Read-only sample only'} |`,
  )
  .join('\n')}

## Interpretation

- If no campaign field is found on opportunities/tasks, the live adapter must stay disabled for real dashboard data.
- A successful probe does not imply write-back permission; this phase remains read-only.
- Do not commit or share raw record payloads beyond the redacted scratch output.
`
}

function allSnapshotCandidateFields() {
  return uniqueStrings(
    [
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.stageFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.outreachStatusFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.firstEmailSentAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastEmailSentAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastReplyAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastBounceAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.followupDueAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastEmailEventAtFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastEmailEventTypeFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.manualReviewFieldCandidates,
      DEFAULT_TWENTY_IA_MUJERES_MAPPING.ownerFieldCandidates,
    ].flat(),
  )
}

function formatList(values: string[]) {
  return values.length ? values.map((value) => `\`${value}\``).join(', ') : 'none'
}

void main()
