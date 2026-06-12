import type { StageSemantic } from '../../src/features/ia-mujeres/types/dashboard-snapshot'

export type StageDefinition = {
  key: string
  label: string
  order: number
  semantic: StageSemantic
}

export const UNKNOWN_STAGE_KEY = 'UNKNOWN_STAGE'

export const STAGE_DEFINITIONS: Record<string, StageDefinition> = {
  NOT_SENT: {
    key: 'NOT_SENT',
    label: 'Sin contactar',
    order: 10,
    semantic: 'neutral',
  },
  DRAFT_CREATED: {
    key: 'DRAFT_CREATED',
    label: 'Draft creado',
    order: 20,
    semantic: 'neutral',
  },
  EMAIL_1_SENT: {
    key: 'EMAIL_1_SENT',
    label: 'Email 1 enviado',
    order: 30,
    semantic: 'active',
  },
  REPLY_RECEIVED: {
    key: 'REPLY_RECEIVED',
    label: 'Respuesta recibida',
    order: 40,
    semantic: 'success',
  },
  MEETING_PROPOSED: {
    key: 'MEETING_PROPOSED',
    label: 'Reunion propuesta',
    order: 50,
    semantic: 'success',
  },
  MEETING_SCHEDULED: {
    key: 'MEETING_SCHEDULED',
    label: 'Reunion agendada',
    order: 60,
    semantic: 'success',
  },
  WRONG_CONTACT_MANUAL_REVIEW: {
    key: 'WRONG_CONTACT_MANUAL_REVIEW',
    label: 'Revision manual por contacto',
    order: 80,
    semantic: 'danger',
  },
  BOUNCED: {
    key: 'BOUNCED',
    label: 'Bounce detectado',
    order: 82,
    semantic: 'danger',
  },
  FOLLOWUP_1_DUE: {
    key: 'FOLLOWUP_1_DUE',
    label: 'Follow-up 1 pendiente',
    order: 90,
    semantic: 'warning',
  },
  FOLLOWUP_1_SENT: {
    key: 'FOLLOWUP_1_SENT',
    label: 'Follow-up 1 enviado',
    order: 92,
    semantic: 'warning',
  },
  CLOSED_NO_RESPONSE: {
    key: 'CLOSED_NO_RESPONSE',
    label: 'Cerrado sin respuesta',
    order: 110,
    semantic: 'future',
  },
  CLOSED_NOT_RELEVANT: {
    key: 'CLOSED_NOT_RELEVANT',
    label: 'Cerrado no relevante',
    order: 120,
    semantic: 'danger',
  },
}

export function getStageDefinition(stage: string | undefined): StageDefinition {
  if (!stage) {
    return {
      key: UNKNOWN_STAGE_KEY,
      label: 'Stage desconocido',
      order: 999,
      semantic: 'unknown',
    }
  }

  return (
    STAGE_DEFINITIONS[stage] ?? {
      key: UNKNOWN_STAGE_KEY,
      label: `Stage no mapeado: ${stage}`,
      order: 999,
      semantic: 'unknown',
    }
  )
}

export function isKnownStage(stage: string | undefined) {
  return Boolean(stage && STAGE_DEFINITIONS[stage])
}
