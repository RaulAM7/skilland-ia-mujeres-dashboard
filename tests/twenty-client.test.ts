import { describe, expect, it } from 'vitest'
import { createTwentyClient, TwentyClientError } from '../server/crm/twenty-client'

describe('twenty client', () => {
  it('normalizes URLs and sends read-only GraphQL requests with redacted errors', async () => {
    const urls: string[] = []
    const client = createTwentyClient({
      baseUrl: 'https://crm.example.com/',
      apiKey: 'secret-api-key',
      fetchImpl: async (url) => {
        urls.push(url)
        return new Response(
          JSON.stringify({
            errors: [{ message: 'Bearer secret-api-key failed for admin@example.com' }],
          }),
          { status: 200 },
        )
      },
    })

    await expect(client.graphql('query Test { __typename }')).rejects.toThrow('[REDACTED]')
    await expect(client.graphql('query Test { __typename }')).rejects.toThrow('[REDACTED_EMAIL]')
    expect(urls[0]?.startsWith('https://crm.example.com/graphql?')).toBe(true)
  })

  it('blocks GraphQL mutations before making a request', async () => {
    let calls = 0
    const client = createTwentyClient({
      baseUrl: 'https://crm.example.com',
      apiKey: 'safe-key',
      fetchImpl: async () => {
        calls += 1
        return new Response('{}')
      },
    })

    await expect(client.graphql('mutation UpdateThing { updateCompany { id } }')).rejects.toMatchObject({
      code: 'UNSAFE_OPERATION',
    })
    expect(calls).toBe(0)
  })

  it('blocks REST write methods', async () => {
    const client = createTwentyClient({
      baseUrl: 'https://crm.example.com',
      apiKey: 'safe-key',
      fetchImpl: async () => new Response('{}'),
    })

    await expect(client.rest('opportunities', { method: 'DELETE' })).rejects.toBeInstanceOf(TwentyClientError)
  })
})
