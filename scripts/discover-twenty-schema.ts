import {
  CRM_SCHEMA_SCRATCH_DIR,
  DATA_CONTRACT_OUTPUT_DIR,
  asRecordArray,
  isRecord,
  loadTwentyScriptEnv,
  safeErrorMessage,
  uniqueStrings,
  writeJsonOutput,
  writeMarkdownOutput,
} from './twenty-script-utils'

const RAW_OUTPUT = `${CRM_SCHEMA_SCRATCH_DIR}/twenty_schema_discovery.raw.redacted.json`
const SUMMARY_OUTPUT = `${DATA_CONTRACT_OUTPUT_DIR}/2026-06-12_twenty_schema_discovery_summary.md`

const INTROSPECTION_QUERY = `
query TwentySchemaDiscovery {
  __schema {
    queryType {
      fields {
        name
        args { name }
        type { kind name ofType { kind name ofType { kind name } } }
      }
    }
    mutationType {
      fields { name }
    }
    types {
      kind
      name
      fields {
        name
        type { kind name ofType { kind name ofType { kind name } } }
      }
    }
  }
}
`

async function main() {
  const env = loadTwentyScriptEnv()
  const generatedAt = new Date().toISOString()

  if (!env.ok) {
    const payload = {
      status: 'skipped',
      generatedAt,
      reason: 'Missing required server-side CRM env vars.',
      missingEnv: env.missing,
    }
    await writeJsonOutput(RAW_OUTPUT, payload)
    await writeMarkdownOutput(SUMMARY_OUTPUT, renderSkippedSummary(generatedAt, env.missing))
    console.log(`SKIPPED Twenty schema discovery: missing ${env.missing.join(', ')}.`)
    return
  }

  try {
    const payload = await env.client.graphql<unknown>(INTROSPECTION_QUERY)
    await writeJsonOutput(RAW_OUTPUT, payload, [env.apiKey])
    await writeMarkdownOutput(SUMMARY_OUTPUT, renderDiscoverySummary(generatedAt, payload))
    console.log(`Twenty schema discovery summary written to ${SUMMARY_OUTPUT}.`)
  } catch (error) {
    const message = safeErrorMessage(error, [env.apiKey])
    await writeJsonOutput(RAW_OUTPUT, {
      status: 'failed',
      generatedAt,
      message,
    })
    await writeMarkdownOutput(SUMMARY_OUTPUT, renderFailedSummary(generatedAt, message))
    console.error(`Twenty schema discovery failed: ${message}`)
    process.exitCode = 1
  }
}

function renderSkippedSummary(generatedAt: string, missing: string[]) {
  return `# Twenty Schema Discovery Summary

Generated at: ${generatedAt}

Status: skipped

Reason: Missing required server-side CRM environment variables.

Missing:
${missing.map((name) => `- ${name}`).join('\n')}

No CRM request was made and no secrets were read.
`
}

function renderFailedSummary(generatedAt: string, message: string) {
  return `# Twenty Schema Discovery Summary

Generated at: ${generatedAt}

Status: failed

Safe error:

\`\`\`text
${message}
\`\`\`

No write-back was attempted.
`
}

function renderDiscoverySummary(generatedAt: string, payload: unknown) {
  const schema = isRecord(payload) && isRecord(payload.data) && isRecord(payload.data.__schema) ? payload.data.__schema : {}
  const queryFields = isRecord(schema.queryType) ? asRecordArray(schema.queryType.fields) : []
  const mutationFields = isRecord(schema.mutationType) ? asRecordArray(schema.mutationType.fields) : []
  const types = asRecordArray(schema.types)

  const relevantQueryFields = uniqueStrings(
    queryFields
      .map((field) => (typeof field.name === 'string' ? field.name : undefined))
      .filter((name): name is string => Boolean(name && isRelevantName(name))),
  )
  const relevantTypes = types
    .filter((type) => typeof type.name === 'string' && isRelevantName(type.name))
    .map((type) => ({
      name: String(type.name),
      kind: typeof type.kind === 'string' ? type.kind : 'unknown',
      fields: asRecordArray(type.fields)
        .map((field) => (typeof field.name === 'string' ? field.name : undefined))
        .filter((name): name is string => Boolean(name))
        .slice(0, 40),
    }))

  return `# Twenty Schema Discovery Summary

Generated at: ${generatedAt}

Status: available

## Counts

- Query fields discovered: ${queryFields.length}
- Mutation fields discovered: ${mutationFields.length}
- Types discovered: ${types.length}

## Relevant Query Fields

${relevantQueryFields.length ? relevantQueryFields.map((name) => `- ${name}`).join('\n') : '- None matched IA Mujeres candidates.'}

## Relevant Types

${relevantTypes
  .map(
    (type) => `### ${type.name}

- Kind: ${type.kind}
- Fields: ${type.fields.length ? type.fields.join(', ') : 'none listed'}`,
  )
  .join('\n\n') || 'No relevant types matched IA Mujeres candidates.'}

## Notes

- This file is schema metadata only; no records should be present.
- Raw redacted output path: \`${RAW_OUTPUT}\`.
- Runtime mapping is still unverified until \`pnpm crm:probe\` confirms campaign filtering and field availability.
`
}

function isRelevantName(name: string) {
  return /(ia|mujeres|opportunit|task|compan|people|person|campaign|funnel|outreach)/i.test(name)
}

void main()
