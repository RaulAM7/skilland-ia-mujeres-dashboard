export type TwentyApiMode = 'graphql' | 'rest'

export type TwentyClientConfig = {
  baseUrl: string
  apiKey: string
  apiMode?: TwentyApiMode
  timeoutMs?: number
  fetchImpl?: FetchLike
}

export type TwentyHealthResult = {
  ok: boolean
  apiMode: TwentyApiMode
  baseUrl: string
  graphqlUrl: string
  restBaseUrl: string
  message?: string
}

export type TwentyClient = {
  graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T>
  rest<T>(path: string, init?: RequestInit): Promise<T>
  health(): Promise<TwentyHealthResult>
}

export type TwentyClientErrorCode =
  | 'INVALID_CONFIG'
  | 'HTTP_ERROR'
  | 'GRAPHQL_ERROR'
  | 'TIMEOUT'
  | 'UNSAFE_OPERATION'
  | 'INVALID_RESPONSE'

export class TwentyClientError extends Error {
  readonly code: TwentyClientErrorCode
  readonly status?: number

  constructor(code: TwentyClientErrorCode, message: string, status?: number) {
    super(message)
    this.name = 'TwentyClientError'
    this.code = code
    this.status = status
  }
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

const DEFAULT_TIMEOUT_MS = 10_000
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const SENSITIVE_KEY_PATTERN = /(api[_-]?key|token|secret|password|authorization|cookie|email)/i

export function createTwentyClient(config: TwentyClientConfig): TwentyClient {
  const normalized = normalizeConfig(config)

  async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), normalized.timeoutMs)

    try {
      const response = await normalized.fetchImpl(url, {
        ...init,
        signal: controller.signal,
      })
      const text = await response.text()
      const payload = parseJson(text)

      if (!response.ok) {
        throw new TwentyClientError(
          'HTTP_ERROR',
          redactSensitiveText(`Twenty API returned ${response.status}: ${safeJsonStringify(payload)}`, [
            normalized.apiKey,
          ]),
          response.status,
        )
      }

      return payload as T
    } catch (error) {
      if (error instanceof TwentyClientError) throw error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TwentyClientError('TIMEOUT', `Twenty API request timed out after ${normalized.timeoutMs}ms.`)
      }
      throw new TwentyClientError(
        'HTTP_ERROR',
        redactSensitiveText(error instanceof Error ? error.message : 'Unknown Twenty API error.', [normalized.apiKey]),
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    async graphql<T>(query: string, variables: Record<string, unknown> = {}) {
      assertSafeGraphqlQuery(query)

      const payload = await requestJson<{
        data?: unknown
        errors?: unknown
      }>(normalized.graphqlUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${normalized.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })

      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        throw new TwentyClientError(
          'GRAPHQL_ERROR',
          redactSensitiveText(`Twenty GraphQL error: ${safeJsonStringify(payload.errors)}`, [normalized.apiKey]),
        )
      }

      return payload as T
    },

    async rest<T>(path: string, init: RequestInit = {}) {
      const method = (init.method ?? 'GET').toUpperCase()
      if (method !== 'GET' && method !== 'HEAD') {
        throw new TwentyClientError('UNSAFE_OPERATION', `Twenty REST ${method} requests are disabled in read-only mode.`)
      }

      return requestJson<T>(buildRestUrl(normalized.restBaseUrl, path), {
        ...init,
        method,
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${normalized.apiKey}`,
        },
      })
    },

    async health() {
      await this.graphql<{ data?: { __typename?: string } }>('query TwentyHealth { __typename }')
      return {
        ok: true,
        apiMode: normalized.apiMode,
        baseUrl: normalized.baseUrl,
        graphqlUrl: normalized.graphqlUrl,
        restBaseUrl: normalized.restBaseUrl,
        message: 'Twenty API is reachable with the configured server-side credentials.',
      }
    },
  }
}

export function redactSensitiveText(text: string, secrets: string[] = []) {
  let redacted = text.replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer [REDACTED]')

  for (const secret of secrets) {
    if (!secret) continue
    redacted = redacted.split(secret).join('[REDACTED]')
  }

  return redacted.replace(EMAIL_PATTERN, '[REDACTED_EMAIL]')
}

export function sanitizeTwentyPayload(value: unknown, secrets: string[] = [], depth = 0): unknown {
  if (depth > 8) return '[MAX_DEPTH_REDACTED]'

  if (typeof value === 'string') {
    return redactSensitiveText(value, secrets)
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeTwentyPayload(item, secrets, depth + 1))
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [key, nestedValue] of Object.entries(value)) {
      sanitized[key] = SENSITIVE_KEY_PATTERN.test(key)
        ? '[REDACTED]'
        : sanitizeTwentyPayload(nestedValue, secrets, depth + 1)
    }
    return sanitized
  }

  return value
}

function normalizeConfig(config: TwentyClientConfig) {
  if (!config.baseUrl?.trim()) {
    throw new TwentyClientError('INVALID_CONFIG', 'CRM_BASE_URL is required for Twenty CRM mode.')
  }
  if (!config.apiKey?.trim()) {
    throw new TwentyClientError('INVALID_CONFIG', 'CRM_API_KEY is required for Twenty CRM mode.')
  }

  const baseUrl = normalizeBaseUrl(config.baseUrl)
  return {
    baseUrl,
    apiKey: config.apiKey.trim(),
    apiMode: config.apiMode ?? 'graphql',
    timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchImpl: config.fetchImpl ?? fetch,
    graphqlUrl: buildPathUrl(baseUrl, 'graphql'),
    restBaseUrl: buildPathUrl(baseUrl, 'rest'),
  }
}

function normalizeBaseUrl(value: string) {
  try {
    const parsed = new URL(value.trim())
    parsed.pathname = parsed.pathname.replace(/\/+$/, '')
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString().replace(/\/$/, '')
  } catch {
    throw new TwentyClientError('INVALID_CONFIG', 'CRM_BASE_URL must be a valid absolute URL.')
  }
}

function buildPathUrl(baseUrl: string, path: string) {
  const base = new URL(`${baseUrl}/`)
  const cleanPath = path.replace(/^\/+/, '')
  base.pathname = `${base.pathname.replace(/\/+$/, '')}/${cleanPath}`
  return base.toString().replace(/\/$/, '')
}

function buildRestUrl(restBaseUrl: string, path: string) {
  const cleanPath = path.replace(/^\/+/, '')
  if (cleanPath.startsWith('rest/')) {
    return buildPathUrl(restBaseUrl.replace(/\/rest$/, ''), cleanPath)
  }
  return buildPathUrl(restBaseUrl, cleanPath)
}

function assertSafeGraphqlQuery(query: string) {
  if (/\bmutation\b/i.test(stripGraphqlComments(query))) {
    throw new TwentyClientError('UNSAFE_OPERATION', 'Twenty GraphQL mutations are disabled in read-only mode.')
  }
}

function stripGraphqlComments(query: string) {
  return query
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, ''))
    .join('\n')
}

function parseJson(text: string): unknown {
  if (!text) return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new TwentyClientError('INVALID_RESPONSE', 'Twenty API returned a non-JSON response.')
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value)
  } catch {
    return '[unserializable payload]'
  }
}
