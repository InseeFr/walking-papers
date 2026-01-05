import { useTranslation } from 'react-i18next'

/**
 * Initial page displayed to the user when they start the survey
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
