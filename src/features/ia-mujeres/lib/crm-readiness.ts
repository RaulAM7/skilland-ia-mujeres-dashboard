import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export type CrmReadinessState = 'ready' | 'pending' | 'blocked'

export type CrmReadinessCheck = {
  key: 'mode' | 'credentials' | 'schema_discovery' | 'runtime_mapping' | 'campaign_scope'
  label: string
  state: CrmReadinessState
  detail: string
}

export function getCrmReadinessChecks(snapshot: IaMujeresDashboardSnapshot): CrmReadinessCheck[] {
  const warningCodes = new Set(snapshot.warnings.map((warning) => warning.code))
  const schemaStatus = snapshot.source.schemaDiscovery?.status ?? 'not_run'
  const recordsRead = snapshot.source.recordsRead ?? 0

  return [
    {
      key: 'mode',
      label: 'Modo de datos',
      state: snapshot.source.dataMode === 'crm' ? (snapshot.status === 'error' ? 'blocked' : 'ready') : 'pending',
      detail:
        snapshot.source.dataMode === 'crm'
          ? `Snapshot CRM activo con estado ${snapshot.status}.`
          : 'Mock mode activo; CRM read-only aun no esta habilitado.',
    },
    {
      key: 'credentials',
      label: 'Credenciales CRM',
      state:
        snapshot.source.crmConfigured === true
          ? 'ready'
          : snapshot.source.crmConfigured === false
            ? 'blocked'
            : 'pending',
      detail:
        snapshot.source.crmConfigured === true
          ? 'Configuracion server-side confirmada para lectura.'
          : snapshot.source.crmConfigured === false
            ? 'Faltan CRM_BASE_URL y/o CRM_API_KEY en el entorno server.'
            : 'No confirmadas en el snapshot actual.',
    },
    {
      key: 'schema_discovery',
      label: 'Schema discovery',
      state:
        schemaStatus === 'available'
          ? 'ready'
          : schemaStatus === 'failed' || schemaStatus === 'missing_env'
            ? 'blocked'
            : 'pending',
      detail: getSchemaDiscoveryDetail(schemaStatus, snapshot.source.schemaDiscovery?.summaryPath),
    },
    {
      key: 'runtime_mapping',
      label: 'Mapping runtime',
      state: snapshot.source.runtimeVerified ? 'ready' : warningCodes.has('CRM_UNAVAILABLE') ? 'blocked' : 'pending',
      detail: snapshot.source.runtimeVerified
        ? 'Mapping y lectura runtime verificados en este snapshot.'
        : warningCodes.has('RUNTIME_SCHEMA_UNVERIFIED')
          ? 'La lectura CRM existe, pero el mapping runtime aun no esta confirmado.'
          : 'Pendiente de validar contra el schema real de Twenty.',
    },
    {
      key: 'campaign_scope',
      label: 'Scope IA Mujeres',
      state:
        snapshot.source.dataMode === 'crm' && snapshot.source.runtimeVerified && snapshot.status !== 'error'
          ? 'ready'
          : warningCodes.has('CRM_UNAVAILABLE')
            ? 'blocked'
            : 'pending',
      detail:
        snapshot.source.dataMode === 'crm' && snapshot.source.runtimeVerified && snapshot.status !== 'error'
          ? `Lectura CRM acotada y renderizada con ${recordsRead} registros.`
          : warningCodes.has('CRM_UNAVAILABLE')
            ? 'No hay lectura CRM util en este snapshot.'
            : 'Aun no hay evidencia suficiente de un filtro de campana fiable para IA Mujeres.',
    },
  ]
}

export function getCrmReadinessStatus(checks: CrmReadinessCheck[]): CrmReadinessState {
  if (checks.some((check) => check.state === 'blocked')) return 'blocked'
  if (checks.every((check) => check.state === 'ready')) return 'ready'
  return 'pending'
}

export function getCrmReadinessNextStep(snapshot: IaMujeresDashboardSnapshot, checks = getCrmReadinessChecks(snapshot)) {
  const schemaStatus = snapshot.source.schemaDiscovery?.status ?? 'not_run'

  if (snapshot.source.dataMode !== 'crm') {
    return 'Crear .env.local y mantener mock mode como fallback antes de pasar a CRM.'
  }

  if (snapshot.source.crmConfigured === false) {
    return 'Completar CRM_BASE_URL y CRM_API_KEY en el entorno server.'
  }

  if (schemaStatus === 'not_run') {
    return 'Ejecutar crm:discover y crm:probe antes de confiar en el mapping runtime.'
  }

  if (!snapshot.source.runtimeVerified) {
    return 'Confirmar campaign filter y campos reales antes de activar CRM local como fuente fiable.'
  }

  if (getCrmReadinessStatus(checks) === 'blocked') {
    return 'Resolver el blocker actual y volver a validar el snapshot CRM local.'
  }

  if (snapshot.status === 'partial') {
    return 'Resolver campos faltantes no criticos o aceptar explicitamente el estado partial.'
  }

  return 'CRM local listo para una validacion humana final antes de tocar Vercel.'
}

function getSchemaDiscoveryDetail(status: 'not_run' | 'available' | 'missing_env' | 'failed', summaryPath?: string) {
  if (status === 'available') {
    return summaryPath ? `Summary disponible en ${summaryPath}.` : 'Summary sanitizado disponible.'
  }

  if (status === 'missing_env') {
    return 'No se pudo ejecutar porque faltan variables server-side.'
  }

  if (status === 'failed') {
    return 'El discovery fallo y requiere revision manual segura.'
  }

  return 'Aun no se ha ejecutado discovery/probe sobre este entorno.'
}
