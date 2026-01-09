import type { PageType } from '@/models/pageType'
import type { StateData } from '@/models/stateData'

/**
 * Whether or not the form has been sent and cannot be updated anymore.
 */
export function hasBeenSent(state?: StateData['state']): boolean {
  return state !== undefined && state !== 'INIT'
}

/**
 * Display the welcome modal when the form has been begun
 * and it's not been sent yet.
 */
export function shouldDisplayWelcomeModal(
  state?: StateData['state'],
  page?: PageType,
): boolean {
  return !hasBeenSent(state) && page !== '1' && page !== undefined
}
