import type { StateData } from '@/models/stateData'

export function hasBeenSent(state?: StateData['state']): boolean {
    return state !== undefined && state !== 'INIT'
}