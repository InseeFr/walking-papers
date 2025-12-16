import { useTranslation } from 'react-i18next'

/**
 * Page displayed when the user finishes the survey before they submit their
 * answers
 */
export function WelcomePage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('welcomePage.title')}</h1>
      <p>{t('welcomePage.paragraph')}</p>
    </div>
  )
}
