import type { LunaticSource } from '@inseefr/lunatic'
import { createFileRoute } from '@tanstack/react-router'

import { getGetQuestionnaireDataQueryOptions } from '@/api/03-questionnaires'
import { getInterrogationById } from '@/api/06-interrogations'
import ErrorPage from '@/components/ErrorPage'
import { InterrogationPage } from '@/features/interrogation/InterrogationPage'
import { protectedRouteLoader } from '@/loader/protectedLoader'
import type { Interrogation } from '@/models/interrogation'

export const Route = createFileRoute('/interrogations/$interrogationId')({
  beforeLoad: async () => protectedRouteLoader(),
  component: () => <InterrogationPage />,
  loader: async ({
    params: { interrogationId },
    context: { queryClient },
    abortController,
  }) => {
    const interrogation = (await getInterrogationById(
      interrogationId,
      undefined,
      abortController.signal,
    )) as Interrogation

    if (!interrogation.questionnaireId) {
      throw new Error(
        `Missing questionnaireId in interrogation ${interrogationId}`,
      )
    }

    const source = await queryClient
      .ensureQueryData(
        getGetQuestionnaireDataQueryOptions(interrogation.questionnaireId, {
          request: { signal: abortController.signal },
        }),
      )
      .then((e) => e as unknown as LunaticSource)

    return {
      source,
      interrogation,
    }
  },
  errorComponent: ({ error }) => {
    return (
      <ErrorPage
        error={error}
        reset={function (): void {
          throw new Error('Function not implemented.')
        }}
      />
    )
  },
})
