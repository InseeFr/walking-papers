import { useEffect } from 'react'

import { useEvent } from './useEvent'

const actions = new Set<() => Promise<void> | void>()

/* 
  Execute pre-logout actions, i.e only save data for now (from Stromae-DSFR)
  We need to create this because the exit button is not in an orchestrator component 
  Another solution would be using a context, but I am not sure if it's a good idea anyway
*/
export async function executePreLogoutActions() {
  for (const action of actions) {
    await action()
  }
}

export function useAddPreLogoutAction(
  action: () => Promise<void> | void,
): void {
  const stableAction = useEvent(action)
  useEffect(() => {
    actions.add(stableAction)
    return () => {
      actions.delete(stableAction)
    }
  }, [stableAction])
}
