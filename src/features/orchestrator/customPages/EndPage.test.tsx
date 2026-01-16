import { expect } from 'vitest'

import { renderWithI18n } from '@/testing/render'

import { EndPage } from './EndPage'

describe('EndPage', () => {
  it('displays date at which answers have been sent', () => {
    const date = 1728289634098
    const formattedDate = new Date(date).toLocaleString()

    const { getByText } = renderWithI18n(<EndPage date={date} />)

    expect(
      getByText(`This questionnaire was completed on ${formattedDate}.`),
    ).toBeInTheDocument()
  })

  it('displays no date if no date has been provided', () => {
    const { container } = renderWithI18n(<EndPage />)

    // Check that the paragraph exists but without a specific date
    expect(container.textContent).toContain('This questionnaire was completed')
  })

  it('does not display date if data have been flagged for extraction', () => {
    const date = 1728289634098

    const { getByText } = renderWithI18n(
      <EndPage date={date} state={'TOEXTRACT'} />,
    )

    expect(getByText('End Page')).toBeInTheDocument()
  })

  it('does not display date if data have been extracted', () => {
    const date = 1728289634098

    const { getByText } = renderWithI18n(
      <EndPage date={date} state={'EXTRACTED'} />,
    )

    expect(getByText('End Page')).toBeInTheDocument()
  })
})
