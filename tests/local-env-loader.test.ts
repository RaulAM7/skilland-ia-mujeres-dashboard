import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadServerOnlyLocalEnv } from '../server/env/load-local-env'

describe('server-only local env loader', () => {
  it('loads .env.local without overriding exported env vars', () => {
    const cwd = mkdtempSync(path.join(tmpdir(), 'ia-mujeres-env-'))
    try {
      writeFileSync(
        path.join(cwd, '.env.local'),
        ['CRM_BASE_URL=https://crm.example.com', 'CRM_API_KEY=from-file', 'CRM_CAMPAIGN_KEY="ia-mujeres"'].join('\n'),
      )
      const env: NodeJS.ProcessEnv = {
        CRM_API_KEY: 'from-shell',
      }

      const result = loadServerOnlyLocalEnv({ cwd, env })

      expect(result.loaded).toBe(true)
      expect(result.keys).toEqual(['CRM_BASE_URL', 'CRM_CAMPAIGN_KEY'])
      expect(env.CRM_BASE_URL).toBe('https://crm.example.com')
      expect(env.CRM_API_KEY).toBe('from-shell')
      expect(env.CRM_CAMPAIGN_KEY).toBe('ia-mujeres')
    } finally {
      rmSync(cwd, { recursive: true, force: true })
    }
  })

  it('is not imported from frontend source files', () => {
    const matches = findFiles(path.resolve(process.cwd(), 'src')).filter((filePath) =>
      readFileSync(filePath, 'utf8').includes('load-local-env'),
    )

    expect(matches).toEqual([])
  })
})

function findFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const filePath = path.join(dir, entry)
    return statSync(filePath).isDirectory() ? findFiles(filePath) : [filePath]
  })
}
