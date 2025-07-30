import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/libs/i18n'

export const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)
}
