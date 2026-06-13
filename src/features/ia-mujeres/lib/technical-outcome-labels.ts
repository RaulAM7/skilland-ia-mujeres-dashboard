export function getTechnicalOutcomeLabel(outcome: string | undefined) {
  switch (outcome) {
    case 'not_attempted':
      return 'No intentado'
    case 'sent_without_bounce':
      return 'Enviado sin bounce'
    case 'bounced':
      return 'Bounce detectado'
    case 'manual_review':
      return 'Revision manual'
    default:
      return 'Unknown'
  }
}
