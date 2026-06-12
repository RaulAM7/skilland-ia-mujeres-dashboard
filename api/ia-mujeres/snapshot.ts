import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSnapshotResponse } from '../../server/api/ia-mujeres-http'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.status(405).json({ status: 'error', message: 'Method not allowed' })
    return
  }

  const result = await getSnapshotResponse()
  for (const [key, value] of Object.entries(result.headers ?? {})) {
    response.setHeader(key, value)
  }
  response.status(result.status).json(result.body)
}
