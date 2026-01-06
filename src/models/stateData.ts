import { type Extends } from 'tsafe/Extends'
import { assert } from 'tsafe/assert'

import type { StateData as StateDataApi } from './api'
import type { PageType } from './pageType'
import type { QuestionnaireState } from './questionnaireState'

export type StateData = {
  state: QuestionnaireState
  date: number
  currentPage: PageType
}

assert<Extends<StateData, StateDataApi>>()
