import { useTranslation } from 'react-i18next'

import type { StateData } from '@/models/stateData'

/**
 * Page displayed when the user finishes the survey
 */
export function EndPage({
  date,
  state,
}: Readonly<{
  date?: number
  state?: StateData['state']
}>) {
  const formattedDate = date ? new Date(date).toLocaleString() : undefined

  // Check to see ensure the survey has only been validated and not marked for extraction or extracted
  const isDateStillValid = state !== 'TOEXTRACT' && state !== 'EXTRACTED'
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('endPage.title')}</h1>
      <p>
        {t('endPage.paragraph', {
          formattedDate: isDateStillValid ? formattedDate : undefined,
        })}
      </p>
    </div>
  )
}
