import type { LunaticSource } from '@inseefr/lunatic'
import { createFileRoute } from '@tanstack/react-router'

import Orchestrator from '@/features/orchestrator/Orchestrator'

import source from '../source.json' with { type: 'json' }

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <Orchestrator source={source as LunaticSource} />
}
