import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t } = useTranslation()

  return (
    <div className="h-16 bg-gray-800 border-b relative flex items-center justify-end px-4">
      <span className="font-bold text-xl text-white absolute left-1/2 transform -translate-x-1/2">
        {t('common.appName')}
      </span>
      <span className="text-white italic">
        Version {import.meta.env.APP_VERSION} | Lunatic{' '}
        {import.meta.env.LUNATIC_VERSION.replace('^', '')}
      </span>
    </div>
  )
}
