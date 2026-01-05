import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PAGE_TYPE } from '@/models/pageType'

import { useNavigation } from './useNavigation'

describe('useNavigation', () => {
  const goNextLunaticMock = vi.fn()
  const goPrevLunaticMock = vi.fn()
  const validateQuestionnaireMock = vi.fn().mockResolvedValue(undefined)
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with first page by default', () => {
    const { result } = renderHook(() => useNavigation({}))

    expect(result.current.currentPage).toBe('1')
  })

  it('should initialize with provided initial page', () => {
    const { result } = renderHook(() =>
      useNavigation({
        initialCurrentPage: '5',
      }),
    )

    expect(result.current.currentPage).toBe('5')
  })

  it('should call goNextLunatic when not on last page', async () => {
    const { result } = renderHook(() =>
      useNavigation({
        isFirstPage: false,
        isLastPage: false,
        goNextLunatic: goNextLunaticMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    })

    expect(goNextLunaticMock).toHaveBeenCalledTimes(1)
  })

  it('should validate and go to END on last page', async () => {
    const { result } = renderHook(() =>
      useNavigation({
        isFirstPage: false,
        isLastPage: true,
        goNextLunatic: goNextLunaticMock,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    })

    expect(validateQuestionnaireMock).toHaveBeenCalledTimes(1)
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
    expect(goNextLunaticMock).not.toHaveBeenCalled()
  })

  it('should do nothing when already on end page', async () => {
    const { result } = renderHook(() =>
      useNavigation({
        initialCurrentPage: PAGE_TYPE.END,
        goNextLunatic: goNextLunaticMock,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    })

    expect(goNextLunaticMock).not.toHaveBeenCalled()
    expect(validateQuestionnaireMock).not.toHaveBeenCalled()
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
  })

  it('should handle page navigation', async () => {
    const { result, rerender } = renderHook(
      ({ isFirst, isLast }) =>
        useNavigation({
          isFirstPage: isFirst,
          isLastPage: isLast,
          goNextLunatic: goNextLunaticMock,
          goPrevLunatic: goPrevLunaticMock,
          validateQuestionnaire: validateQuestionnaireMock,
        }),
      {
        initialProps: { isFirst: true, isLast: false },
      },
    )

    act(() => {
      result.current.goPrevious()
    })
    expect(goPrevLunaticMock).not.toHaveBeenCalled()

    await act(async () => {
      await result.current.goNext()
    })
    expect(goNextLunaticMock).toHaveBeenCalledTimes(1)

    rerender({ isFirst: false, isLast: true })

    await act(async () => {
      await result.current.goNext()
    })
    expect(validateQuestionnaireMock).toHaveBeenCalledTimes(1)
    expect(result.current.currentPage).toBe(PAGE_TYPE.END)
  })
})
