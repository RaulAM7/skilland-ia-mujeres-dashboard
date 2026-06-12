import { createServer, type ServerResponse } from 'node:http'
import { loadServerOnlyLocalEnv } from '../server/env/load-local-env'
import { getRefreshResponse, getSnapshotResponse } from '../server/api/ia-mujeres-http'

loadServerOnlyLocalEnv()

const port = Number(process.env.DEV_API_PORT ?? 5174)

const server = createServer(async (request, response) => {
  const method = request.method ?? 'GET'
  const url = request.url ?? '/'

  if (method === 'GET' && url.startsWith('/api/ia-mujeres/snapshot')) {
    await sendJson(response, await getSnapshotResponse())
    return
  }

  if ((method === 'GET' || method === 'POST') && url.startsWith('/api/ia-mujeres/refresh')) {
    await sendJson(
      response,
      await getRefreshResponse({
        method,
        headers: request.headers,
      }),
    )
    return
  }

  await sendJson(response, {
    status: 404,
    body: {
      status: 'error',
      message: 'Not found',
    },
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock IA Mujeres API listening on http://127.0.0.1:${port}`)
})

async function sendJson(response: ServerResponse, result: { status: number; body: unknown; headers?: Record<string, string> }) {
  response.statusCode = result.status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  for (const [key, value] of Object.entries(result.headers ?? {})) {
    response.setHeader(key, value)
  }
  response.end(JSON.stringify(result.body))
}
