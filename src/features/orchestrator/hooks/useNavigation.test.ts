import { act, renderHook } from '@testing-library/react'

import {
  type InternalPageType,
  type NirvanaPage,
  PAGE_TYPE,
  type PageType,
} from '@/models/pageType'

import { useNavigation } from './useNavigation'

describe('useNavigation', () => {
  test.each<{ initialCurrentPage?: PageType; expected: InternalPageType }>([
    { initialCurrentPage: PAGE_TYPE.WELCOME, expected: PAGE_TYPE.LUNATIC },
    { initialCurrentPage: PAGE_TYPE.VALIDATION, expected: PAGE_TYPE.LUNATIC },
    { initialCurrentPage: PAGE_TYPE.END, expected: PAGE_TYPE.END },
    { expected: PAGE_TYPE.LUNATIC },
  ])(
    'go to next $initialCurrentPage -> $expected',
    async ({ initialCurrentPage, expected }) => {
      const { result } = renderHook(() =>
        useNavigation({
          initialCurrentPage,
        }),
      )

      await act(async () => {
        await result.current.goNext()
      })

      expect(result.current.currentPageType).toBe(expected)
    },
  )

  test('go to next lunaticPage -> lunaticPage (not last page)', async () => {
    const goNextLunaticMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        goNextLunatic: goNextLunaticMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    await act(async () => {
      await result.current.goNext()
    })

    expect(goNextLunaticMock).toHaveBeenCalledOnce()
    expect(result.current.currentPageType).toBe(PAGE_TYPE.LUNATIC)
  })

  test('go to next lunaticPage -> validationPage (last page)', async () => {
    const goNextLunaticMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        isLastPage: true,
        goNextLunatic: goNextLunaticMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    await act(async () => {
      await result.current.goNext()
    })

    expect(goNextLunaticMock).not.toHaveBeenCalled()
    expect(result.current.currentPageType).toBe(PAGE_TYPE.VALIDATION)
  })

  test.each<{ initialCurrentPage?: PageType; expected: InternalPageType }>([
    { initialCurrentPage: PAGE_TYPE.WELCOME, expected: PAGE_TYPE.WELCOME },
    { initialCurrentPage: PAGE_TYPE.VALIDATION, expected: PAGE_TYPE.WELCOME },
    { initialCurrentPage: PAGE_TYPE.END, expected: PAGE_TYPE.END },
    { expected: PAGE_TYPE.WELCOME },
  ])(
    'go to previous $initialCurrentPage -> $expected',
    async ({ initialCurrentPage, expected }) => {
      const { result } = renderHook(() =>
        useNavigation({
          initialCurrentPage,
        }),
      )

      act(() => result.current.goPrevious())

      expect(result.current.currentPageType).toBe(expected)
    },
  )

  test('go to previous lunaticPage -> lunaticPage (not first page)', async () => {
    const goPrevLunaticMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        goPrevLunatic: goPrevLunaticMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    act(() => result.current.goPrevious())

    expect(goPrevLunaticMock).toHaveBeenCalledOnce()
    expect(result.current.currentPageType).toBe(PAGE_TYPE.LUNATIC)
  })

  test('go to next lunaticPage -> welcomePage (first page)', async () => {
    const goPrevLunaticMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        isFirstPage: true,
        goPrevLunatic: goPrevLunaticMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    act(() => result.current.goPrevious())

    expect(goPrevLunaticMock).not.toHaveBeenCalled()
    expect(result.current.currentPageType).toBe(PAGE_TYPE.WELCOME)
  })

  test.each<{ page: NirvanaPage; shouldGoToLunaticPageBeCalled?: boolean }>([
    { page: PAGE_TYPE.WELCOME },
    { page: PAGE_TYPE.VALIDATION },
    { page: PAGE_TYPE.END },
  ])('go to page $page', ({ page }) => {
    const goToLunaticPageMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        goToLunaticPage: goToLunaticPageMock,
      }),
    )

    act(() => result.current.goToPage({ page }))
    expect(goToLunaticPageMock).not.toHaveBeenCalled()

    expect(result.current.currentPageType).toBe(page)
  })

  test('go to lunatic page ', () => {
    const goToLunaticPageMock = vi.fn()

    const { result } = renderHook(() =>
      useNavigation({
        goToLunaticPage: goToLunaticPageMock,
      }),
    )

    act(() => result.current.goToPage({ page: 1 }))

    expect(goToLunaticPageMock).toHaveBeenCalledOnce()
    expect(goToLunaticPageMock).toHaveBeenCalledWith({ page: 1 })

    expect(result.current.currentPageType).toBe(PAGE_TYPE.LUNATIC)
  })

  test('go to next validation page -> end page when validation succeeds', async () => {
    // Mock validateQuestionnaire to succeed
    const validateQuestionnaireMock = vi.fn().mockResolvedValue(undefined)

    const { result } = renderHook(() =>
      useNavigation({
        isLastPage: true,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    await act(async () => {
      await result.current.goNext()
    }) // go to validation page

    expect(result.current.currentPageType).toBe(PAGE_TYPE.VALIDATION)

    await act(async () => {
      await result.current.goNext()
    }) // validate questionnaire

    expect(validateQuestionnaireMock).toHaveBeenCalledOnce()
    // It should go to end page
    expect(result.current.currentPageType).toBe(PAGE_TYPE.END)
  })

  test('validation page -> stays on validation page when validation fails', async () => {
    // Mock validateQuestionnaire to fail
    const validateQuestionnaireMock = vi
      .fn()
      .mockRejectedValue(new Error('validation failed'))

    const { result } = renderHook(() =>
      useNavigation({
        isLastPage: true,
        validateQuestionnaire: validateQuestionnaireMock,
      }),
    )

    await act(async () => {
      await result.current.goNext()
    }) // go to lunatic page

    await act(async () => {
      await result.current.goNext()
    }) // go to validation page

    expect(result.current.currentPageType).toBe(PAGE_TYPE.VALIDATION)

    await act(async () => {
      await expect(result.current.goNext()).rejects.toThrow('validation failed') // attempt validation
    })

    expect(validateQuestionnaireMock).toHaveBeenCalledOnce()
    // Page should remain on VALIDATION because validation failed
    expect(result.current.currentPageType).toBe(PAGE_TYPE.VALIDATION)
  })
})
