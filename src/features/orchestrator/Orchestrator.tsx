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

export type Props = {
  /** The survey generated in Lunatic json format. */
  source: LunaticSource
  /** Allows to fetch nomenclature by id */
  getReferentiel: LunaticGetReferentiel
  /** The initial data. */
  data?: LunaticData
}

export default function Orchestrator({
  source,
  getReferentiel,
  data,
}: Readonly<Props>) {
  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    getData,
    isFirstPage,
    isLastPage,
    pageTag,
    Provider: LunaticProvider,
  } = useLunatic(source, data, {
    getReferentiel,
    autoSuggesterLoading: true,
    disableFilters: true,
    disableFiltersDescription: false,
    componentsOptions: { detailAlwaysDisplayed: true },
  })

  const components = getComponents()

  function handleGoPrevious() {
    goPreviousPage()
  }

  function handleGoNext() {
    goNextPage()
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
