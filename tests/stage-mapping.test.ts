import { describe, expect, it } from 'vitest'
import { getStageDefinition, UNKNOWN_STAGE_KEY } from '../server/ia-mujeres/stage-mapping'

describe('stage mapping', () => {
  it('maps known stages', () => {
    expect(getStageDefinition('EMAIL_1_SENT')).toMatchObject({
      key: 'EMAIL_1_SENT',
      label: 'Email 1 enviado',
      semantic: 'active',
    })
  })

  it('maps unknown stages safely', () => {
    expect(getStageDefinition('SOMETHING_NEW')).toMatchObject({
      key: UNKNOWN_STAGE_KEY,
      semantic: 'unknown',
    })
  })
})
