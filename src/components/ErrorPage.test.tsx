import { renderWithI18n } from '@/testing/render'

import ErrorPage from './ErrorPage'

describe('ErrorPage', () => {
  it('display error message', async () => {
    const { getByText } = renderWithI18n(
      <ErrorPage
        error={{ name: 'Error', message: 'message of error' }}
        reset={() => {}}
      />,
    )
    expect(getByText(/Error : message of error/i)).toBeInTheDocument()
  })
})
