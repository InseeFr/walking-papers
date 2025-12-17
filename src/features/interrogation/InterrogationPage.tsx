import { memo, useCallback } from 'react'

import type { LunaticData } from '@inseefr/lunatic'
import { useQueryClient } from '@tanstack/react-query'

import { getGetNomenclatureByIdQueryOptions } from '@/api/04-nomenclatures'
import {
  getGetInterrogationByIdQueryKey,
  updateInterrogationDataStateDataById,
} from '@/api/06-interrogations'
import type { LunaticGetReferentiel, Nomenclature } from '@/models/lunaticType'
import { MODE_TYPE } from '@/models/mode'
import type { StateData } from '@/models/stateData'
import { Route } from '@/routes/interrogations/$interrogationId'

import Orchestrator from '../orchestrator/Orchestrator'

export const InterrogationPage = memo(() => {
  const { interrogationId } = Route.useParams()
  const loaderResults = Route.useLoaderData()
  const queryClient = useQueryClient()

  const getReferentiel: LunaticGetReferentiel = useCallback(
    (name: string) =>
      queryClient
        .ensureQueryData(getGetNomenclatureByIdQueryOptions(name))
        .then((result) => result as unknown as Nomenclature),
    [queryClient],
  )

  if (!loaderResults) {
    return <>Veuillez spécifier la source (url du lunatic questionnaire) </>
  }
  const { source, interrogation } = loaderResults

  const queryKeyToInvalidate = getGetInterrogationByIdQueryKey(interrogationId)

  const updateDataAndStateData = (params: {
    stateData: StateData
    data: LunaticData['COLLECTED']
    onSuccess?: () => void
    isLogout: boolean
  }) =>
    updateInterrogationDataStateDataById(interrogationId, {
      data: params.data,
      stateData: params.stateData,
    })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [queryKeyToInvalidate],
        })

        params.onSuccess?.()

        if (params.data && !params.isLogout) {
          console.log('Save successful')
        }
      })
      .catch((error: Error) => {
        if (!params.isLogout) {
          console.error('Save failed:', error)

          throw error
        }
      })

  return (
    <Orchestrator
      mode={MODE_TYPE.COLLECT}
      source={source}
      getReferentiel={getReferentiel}
      initialInterrogation={interrogation}
      updateDataAndStateData={updateDataAndStateData}
    />
  )
})
