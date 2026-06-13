import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mockSnapshot from '../public/mock-data/ia-mujeres-snapshot.mock.json'
import { BatchesTable } from '../src/features/ia-mujeres/components/batches-table'
import { getRecentBatches } from '../src/features/ia-mujeres/lib/recent-batches'
import { parseDashboardSnapshot } from '../src/features/ia-mujeres/types/parse-dashboard-snapshot'

describe('BatchesTable', () => {
  it('renders recent batches from the snapshot', () => {
    const snapshot = parseDashboardSnapshot(mockSnapshot)
    const html = renderToStaticMarkup(<BatchesTable batches={getRecentBatches(snapshot.batches)} />)

    expect(html).toContain('Lotes recientes de outreach')
    expect(html).toContain('Mock batch email 1')
    expect(html).toContain('30')
    expect(html).toContain('mock')
  })

  it('renders a safe empty state when there are no batches', () => {
    const html = renderToStaticMarkup(<BatchesTable batches={[]} />)

    expect(html).toContain('No hay lotes recientes en el snapshot actual.')
  })
})
