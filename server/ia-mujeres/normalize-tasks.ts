import type { DashboardTask } from '../../src/features/ia-mujeres/types/dashboard-snapshot'
import type { RawIaMujeresTask } from '../crm/ia-mujeres-crm-repository'

export function normalizeTask(raw: RawIaMujeresTask): DashboardTask {
  return {
    id: raw.id,
    title: raw.title ?? 'Tarea sin titulo',
    status: raw.status ?? 'open',
    dueAt: raw.dueAt,
    owner: raw.owner,
    category: raw.category,
    relatedOpportunity: raw.relatedOpportunity,
    relatedCompany: raw.relatedCompany,
  }
}
