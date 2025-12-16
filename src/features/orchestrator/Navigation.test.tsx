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

  it('shows validate data on validation page', async () => {
    const user = userEvent.setup()
    const foo = vi.fn()
    const { getByRole } = renderWithI18n(
      <Navigation
        onNext={foo}
        onPrevious={vi.fn()}
        currentPageType="validationPage"
      />,
    )
    expect(getByRole('button', { name: /Validate Data/i })).toBeInTheDocument()
    await user.click(getByRole('button', { name: /Validate Data/i }))
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
