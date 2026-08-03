import { useCallback, useInsertionEffect, useRef } from 'react'

export function useEvent<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
): (...args: Args) => Return {
  const ref = useRef(callback)
  useInsertionEffect(() => {
    ref.current = callback
  })
  return useCallback((...args: Args) => ref.current(...args), [])
}
