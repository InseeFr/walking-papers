import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import './libs/i18n'
import { routeTree } from './routeTree.gen'

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: 'always',
    },
  },
})

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } })

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
