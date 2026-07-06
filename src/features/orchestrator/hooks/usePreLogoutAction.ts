import { useEffect } from 'react'

import { useEvent } from '@/hooks/useEvent'

const actions = new Set<() => Promise<void> | void>()

/* 
  Execute pre-logout actions, i.e only save data for now (from Stromae-DSFR)
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
