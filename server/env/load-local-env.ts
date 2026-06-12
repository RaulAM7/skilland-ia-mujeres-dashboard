import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export type LoadLocalEnvOptions = {
  cwd?: string
  env?: NodeJS.ProcessEnv
  fileName?: string
}

export type LoadLocalEnvResult = {
  loaded: boolean
  path: string
  keys: string[]
}

export function loadServerOnlyLocalEnv(options: LoadLocalEnvOptions = {}): LoadLocalEnvResult {
  const cwd = options.cwd ?? process.cwd()
  const env = options.env ?? process.env
  const fileName = options.fileName ?? '.env.local'
  const filePath = path.resolve(cwd, fileName)

  if (!existsSync(filePath)) {
    return {
      loaded: false,
      path: filePath,
      keys: [],
    }
  }

  const parsed = parseDotEnv(readFileSync(filePath, 'utf8'))
  const loadedKeys: string[] = []

  for (const [key, value] of Object.entries(parsed)) {
    if (env[key] !== undefined) continue
    env[key] = value
    loadedKeys.push(key)
  }

  return {
    loaded: true,
    path: filePath,
    keys: loadedKeys,
  }
}

function parseDotEnv(input: string) {
  const parsed: Record<string, string> = {}

  for (const line of input.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed)
    if (!match) continue

    const [, key, rawValue] = match
    parsed[key] = unquoteValue(rawValue ?? '')
  }

  return parsed
}

function unquoteValue(value: string) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}
