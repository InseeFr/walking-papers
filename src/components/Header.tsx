import { useTranslation } from 'react-i18next'

import SaveAndExitButton from './SaveAndExitButton'

export default function Header() {
  const { t } = useTranslation()

  return (
    <div className="h-16 bg-gray-800 border-b relative flex items-center justify-between">
      <div className="flex flex-col px-4">
        <span className="font-bold text-xl text-white">
          {t('common.appName')}
        </span>
        <span className="text-white italic text-sm">
          {t('common.version', {
            appVersion: import.meta.env.APP_VERSION,
            lunaticVersion: import.meta.env.LUNATIC_VERSION.replace('^', ''),
          })}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <SaveAndExitButton />
      </div>
    </div>
  )
}
