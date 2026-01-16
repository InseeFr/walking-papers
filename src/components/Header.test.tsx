import { renderWithI18n } from '@/testing/render'

import Header from './Header'

describe('Header', () => {
  beforeEach(() => {
    vi.stubEnv('APP_VERSION', '1.0.0')
    vi.stubEnv('LUNATIC_VERSION', '^3.6.9')
  })

  it('display app name', async () => {
    const { getByText } = renderWithI18n(<Header />)
    expect(getByText(/Walking Papers/i)).toBeInTheDocument()
  })

  it('display version info in tooltip', async () => {
    const { getByText } = renderWithI18n(<Header />)
    expect(getByText('Version 1.0.0 | Lunatic 3.6.9')).toBeInTheDocument()
  })
})
