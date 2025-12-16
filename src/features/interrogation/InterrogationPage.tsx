import { memo, useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import type { LunaticGetReferentiel, Nomenclature } from '@/models/lunaticType'
import { Route } from '@/routes/interrogations/$interrogationId'

import Orchestrator from '../orchestrator/Orchestrator'
import { getGetNomenclatureByIdQueryOptions } from '@/api/04-nomenclatures'
import { getGetInterrogationByIdQueryKey, updateInterrogationDataStateDataById } from '@/api/06-interrogations'
import type { StateData } from '@/models/stateData'
import type { LunaticData } from '@inseefr/lunatic'
import { MODE_TYPE } from '@/models/mode'

export const InterrogationPage = memo(() => {
    const { interrogationId } = Route.useParams()
    const loaderResults = Route.useLoaderData()
    const queryClient = useQueryClient()

    if (!loaderResults) {
        return <>Veuillez spécifier la source (url du lunatic questionnaire) </>
    }
    const { source, interrogation } = loaderResults

    const getReferentiel: LunaticGetReferentiel = useCallback(
        (name: string) =>
            queryClient
                .ensureQueryData(getGetNomenclatureByIdQueryOptions(name))
                .then((result) => result as unknown as Nomenclature),
        [queryClient],
    )

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
                    console.log('Auto-save successful')
                }
            })
            .catch((error: Error) => {
                if (!params.isLogout) {
                    console.error('Auto-save failed:', error)

                    return Promise.reject(error)
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
