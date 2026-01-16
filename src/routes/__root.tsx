import { memo } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '@/components/Header'
import ErrorPage from '@/features/errorPage/ErrorPage'

const RootComponent = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  errorComponent: ErrorPage,
})
