import {
  LunaticComponents,
  type LunaticData,
  type LunaticSource,
  useLunatic,
} from '@inseefr/lunatic'
import '@inseefr/lunatic/main.css'

import type { LunaticGetReferentiel } from '@/models/lunaticType'

import DataDownload from './DataDownload'
import Navigation from './Navigation'
import type { StateData } from '@/models/stateData'
import { PAGE_TYPE } from '@/models/pageType'
import type { Interrogation } from '@/models/api/interrogation'
import { MODE_TYPE } from '@/models/mode'
import { useInterrogation } from './hooks/useInterrogation'
import { hasBeenSent } from './utils/orchestrator'
import type { InterrogationData } from '@/models/interrogationData'
import { computeInterrogation, hasDataChanged, trimCollectedData } from './hooks/interrogationUtils'
import { useState } from 'react'


export type OrchestratorProps = OrchestratorProps.Common &
  (
    | OrchestratorProps.Visualize
    | OrchestratorProps.Collect
  )

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrchestratorProps {
  export type Common = {
    /** Questionnaire data consumed by Lunatic to make its components */
    source: LunaticSource
    /** Initial interrogation when we initialize the orchestrator */
    initialInterrogation?: Interrogation
    /** Allows to fetch nomenclature by id */
    getReferentiel: LunaticGetReferentiel
  }

  export type Visualize = {
    mode: MODE_TYPE.VISUALIZE
  }

  export type Collect = {
    mode: MODE_TYPE.COLLECT
    /** Updates data with the modified data and survey state */
    updateDataAndStateData: (params: {
      stateData: StateData
      data: LunaticData['COLLECTED']
      onSuccess?: () => void
      isLogout: boolean
    }) => Promise<void>

  }
}

export default function Orchestrator(props: OrchestratorProps) {

  const { source, getReferentiel, mode } = props

  const initialInterrogation = computeInterrogation(props.initialInterrogation)
  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    getData,
    getChangedData,
    isFirstPage,
    isLastPage,
    pageTag,
    resetChangedData,
    Provider: LunaticProvider,
  } = useLunatic(source, initialInterrogation?.data, {
    getReferentiel,
    autoSuggesterLoading: true,
    disableFilters: true,
    disableFiltersDescription: false,
    componentsOptions: { detailAlwaysDisplayed: true },
  })

  const [lastUpdateDate, setLastUpdateDate] = useState<number | undefined>(
    initialInterrogation?.stateData?.date,
  )

  const initialCurrentPage = initialInterrogation?.stateData?.currentPage
  const initialState = initialInterrogation?.stateData?.state

  // const currentPage =
  //   currentPageType === PAGE_TYPE.LUNATIC ? pageTag : currentPageType



  const components = getComponents()

  function handleGoPrevious() {
    goPreviousPage()
  }

  function handleGoNext() {
    goNextPage()
  }

  const { interrogation, updateInterrogation } = useInterrogation(
    initialInterrogation,

  )

  const triggerDataAndStateUpdate = (isLogout: boolean = false) => {
    if (mode === MODE_TYPE.COLLECT && !hasBeenSent(initialState)) {
      const changedData = getChangedData(true) as InterrogationData
      const interrogation = updateInterrogation(changedData, currentPage)

      if (
        !interrogation.stateData ||
        (!hasDataChanged(changedData) &&
          (currentPageType === PAGE_TYPE.LUNATIC
            ? previousPage === PAGE_TYPE.LUNATIC && previousPageTag === pageTag
            : currentPage === previousPage))
      ) {
        return
      }

      props.updateDataAndStateData({
        stateData: interrogation.stateData,
        // we push only the new data, not the full data
        // changedData.COLLECTED is defined since hasDataChanged checks it
        data: trimCollectedData(changedData.COLLECTED!),
        onSuccess: resetChangedData,
        isLogout: isLogout,
      })
      // update date to show on end page message
      setLastUpdateDate(interrogation.stateData?.date)
    }
  }

  const validateQuestionnaire = async () => {
    if (mode === MODE_TYPE.COLLECT) {
      assert(interrogation.stateData !== undefined)

      return await props.updateDataAndStateData({
        stateData: {
          ...interrogation.stateData,
          state: 'VALIDATED',
          date: new Date().getTime(),
          currentPage: PAGE_TYPE.END,
        },
        // there is no new data to send on validation page
        data: {},
        isLogout: false,
      })
    }

    return Promise.resolve()
  }

  return (
    <LunaticProvider>
      <div className="p-3">
        <LunaticComponents components={components} autoFocusKey={pageTag} />
      </div>
      <div className="p-6">
        <Navigation
          onNext={handleGoNext}
          onPrevious={handleGoPrevious}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </div>
      <div className="p-6">
        <DataDownload getData={getData} />
      </div>
    </LunaticProvider>
  )
}
