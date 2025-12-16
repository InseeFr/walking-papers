import { type Extends } from 'tsafe/Extends'
import { assert } from 'tsafe/assert'

import type { StateData as StateDataApi } from './api'
import type { QuestionnaireState } from './questionnaireState'
import type { PageType } from './pageType'


/** Temporary type until orval supports union types */
export type LeafStateState =
    | (typeof LeafStateState)[keyof typeof LeafStateState]
    | null

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LeafStateState = {
    COMPLETED: 'COMPLETED',
    INIT: 'INIT',
} as const


export type StateData = {
    state: QuestionnaireState
    date: number
    currentPage: PageType
    leafStates?: {
        state: LeafStateState
        date: number
    }[]

    multimode?: {
        state: null | 'IS_MOVED' | 'IS_SPLIT'
        date: number
    }
}

assert<Extends<StateData, StateDataApi>>()
