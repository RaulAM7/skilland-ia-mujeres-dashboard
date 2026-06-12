import type {
  CrmHealthStatus,
  IaMujeresCrmRepository,
  RawIaMujeresCompany,
  RawIaMujeresOpportunity,
  RawIaMujeresPerson,
  RawIaMujeresTask,
} from './ia-mujeres-crm-repository'

const CRM_STUB_MESSAGE =
  'CRM mode is not implemented until CRM_BASE_URL, CRM_API_KEY and runtime schema are verified.'

export class TwentyIaMujeresRepository implements IaMujeresCrmRepository {
  async listCampaignOpportunities(): Promise<RawIaMujeresOpportunity[]> {
    throw new Error(CRM_STUB_MESSAGE)
  }

  async listCampaignTasks(): Promise<RawIaMujeresTask[]> {
    throw new Error(CRM_STUB_MESSAGE)
  }

  async listCampaignCompanies(): Promise<RawIaMujeresCompany[]> {
    throw new Error(CRM_STUB_MESSAGE)
  }

  async listCampaignPeople(): Promise<RawIaMujeresPerson[]> {
    throw new Error(CRM_STUB_MESSAGE)
  }

  async getHealth(): Promise<CrmHealthStatus> {
    return {
      ok: false,
      provider: 'twenty',
      message: CRM_STUB_MESSAGE,
    }
  }
}

export { CRM_STUB_MESSAGE }
