import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { LunaticPageTag } from '@/models/lunaticType'
import { PAGE_TYPE } from '@/models/pageType'

import { useNavigation } from './useNavigation'

describe('useNavigation', () => {
  const goNextLunaticMock = vi.fn()
  const goPrevLunaticMock = vi.fn()
  const validateQuestionnaireMock = vi.fn().mockResolvedValue(undefined)
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with pageTag by default', () => {
    // Given there is no initial page provided
    const { result } = renderHook(() => useNavigation({ pageTag: '5' }))

    // Then it should start at the pageTag
    expect(result.current.currentPage).toBe('5')
  })

  it('should initialize with provided pageTag when initial page is a lunatic page', () => {
    // Given there is an initial page provided
    const { result } = renderHook(() =>
      useNavigation({
        initialCurrentPage: '5',
        pageTag: '1',
      }),
    )

    // Then it should start at the provided page tag
    expect(result.current.currentPage).toBe('1')
  })

  it('should initialize with end page when initial page is the end page', () => {
    // Given there is an initial page provided as endPage
    const { result } = renderHook(() =>
      useNavigation({
        initialCurrentPage: PAGE_TYPE.END,
        pageTag: '1',
      }),
    )

    // Then it should start at the end page
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
  })

  it('should call goNextLunatic when not on last page', async () => {
    // Given the user is not on the last page
    const { result } = renderHook(() =>
      useNavigation({
        isFirstPage: false,
        isLastPage: false,
        pageTag: '5',
        goNextLunatic: goNextLunaticMock,
      }),
    )
    // When the user tries to go to the next page
    await act(async () => {
      await result.current.goNext()
    })

    // Then it should call the goNextLunatic function
    expect(goNextLunaticMock).toHaveBeenCalledTimes(1)
  })

  it('should validate and go to END on last page', async () => {
    // Given the user is on the last page
    const { result } = renderHook(() =>
      useNavigation({
        isFirstPage: false,
        isLastPage: true,
        pageTag: '5',
        goNextLunatic: goNextLunaticMock,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    // When the user tries to go to the next page
    await act(async () => {
      await result.current.goNext()
    })

    // Then it should validate the questionnaire and redirect the user to the END page
    expect(validateQuestionnaireMock).toHaveBeenCalledTimes(1)
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
    expect(goNextLunaticMock).not.toHaveBeenCalled()
  })

  it('should do nothing when already on end page', async () => {
    // Given the user is already on the END page
    const { result } = renderHook(() =>
      useNavigation({
        initialCurrentPage: PAGE_TYPE.END,
        pageTag: '1', // default pageTag given by Lunatic out of Lunatic page
        goNextLunatic: goNextLunaticMock,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    // When the user tries to go to the next page
    await act(async () => {
      await result.current.goNext()
    })

    // Then it should not call any navigation functions and remain on the END page
    expect(goNextLunaticMock).not.toHaveBeenCalled()
    expect(validateQuestionnaireMock).not.toHaveBeenCalled()
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
  })

  it('should handle page navigation', async () => {
    // Given the user is on the any page that is neither first nor last
    const { result, rerender } = renderHook(
      ({ isFirst, isLast, pageTag }) =>
        useNavigation({
          isFirstPage: isFirst,
          isLastPage: isLast,
          pageTag: pageTag as LunaticPageTag,
          goNextLunatic: goNextLunaticMock,
          goPrevLunatic: goPrevLunaticMock,
          validateQuestionnaire: validateQuestionnaireMock,
        }),
      {
        initialProps: { isFirst: true, isLast: false, pageTag: '1' },
      },
    )

    // When the user tries to go to the previous page
    act(() => {
      result.current.goPrevious()
    })

    // Then it should not call goPrevLunatic since it's the first page
    expect(goPrevLunaticMock).not.toHaveBeenCalled()

    // When the user tries to go to the next page
    await act(async () => {
      await result.current.goNext()
    })

    // Then it should call goNextLunatic since it's not the last page
    expect(goNextLunaticMock).toHaveBeenCalledTimes(1)

    // Given the user is now on the last page
    rerender({ isFirst: false, isLast: true, pageTag: '2' })

    // When the user tries to go to the next page
    await act(async () => {
      await result.current.goNext()
    })

    // Then it should validate the questionnaire and redirect the user to the END page
    expect(validateQuestionnaireMock).toHaveBeenCalledTimes(1)
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
  })
})
