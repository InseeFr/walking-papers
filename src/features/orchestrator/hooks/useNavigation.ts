import { useState } from 'react'

import type {
  LunaticGoNextPage,
  LunaticGoPreviousPage,
  LunaticGoToPage,
} from '@/models/lunaticType'
import { type NirvanaPage, PAGE_TYPE, type PageType } from '@/models/pageType'

type Params = {
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
  isFirstPage = false,
  isLastPage = false,
  initialCurrentPage = '1',
  goNextLunatic = () => {},
  goPrevLunatic = () => {},
  goToLunaticPage = () => {},
  validateQuestionnaire = () => new Promise<void>(() => {}),
}: Params) {
  const [currentPage, setCurrentPage] = useState<PageType>(initialCurrentPage)

  const goNext = async () => {
    switch (currentPage) {
      case PAGE_TYPE.END:
        return
      default:
        return isLastPage
          ? (await validateQuestionnaire(), setCurrentPage(PAGE_TYPE.END))
          : goNextLunatic()
    }
  }

  const goPrevious = () => {
    switch (currentPage) {
      case PAGE_TYPE.END:
      default:
        return isFirstPage ? null : goPrevLunatic()
    }
  }

  const goToPage = (
    params:
      | {
          page: NirvanaPage
        }
      | Parameters<LunaticGoToPage>[0],
  ) => {
    if (params.page === PAGE_TYPE.END) {
      setCurrentPage(PAGE_TYPE.END)
      return
    }

    goToLunaticPage(params)
  }
  return { goNext, goPrevious, goToPage, currentPage }
}
