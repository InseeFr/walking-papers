import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, vi } from 'vitest'

import type { Interrogation } from '@/models/interrogation'
import { MODE_TYPE } from '@/models/mode'
import { PAGE_TYPE } from '@/models/pageType'
import { renderWithRouter } from '@/testing/render'

import Orchestrator from './Orchestrator'

const queryClient = new QueryClient()

describe('Orchestrator', () => {
  const defaultInterrogation = {
    stateData: undefined,
    data: undefined,
    id: 'my-service-unit-id',
  } as Interrogation

  const sourceMultipleQuestion = {
    componentType: 'Questionnaire',
    components: [
      {
        componentType: 'Sequence',
        page: '1',
        id: 's1',
        label: [{ type: 'VTL', value: '"Ma séquence"' }],
      },
      {
        componentType: 'Question',
        page: '2',
        id: 'q1',
        components: [
          {
            componentType: 'Input',
            page: '2',
            label: { value: 'my-question', type: 'TXT' },
            id: 'i1',
            response: { name: 'my-question-input' },
          },
        ],
      },
      {
        componentType: 'Question',
        page: '3',
        id: 'q2',
        components: [
          {
            componentType: 'Input',
            page: '3',
            label: { value: 'my-question-2', type: 'TXT' },
            id: 'i2',
            response: { name: 'my-question-2-input' },
          },
        ],
      },
    ],
    variables: [],
    maxPage: '3',
  }

  const OrchestratorTestWrapper = ({
    mode,
    isDownloadEnabled = false,
    initialInterrogation = defaultInterrogation,
    source = sourceMultipleQuestion,
    updateDataAndStateData = () => {
      return new Promise<void>(() => {})
    },
  }: {
    mode: MODE_TYPE.COLLECT | MODE_TYPE.VISUALIZE
    isDownloadEnabled?: boolean
    initialInterrogation?: Interrogation
    source?: unknown
    updateDataAndStateData?: (params: {
      data: Interrogation['data']
      stateData: Interrogation['stateData']
    }) => Promise<void>
  }) => (
    <QueryClientProvider client={queryClient}>
      <Orchestrator
        mode={mode}
        isDownloadEnabled={isDownloadEnabled}
        initialInterrogation={initialInterrogation}
        // @ts-expect-error: we should have a better lunatic mock
        source={source}
        getReferentiel={() => {
          return new Promise(() => [])
        }}
        updateDataAndStateData={updateDataAndStateData}
      />
    </QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome page initially', async () => {
    const mockWelcomeInterrogation = {
      stateData: {
        currentPage: PAGE_TYPE.WELCOME,
        state: 'INIT',
        date: Date.now(),
      },
      data: {},
      id: 'welcome-interrogation-id',
    } as Interrogation

    const { getByText } = await renderWithRouter(
      <OrchestratorTestWrapper
        mode={MODE_TYPE.COLLECT}
        initialInterrogation={mockWelcomeInterrogation}
      />,
    )

    expect(getByText(/Welcome Page/)).toBeInTheDocument()
  })

  it('should render navigation component', async () => {
    const { getByRole } = await renderWithRouter(
      <OrchestratorTestWrapper mode={MODE_TYPE.COLLECT} />,
    )

    expect(getByRole('button', { name: /Next/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /Previous/i })).toBeInTheDocument()
  })

  it('should render data download component', async () => {
    const { getByRole } = await renderWithRouter(
      <OrchestratorTestWrapper mode={MODE_TYPE.COLLECT} />,
    )

    expect(getByRole('button', { name: /Download data/i })).toBeInTheDocument()
  })
})
