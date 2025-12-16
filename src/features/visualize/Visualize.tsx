import { memo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { nomenclatureQueryOptions } from '@/api/visualizeQueryOptions'
import type { LunaticGetReferentiel } from '@/models/lunaticType'
import { Route } from '@/routes/visualize'

import Orchestrator from '../orchestrator/Orchestrator'
import { MODE_TYPE } from '@/models/mode'

export const VisualizePage = memo(() => {
  const loaderResults = Route.useLoaderData()
  const queryClient = useQueryClient()

  if (!loaderResults) {
    return <>Veuillez spécifier la source (url du lunatic questionnaire) </>
  }
  const { source, nomenclature } = loaderResults

  const getReferentiel: LunaticGetReferentiel = (name: string) => {
    if (!nomenclature) {
      return Promise.reject(new Error('No nomenclature provided'))
    }

    if (!nomenclature[name]) {
      return Promise.reject(
        new Error(`The nomenclature ${name} is not provided`),
      )
    }
    return queryClient.ensureQueryData(
      nomenclatureQueryOptions(nomenclature[name]),
    )
  }

  return <Orchestrator mode={MODE_TYPE.VISUALIZE} source={source} getReferentiel={getReferentiel} />
})
