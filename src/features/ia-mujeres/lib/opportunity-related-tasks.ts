import type { DashboardOpportunity, DashboardTask } from '../types/dashboard-snapshot'
import { sortTasksByUrgency } from './filter-tasks'

export function getRelatedTasksForOpportunity(tasks: DashboardTask[], opportunity: DashboardOpportunity) {
  const relatedNames = new Set(
    [opportunity.companyName, opportunity.name]
      .filter(Boolean)
      .map((value) => normalize(value)),
  )

  return sortTasksByUrgency(
    tasks.filter((task) => {
      if (task.relatedOpportunity?.id === opportunity.id) {
        return true
      }

      const relatedCompanyName = normalize(task.relatedCompany?.name)
      const relatedOpportunityName = normalize(task.relatedOpportunity?.name)

      return relatedNames.has(relatedCompanyName) || relatedNames.has(relatedOpportunityName)
    }),
  )
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ''
}
