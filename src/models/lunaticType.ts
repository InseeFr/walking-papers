import {
  type LunaticOptions, type LunaticSource, getArticulationState,
  useLunatic,
} from '@inseefr/lunatic'

export type LunaticGetReferentiel = LunaticOptions['getReferentiel']

export type Nomenclature = Awaited<
  ReturnType<NonNullable<LunaticGetReferentiel>>
>


export type LunaticGetMultimode = ReturnType<typeof useLunatic>['getMultimode']

export type LunaticGetArticulationState = ReturnType<
  typeof getArticulationState
>
export type LunaticArticulationStateItems = LunaticGetArticulationState['items']


export type Source = LunaticSource
