import { buildIaMujeresSnapshot, createErrorSnapshot } from '../ia-mujeres/build-snapshot'
import { MockIaMujeresRepository } from '../crm/mock-ia-mujeres-repository'
import { CRM_STUB_MESSAGE, TwentyIaMujeresRepository } from '../crm/twenty-ia-mujeres-repository'

export type ApiResponse = {
  status: number
  body: unknown
  headers?: Record<string, string>
}

export async function getSnapshotResponse(env: NodeJS.ProcessEnv = process.env): Promise<ApiResponse> {
  const dataMode = env.DASHBOARD_DATA_MODE ?? 'mock'
  const campaignKey = 'ia-mujeres'

  try {
    if (dataMode === 'crm') {
      await new TwentyIaMujeresRepository().getHealth()
      throw new Error(CRM_STUB_MESSAGE)
    }

    const snapshot = await buildIaMujeresSnapshot({
      repository: new MockIaMujeresRepository(),
      campaignKey,
    })

    return {
      status: 200,
      body: snapshot,
      headers: {
        'cache-control': 'no-store',
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown snapshot error'
    return {
      status: dataMode === 'crm' ? 501 : 500,
      body: createErrorSnapshot({
        campaignKey,
        message,
        provider: dataMode === 'crm' ? 'twenty' : 'mock',
      }),
      headers: {
        'cache-control': 'no-store',
      },
    }
  }
}

export async function getRefreshResponse(params: {
  method: 'GET' | 'POST'
  headers: Record<string, string | string[] | undefined>
  env?: NodeJS.ProcessEnv
}): Promise<ApiResponse> {
  const env = params.env ?? process.env
  const expectedSecret = params.method === 'GET' ? env.CRON_SECRET : env.DASHBOARD_REFRESH_SECRET
  const providedSecret = getProvidedSecret(params.headers)

  if (!expectedSecret) {
    return {
      status: 503,
      body: {
        status: 'error',
        code: 'REFRESH_SECRET_NOT_CONFIGURED',
        message: `${params.method} refresh is not configured because its server-side secret is missing.`,
      },
    }
  }

  if (providedSecret !== expectedSecret) {
    return {
      status: 401,
      body: {
        status: 'error',
        code: 'UNAUTHORIZED_REFRESH',
        message: 'Refresh endpoint requires a valid server-side secret.',
      },
    }
  }

  return {
    status: 202,
    body: {
      status: 'accepted',
      message: 'Persistent refresh/cache is not implemented in the mock MVP. Snapshot is generated on demand.',
    },
  }
}

function getProvidedSecret(headers: Record<string, string | string[] | undefined>) {
  const authHeader = readHeader(headers, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }

  return (
    readHeader(headers, 'x-cron-secret') ??
    readHeader(headers, 'x-dashboard-refresh-secret') ??
    readHeader(headers, 'x-refresh-secret')
  )
}

function readHeader(headers: Record<string, string | string[] | undefined>, key: string) {
  const value = headers[key] ?? headers[key.toLowerCase()]
  if (Array.isArray(value)) return value[0]
  return value
}
