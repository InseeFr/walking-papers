import { useState } from 'react'

import type {
  LunaticGoNextPage,
  LunaticGoPreviousPage,
  LunaticGoToPage,
  LunaticPageTag,
} from '@/models/lunaticType'
import {
  type InternalPageType,
  PAGE_TYPE,
  type PageType,
} from '@/models/pageType'

type Params = {
  pageTag: LunaticPageTag
  isFirstPage?: boolean
  isLastPage?: boolean
  initialCurrentPage?: PageType
  goNextLunatic?: LunaticGoNextPage
  goPrevLunatic?: LunaticGoPreviousPage
  goToLunaticPage?: LunaticGoToPage
  validateQuestionnaire?: () => Promise<void>
}

/**
 * Hook that manages which page should one navigate to
 */
export function useNavigation({
  pageTag,
  isFirstPage = false,
  isLastPage = false,
  initialCurrentPage = '1',
  goNextLunatic = () => {},
  goPrevLunatic = () => {},
  goToLunaticPage = () => {},
  validateQuestionnaire = () => new Promise<void>(() => {}),
}: Params) {
  const [currentPageType, setCurrentPageType] = useState<InternalPageType>(
    () =>
      initialCurrentPage === PAGE_TYPE.END ? PAGE_TYPE.END : PAGE_TYPE.LUNATIC,
  )

  const currentPage =
    currentPageType === PAGE_TYPE.LUNATIC ? pageTag : currentPageType

  const goNext = async () => {
    switch (currentPageType) {
      case PAGE_TYPE.END:
        return
      default:
        return isLastPage
          ? (await validateQuestionnaire(), setCurrentPageType(PAGE_TYPE.END))
          : goNextLunatic()
    }
  }

  const goPrevious = () => {
    switch (currentPageType) {
      case PAGE_TYPE.END:
      default:
        return isFirstPage ? null : goPrevLunatic()
    }
  }

  const goToPage = (
    params:
      | {
          page: PAGE_TYPE.END
        }
      | Parameters<LunaticGoToPage>[0],
  ) => {
    if (params.page === PAGE_TYPE.END) {
      setCurrentPageType(PAGE_TYPE.END)
      return
    }

    goToLunaticPage(params)
  }

  return { currentPage, goNext, goPrevious, goToPage }
}
