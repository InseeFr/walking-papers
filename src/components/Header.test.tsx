import { renderWithI18n } from '@/testing/render'

import Header from './Header'

describe('Header', () => {
  it('display app name', async () => {
    const { getByText } = renderWithI18n(<Header />)
    expect(getByText(/Orchestrateur de saisie papier/i)).toBeInTheDocument()
  })
})
