import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t } = useTranslation()

  return (
    <div className="h-16 bg-gray-800 border-b content-center text-center">
      <span className="font-bold text-xl text-white">
        {t('common.appName')}
      </span>
    </div>
  )
}
