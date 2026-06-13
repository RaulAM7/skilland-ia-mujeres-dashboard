import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { OverviewPage } from '../src/features/ia-mujeres/pages/overview-page'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('OverviewPage', () => {
  it('surfaces the manual review queue in the overview page', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)

    const html = renderToStaticMarkup(<OverviewPage snapshot={snapshot} />)

    expect(html).toContain('Revision manual y senales tecnicas')
    expect(html).toContain('2 en cola')
  })
})
