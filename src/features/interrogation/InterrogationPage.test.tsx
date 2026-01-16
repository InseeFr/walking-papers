import type { LunaticSource } from '@inseefr/lunatic'
import { QueryClient } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as interrogationsApi from '@/api/06-interrogations'
import type { Interrogation } from '@/models/interrogation'
import { MODE_TYPE } from '@/models/mode'
import { renderWithRouter } from '@/testing/render'

import Orchestrator from '../orchestrator/Orchestrator'
import { InterrogationPage } from './InterrogationPage'

const queryClient = new QueryClient()

vi.mock('@/routes/interrogations/$interrogationId', () => ({
  Route: {
    useParams: vi.fn(),
    useLoaderData: vi.fn(),
  },
}))

vi.mock('../orchestrator/Orchestrator', () => ({
  default: vi.fn(() => <div>Mocked Orchestrator</div>),
}))

vi.mock('@/api/04-nomenclatures')
vi.mock('@/api/06-interrogations')

const { Route } = await import('@/routes/interrogations/$interrogationId')

describe('InterrogationPage', () => {
  const mockInterrogationId = 'test-interrogation-id'
  const mockSource: LunaticSource = {
    components: [],
    variables: [],
  } as LunaticSource

  const mockInterrogation: Interrogation = {
    id: mockInterrogationId,
    questionnaireId: 'questionnaire-1',
    data: {},
    stateData: {
      state: 'INIT',
      date: Date.now(),
      currentPage: '1',
    },
  } as Interrogation

  const mockInterrogationData = {
    id: 'test-id',
    questionnaireId: 'questionnaire-1',
    data: {},
    stateData: {
      state: 'INIT',
      date: Date.now(),
      currentPage: '1',
    },
  }

  queryClient.setQueryData(
    ['/api/interrogations/test-id'],
    mockInterrogationData,
  )

  beforeEach(() => {
    vi.mocked(Route.useParams).mockReturnValue({
      interrogationId: mockInterrogationId,
    })
    vi.mocked(Route.useLoaderData).mockReturnValue({
      source: mockSource,
      interrogation: mockInterrogation,
    })

    vi.mocked(
      interrogationsApi.updateInterrogationDataStateDataById,
    ).mockResolvedValue(undefined)
  })

  it('should render error message when loaderResults is null', async () => {
    vi.mocked(Route.useLoaderData).mockReturnValue(null)

    await renderWithRouter(<InterrogationPage />)

    expect(
      screen.getByText(
        'Veuillez spécifier la source (url du lunatic questionnaire)',
      ),
    ).toBeInTheDocument()
  })

  it('should render Orchestrator with correct mode', async () => {
    await renderWithRouter(<InterrogationPage />)

    expect(Orchestrator).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: MODE_TYPE.COLLECT,
        source: mockSource,
        initialInterrogation: mockInterrogation,
        getReferentiel: expect.any(Function),
        updateDataAndStateData: expect.any(Function),
      }),
      undefined,
    )
  })
})
