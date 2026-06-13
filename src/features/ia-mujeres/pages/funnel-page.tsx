import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FunnelStageTable } from '../components/funnel-stage-table'
import { LazyFunnelStageChart } from '../components/lazy-funnel-stage-chart'
import { OpportunitiesTable } from '../components/opportunities-table'
import { SnapshotHealthBanner } from '../components/snapshot-health-banner'
import { filterOpportunities } from '../lib/filter-opportunities'
import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export function FunnelPage({ snapshot }: { snapshot: IaMujeresDashboardSnapshot }) {
  const [search, setSearch] = useState('')
  const [stageKey, setStageKey] = useState('all')
  const [technicalOutcome, setTechnicalOutcome] = useState('all')
  const filteredOpportunities = filterOpportunities(snapshot.opportunities, {
    search,
    stageKey,
    technicalOutcome,
  })
  const technicalOutcomes = Array.from(
    new Set(snapshot.opportunities.map((opportunity) => opportunity.technicalEmailOutcome ?? 'unknown')),
  ).sort((left, right) => left.localeCompare(right))

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-normal">Funnel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribucion por stage comercial y oportunidades representativas del mock.
        </p>
      </section>

      <SnapshotHealthBanner snapshot={snapshot} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <LazyFunnelStageChart stages={snapshot.funnelStages} />
        <FunnelStageTable stages={snapshot.funnelStages} />
      </section>

      <Card>
        <CardHeader className="gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Filtros de oportunidades</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Busca entidades y reduce la tabla por stage u outcome tecnico.</p>
          </div>
          <Badge variant="muted">
            Mostrando {filteredOpportunities.length} de {snapshot.opportunities.length}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Buscar entidad o contexto</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. universidad, ayuntamiento, follow-up"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Stage comercial</span>
            <select
              value={stageKey}
              onChange={(event) => setStageKey(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="all">Todos los stages</option>
              {snapshot.funnelStages.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Outcome tecnico</span>
            <select
              value={technicalOutcome}
              onChange={(event) => setTechnicalOutcome(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="all">Todos los outcomes</option>
              {technicalOutcomes.map((outcome) => (
                <option key={outcome} value={outcome}>
                  {outcome}
                </option>
              ))}
            </select>
          </label>
        </CardContent>
      </Card>

      <OpportunitiesTable
        opportunities={filteredOpportunities}
        emptyMessage={
          snapshot.opportunities.length === 0
            ? 'No hay oportunidades para mostrar en este momento.'
            : 'No hay oportunidades que coincidan con los filtros actuales.'
        }
      />
    </div>
  )
}
