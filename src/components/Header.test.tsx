import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { executePreLogoutActions } from '@/features/orchestrator/hooks/usePreLogoutAction'
import { renderWithI18n } from '@/testing/render'

import Header from './Header'

interface InterrogationMatch {
  params: {
    interrogationId: string
  }
}

const mockUseMatch = vi.hoisted(() =>
  vi.fn<(...args: object[]) => InterrogationMatch | undefined>(),
)

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    useMatch: mockUseMatch,
  }
})

vi.mock('@/features/orchestrator/hooks/usePreLogoutAction', () => ({
  executePreLogoutActions: vi.fn(),
}))

describe('Header', () => {
  beforeEach(() => {
    vi.stubEnv('APP_VERSION', '1.0.0')
    vi.stubEnv('LUNATIC_VERSION', '^3.6.9')
    vi.stubEnv('VITE_BASE_EXIT_URL', '')
    mockUseMatch.mockReturnValue(undefined)
  })

  it('display app name', async () => {
    const { getByText } = renderWithI18n(<Header />)
    expect(getByText(/Walking Papers/i)).toBeInTheDocument()
  })

  it('display version info in tooltip', async () => {
    const { getByText } = renderWithI18n(<Header />)
    expect(getByText('Version 1.0.0 | Lunatic 3.6.9')).toBeInTheDocument()
  })

  it('does not show button when redirect URL is not configured', () => {
    mockUseMatch.mockReturnValue({
      params: { interrogationId: 'test-123' },
    })

    renderWithI18n(<Header />)

    expect(
      screen.queryByText('Leave the questionnaire'),
    ).not.toBeInTheDocument()
  })

  it('does not show button when interrogation match is not found', () => {
    vi.stubEnv('VITE_BASE_EXIT_URL', 'https://base-app.url')
    renderWithI18n(<Header />)

    expect(
      screen.queryByText('Leave the questionnaire'),
    ).not.toBeInTheDocument()
  })

  it('shows button when interrogation match is found', () => {
    vi.stubEnv('VITE_BASE_EXIT_URL', 'https://base-app.url')
    mockUseMatch.mockReturnValue({
      params: { interrogationId: 'test-123' },
    })

    renderWithI18n(<Header />)

    expect(screen.getByText('Leave the questionnaire')).toBeInTheDocument()
  })

  it('opens dialog when button is clicked', async () => {
    vi.stubEnv('VITE_BASE_EXIT_URL', 'https://base-app.url')
    const user = userEvent.setup()
    mockUseMatch.mockReturnValue({
      params: { interrogationId: 'test-123' },
    })

    renderWithI18n(<Header />)

    await user.click(screen.getByText('Leave the questionnaire'))

    expect(
      screen.getByRole('button', { name: 'Save and leave' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Do you want to leave the questionnaire? Your data will be saved before leaving.',
      ),
    ).toBeInTheDocument()
  })

  it('closes dialog when cancel is clicked', async () => {
    vi.stubEnv('VITE_BASE_EXIT_URL', 'https://base-app.url')
    const user = userEvent.setup()
    mockUseMatch.mockReturnValue({
      params: { interrogationId: 'test-123' },
    })

    renderWithI18n(<Header />)

    await user.click(screen.getByText('Leave the questionnaire'))
    await user.click(screen.getByText('Cancel'))

    expect(
      screen.queryByRole('button', { name: 'Save and leave' }),
    ).not.toBeInTheDocument()
  })

  it('redirects to base app on save and leave', async () => {
    const BASE_URL = 'https://base-app.url'
    vi.stubEnv('VITE_BASE_EXIT_URL', BASE_URL)
    const user = userEvent.setup()
    mockUseMatch.mockReturnValue({
      params: { interrogationId: 'test-123' },
    })

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    })

    renderWithI18n(<Header />)

    await user.click(screen.getByText('Leave the questionnaire'))
    await user.click(screen.getByRole('button', { name: 'Save and leave' }))

    expect(executePreLogoutActions).toHaveBeenCalledOnce()
    expect(window.location.href).toBe(`${BASE_URL}/interrogation/test-123`)
  })
})
