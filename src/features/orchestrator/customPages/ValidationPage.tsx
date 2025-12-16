import { useTranslation } from 'node_modules/react-i18next'

/**
 * Page displayed when the user finishes the survey before they submit their
 * answers
 */
export function ValidationPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('validationPage.title')}</h1>
      <p>{t('validationPage.paragraph')}</p>
    </div>
  )
}
