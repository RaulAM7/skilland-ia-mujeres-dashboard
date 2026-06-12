import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRefreshResponse } from '../../server/api/ia-mujeres-http'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET' && request.method !== 'POST') {
    response.status(405).json({ status: 'error', message: 'Method not allowed' })
    return
  }

  const result = await getRefreshResponse({
    method: request.method,
    headers: request.headers,
  })

  response.status(result.status).json(result.body)
}
