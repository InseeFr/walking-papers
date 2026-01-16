import { useState } from 'react'

import type { Interrogation } from '@/models/interrogation'
import type { InterrogationData } from '@/models/interrogationData'
import { PAGE_TYPE, type PageType } from '@/models/pageType'
import type { QuestionnaireState } from '@/models/questionnaireState'

import { computeUpdatedData, hasDataChanged } from '../utils/interrogationUtils'

const emptyData: InterrogationData = {}

export function useInterrogation(initialInterrogation: Interrogation) {
  const [interrogation, setInterrogation] = useState(initialInterrogation)

  /** Compute new state and send an update if necessary. */
  function getNewInterrogationState(
    hasDataChanged: boolean,
    currentPage: PageType,
  ): QuestionnaireState | undefined {
    // if there was no state and data has changed, initialize the state (INIT)
    if (!interrogation?.stateData?.state && hasDataChanged) {
      return 'INIT'
    }

    // on the end page, update state to VALIDATED
    if (currentPage === PAGE_TYPE.END) {
      return 'VALIDATED'
    }

    return interrogation.stateData?.state
  }

  /**
   * Update the interrogation when data or state changes and return the new interrogation
   */
  function updateInterrogation(
    changedData: InterrogationData,
    currentPage: PageType,
  ): Interrogation {
    const hasDataBeenUpdated = hasDataChanged(changedData)
    const data = computeUpdatedData(
      interrogation.data ?? emptyData,
      changedData,
    )
    const newState = getNewInterrogationState(hasDataBeenUpdated, currentPage)
    const result = {
      ...initialInterrogation,
      data,
    }
    if (newState) {
      result.stateData = {
        state: newState,
        date: Date.now(),
        currentPage: currentPage ?? '1',
      }
    }
    setInterrogation(result)
    return result
  }

  return {
    interrogation,
    updateInterrogation,
  }
}
