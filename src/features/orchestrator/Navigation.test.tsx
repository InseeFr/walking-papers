import userEvent from '@testing-library/user-event'

import { renderWithI18n } from '@/testing/render'

import Navigation from './Navigation'

describe('Navigation', () => {
  it('trigger navigation functions when buttons are clicked', async () => {
    const user = userEvent.setup()
    const foo = vi.fn()
    const bar = vi.fn()
    const { getByRole } = renderWithI18n(
      <Navigation onNext={foo} onPrevious={bar} />,
    )

    await user.click(getByRole('button', { name: /Next/i }))
    expect(foo).toHaveBeenCalledOnce()

    await user.click(getByRole('button', { name: /Previous/i }))
    expect(bar).toHaveBeenCalledOnce()
  })

  it('show validate label on last page', async () => {
    const user = userEvent.setup()
    const foo = vi.fn()
    const { getByRole } = renderWithI18n(
      <Navigation onNext={foo} onPrevious={vi.fn()} isLastPage />,
    )

    expect(getByRole('button', { name: /Validate data/i })).toBeEnabled()

    await user.click(getByRole('button', { name: /Validate data/i }))
    expect(foo).toHaveBeenCalledOnce()
  })

  it('disable previous on first page', async () => {
    const user = userEvent.setup()
    const foo = vi.fn()
    const { getByRole } = renderWithI18n(
      <Navigation onNext={vi.fn()} onPrevious={foo} isFirstPage />,
    )

    expect(getByRole('button', { name: /Previous/i })).toBeDisabled()

    await user.click(getByRole('button', { name: /Previous/i }))
    expect(foo).not.toHaveBeenCalledOnce()
  })
})
