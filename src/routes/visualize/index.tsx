import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { sourceQueryOptions } from '@/api/visualizeQueryOptions'
import { VisualizePage } from '@/features/visualize/Visualize'

const visualizeSearchSchema = z
  .object({
    source: z.string().transform(decodeURIComponent).optional(),
    nomenclature: z
      .record(z.string(), z.string().transform(decodeURIComponent))
      .optional(),
  })
  .optional()

export const Route = createFileRoute('/visualize/')({
  validateSearch: (search) => visualizeSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    sourceUrl: search?.source,
    nomenclature: search?.nomenclature,
  }),
  loader: async ({
    context: { queryClient },
    deps: { sourceUrl, nomenclature },
    abortController,
  }) => {
    if (!sourceUrl) {
      return
    }

    const sourcePr = queryClient.ensureQueryData(
      sourceQueryOptions(sourceUrl, { signal: abortController.signal }),
    )

    const source = await sourcePr
    return { source, nomenclature }
  },
  component: () => <VisualizePage />,
})
