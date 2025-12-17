import type { LunaticSource } from '@inseefr/lunatic'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MODE_TYPE } from '@/models/mode'
import { renderWithRouter } from '@/testing/render'

import Orchestrator from '../orchestrator/Orchestrator'
import { VisualizePage } from './Visualize'

vi.mock('@/routes/visualize', () => ({
  Route: {
    useParams: vi.fn(),
    useLoaderData: vi.fn(),
  },
}))

vi.mock('../orchestrator/Orchestrator', () => ({
  default: vi.fn(() => <div>Mocked Orchestrator</div>),
}))

const { Route } = await import('@/routes/visualize')

describe('VisualizePage', () => {
  const mockSource: LunaticSource = {
    components: [],
    variables: [],
  } as LunaticSource
  const mockNomenclature = {
    name: 'nomenclatureName',
    data: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(Route.useLoaderData).mockReturnValue({
      source: mockSource,
      nomenclature: mockNomenclature,
    })
  })

  it('should render error message when loaderResults is null', async () => {
    vi.mocked(Route.useLoaderData).mockReturnValue(null)

    await renderWithRouter(<VisualizePage />)

    expect(
      screen.getByText(
        'Veuillez spécifier la source (url du lunatic questionnaire)',
      ),
    ).toBeInTheDocument()
  })

  it('should throw error when nomenclature is missing', async () => {
    vi.mocked(Route.useLoaderData).mockReturnValue({
      source: mockSource,
      nomenclature: null,
    })

    await renderWithRouter(<VisualizePage />)

    const orchestratorCalls = vi.mocked(Orchestrator).mock.calls
    expect(orchestratorCalls.length).toBeGreaterThan(0)

    const getReferentiel = orchestratorCalls[0]?.[0]?.getReferentiel

    if (!getReferentiel) {
      throw new Error('getReferentiel was not passed to Orchestrator')
    }

    await expect(getReferentiel('randomName')).rejects.toThrow(
      'No nomenclature provided',
    )
  })

  it('should render Orchestrator with correct mode', async () => {
    await renderWithRouter(<VisualizePage />)

    expect(Orchestrator).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: MODE_TYPE.VISUALIZE,
        source: mockSource,
        getReferentiel: expect.any(Function),
      }),
      undefined,
    )
  })
})
