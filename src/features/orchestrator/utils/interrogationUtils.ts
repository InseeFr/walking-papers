import type { Interrogation } from '@/models/interrogation'
import type {
  CollectedData,
  CollectedValues,
  InterrogationData,
  VariableType,
} from '@/models/interrogationData'

/**
 * Check if there is collected value with the changes
 */
export function hasDataChanged(changedData: InterrogationData): boolean {
  if (changedData.COLLECTED) {
    return Object.keys(changedData.COLLECTED).length > 0
  }
  return false
}

/**
 * Merge changes with the existing data
 */
export function computeUpdatedData(
  currentInterrogationData: InterrogationData,
  changedData: InterrogationData,
): InterrogationData {
  if (hasDataChanged(changedData)) {
    return computeFullData(currentInterrogationData, changedData)
  }
  return currentInterrogationData
}

/**
 * Retrieve the full data, merging the changes into the current data
 */
function computeFullData(
  currentData: InterrogationData,
  changedData: InterrogationData,
): InterrogationData {
  const changedCollectedData = changedData.COLLECTED
    ? trimCollectedData(changedData.COLLECTED)
    : undefined
  return {
    CALCULATED: { ...currentData.CALCULATED, ...changedData.CALCULATED },
    EXTERNAL: { ...currentData.EXTERNAL, ...changedData.EXTERNAL },
    COLLECTED: { ...currentData.COLLECTED, ...changedCollectedData },
  }
}

type ExtendedCollectedValues = CollectedValues &
  Partial<Record<'EDITED' | 'FORCED' | 'INPUTED' | 'PREVIOUS', VariableType>>

type ExtendedCollectedData = Record<string, ExtendedCollectedValues>

/**
 * Remove useless variables to reduce payload size in API calls
 * (i.e. everything except COLLECTED)
 */
export function trimCollectedData(data: ExtendedCollectedData): CollectedData {
  const trimmedData = structuredClone(data)
  for (const key in trimmedData) {
    delete trimmedData[key]['EDITED']
    delete trimmedData[key]['FORCED']
    delete trimmedData[key]['INPUTED']
    delete trimmedData[key]['PREVIOUS']
  }
  return trimmedData
}

/**
 * Initialize the interrogation with the expected format since it can be empty or
 * partial. State data must be initialized the first time.
 */
export function computeInterrogation(
  partial?: Partial<Interrogation>,
): Interrogation {
  const interrogationId = partial?.id ?? ''
  const questionnaireId = partial?.questionnaireId ?? ''

  return {
    id: interrogationId,
    questionnaireId,
    personalization: partial?.personalization,
    data: partial?.data,
    stateData: partial?.stateData,
  }
}
