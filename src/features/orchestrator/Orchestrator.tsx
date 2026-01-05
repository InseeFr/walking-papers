import { useEffect, useRef } from 'react'

import {
  LunaticComponents,
  type LunaticData,
  type LunaticSource,
  useLunatic,
} from '@inseefr/lunatic'
import '@inseefr/lunatic/main.css'
import { assert } from 'tsafe/assert'

import type { Interrogation } from '@/models/interrogation'
import type { InterrogationData } from '@/models/interrogationData'
import type { LunaticGetReferentiel } from '@/models/lunaticType'
import { MODE_TYPE } from '@/models/mode'
import { PAGE_TYPE } from '@/models/pageType'
import type { StateData } from '@/models/stateData'

import DataDownload from './DataDownload'
import Navigation from './Navigation'
import { ValidationPage } from './customPages/ValidationPage'
import { useInterrogation } from './hooks/useInterrogation'
import { useNavigation } from './hooks/useNavigation'
import { useUpdateEffect } from './hooks/useUpdateEffect'
import {
  computeInterrogation,
  trimCollectedData,
} from './utils/interrogationUtils'
import { hasBeenSent } from './utils/orchestrator'

type OrchestratorCommonProps = {
  /** Questionnaire data consumed by Lunatic to make its components */
  source: LunaticSource
  /** Initial interrogation when we initialize the orchestrator */
  initialInterrogation?: Interrogation
  /** Allows to fetch nomenclature by id */
  getReferentiel: LunaticGetReferentiel
}

type OrchestratorVisualizeProps = OrchestratorCommonProps & {
  mode: MODE_TYPE.VISUALIZE
}

type OrchestratorCollectProps = OrchestratorCommonProps & {
  mode: MODE_TYPE.COLLECT
  /** Updates data with the modified data and survey state */
  updateDataAndStateData: (params: {
    stateData: StateData
    data: LunaticData['COLLECTED']
    onSuccess?: () => void
    isLogout: boolean
  }) => Promise<void>
}

export type OrchestratorProps =
  | OrchestratorVisualizeProps
  | OrchestratorCollectProps

export default function Orchestrator(props: OrchestratorProps) {
  const { source, getReferentiel, mode } = props

  const initialInterrogation = computeInterrogation(props.initialInterrogation)

  const initialCurrentPage = initialInterrogation?.stateData?.currentPage
  const initialState = initialInterrogation?.stateData?.state

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    getComponents,
    goPreviousPage: goPreviousLunaticPage,
    goNextPage: goNextLunaticPage,
    goToPage: goToLunaticPage,
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
    trackChanges: true,
    componentsOptions: { detailAlwaysDisplayed: true },
  })

  const validateQuestionnaire = async () => {
    if (mode === MODE_TYPE.COLLECT) {
      assert(interrogation.stateData !== undefined)

      return await props.updateDataAndStateData({
        stateData: {
          ...interrogation.stateData,
          state: 'VALIDATED',
          date: Date.now(),
          currentPage: PAGE_TYPE.END,
        },
        // there is no new data to send on validation page
        data: {},
        isLogout: false,
      })
    }
  }
  const { currentPageType, goNext, goPrevious } = useNavigation({
    goNextLunatic: goNextLunaticPage,
    goPrevLunatic: goPreviousLunaticPage,
    goToLunaticPage: goToLunaticPage,
    isFirstPage,
    isLastPage,
    initialCurrentPage,
    validateQuestionnaire,
  })

  const currentPage =
    currentPageType === PAGE_TYPE.LUNATIC ? pageTag : currentPageType

  const components = getComponents()

  const { interrogation, updateInterrogation } =
    useInterrogation(initialInterrogation)

  useUpdateEffect(() => {
    //Reset scroll to the container when the top is not visible
    if (
      containerRef.current &&
      containerRef.current.getBoundingClientRect().y < 0
    ) {
      containerRef.current.scrollIntoView(true)
    }
    //Reset the focus inside content so the next "Tab" will focus inside content
    if (contentRef.current) {
      contentRef.current.setAttribute('tabindex', '-1')
      contentRef.current.focus({
        preventScroll: true,
      })
      contentRef.current.removeAttribute('tabindex')
    }
    // Persist data and stateData when page change in "collect" mode,
    // except on end page since it's handled during questionnaire validation
    if (currentPageType !== PAGE_TYPE.END) {
      triggerDataAndStateUpdate()
    }
  }, [currentPageType, pageTag])

  useEffect(() => {
    return () => {
      triggerDataAndStateUpdate()
    }
  }, [])

  const triggerDataAndStateUpdate = async (isLogout: boolean = false) => {
    if (mode === MODE_TYPE.COLLECT && !hasBeenSent(initialState)) {
      const changedData = getChangedData(false) as InterrogationData
      const interrogation = updateInterrogation(changedData, currentPage)

      if (!interrogation.stateData) {
        return
      }

      try {
        await props.updateDataAndStateData({
          stateData: interrogation.stateData,
          data: trimCollectedData(changedData.COLLECTED!),
          onSuccess: () => {
            resetChangedData()
          },
          isLogout: isLogout,
        })
      } catch (error) {
        console.error('Failed to update data:', error)
      }
    }
  }

  return (
    <LunaticProvider>
      <div ref={containerRef}>
        <div className="p-3">
          {currentPageType === PAGE_TYPE.LUNATIC && (
            <LunaticComponents components={components} autoFocusKey={pageTag} />
          )}
          {currentPageType === PAGE_TYPE.VALIDATION && <ValidationPage />}
        </div>
        <div className="p-6">
          <Navigation
            onNext={goNext}
            onPrevious={goPrevious}
            currentPageType={currentPageType}
            isFirstPage={isFirstPage}
          />
        </div>
        <div className="p-6">
          <DataDownload getData={getData} />
        </div>
      </div>
    </LunaticProvider>
  )
}
