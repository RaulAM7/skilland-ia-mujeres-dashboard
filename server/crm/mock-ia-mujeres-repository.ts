import mockSnapshotJson from '../../public/mock-data/ia-mujeres-snapshot.mock.json'
import type { IaMujeresDashboardSnapshot } from '../../src/features/ia-mujeres/types/dashboard-snapshot'
import { iaMujeresDashboardSnapshotSchema } from '../ia-mujeres/snapshot-schema'
import type { SnapshotBackedRepository } from './ia-mujeres-crm-repository'

export class MockIaMujeresRepository implements SnapshotBackedRepository {
  private readonly snapshot: IaMujeresDashboardSnapshot

  constructor(snapshot: unknown = mockSnapshotJson) {
    this.snapshot = iaMujeresDashboardSnapshotSchema.parse(snapshot)
  }

  async getSnapshot() {
    return this.snapshot
  }

  async listCampaignOpportunities() {
    return this.snapshot.opportunities
  }

  async listCampaignTasks() {
    return this.snapshot.tasks
  }

  async listCampaignCompanies() {
    return this.snapshot.opportunities.map((opportunity) => ({
      id: opportunity.id.replace(/^opp-/, 'co-'),
      name: opportunity.companyName ?? opportunity.name,
    }))
  }

  async listCampaignPeople() {
    return []
  }

  async getHealth() {
    return {
      ok: true,
      provider: 'mock' as const,
      message: 'Mock IA Mujeres repository is available.',
    }
  }
}
