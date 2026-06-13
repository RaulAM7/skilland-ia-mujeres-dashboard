import { describe, expect, it } from 'vitest'
import { renderMissingEnvSummary } from '../scripts/twenty-script-utils'

describe('renderMissingEnvSummary', () => {
  it('renders deterministic skipped markdown without timestamps', () => {
    const markdown = renderMissingEnvSummary('Twenty Schema Discovery Summary', ['CRM_BASE_URL', 'CRM_API_KEY'])

    expect(markdown).toContain('# Twenty Schema Discovery Summary')
    expect(markdown).toContain('Status: skipped')
    expect(markdown).toContain('- CRM_BASE_URL')
    expect(markdown).toContain('- CRM_API_KEY')
    expect(markdown).not.toContain('Generated at:')
  })
})
