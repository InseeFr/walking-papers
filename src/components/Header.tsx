import { useState } from 'react'

import { useMatch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { executePreLogoutActions } from '@/hooks/usePreLogoutAction'

import Button, { ButtonStyle } from './Button'
import Dialog from './Dialog'
import ExitIcon from './icons/ExitIcon'

export default function Header() {
  const { t } = useTranslation()

  const interrogationMatch = useMatch({
    from: '/interrogations/$interrogationId',
    shouldThrow: false,
  })

  const platineGestionUrl = import.meta.env.VITE_PLATINE_GESTION_URL

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleGoToInterrogation = () => {
    if (interrogationMatch?.params?.interrogationId) {
      setIsDialogOpen(true)
    }
  }

  const handleSaveAndLeave = async () => {
    if (!interrogationMatch?.params?.interrogationId) return

    await executePreLogoutActions()
    window.location.href = `${platineGestionUrl}interrogation/${interrogationMatch.params.interrogationId}`
  }

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
        {interrogationMatch && platineGestionUrl && (
          <>
            <Button
              buttonStyle={ButtonStyle.Transparent}
              onClick={handleGoToInterrogation}
              IconLeft={<ExitIcon />}
            >
              {t('common.goToPlatineGestion')}
            </Button>
            <Dialog
              title={t('common.leaveConfirmation')}
              body={t('common.leaveBody')}
              onCancel={() => setIsDialogOpen(false)}
              onValidate={handleSaveAndLeave}
              controlledOpen={isDialogOpen}
              setControlledOpen={setIsDialogOpen}
              validateLabel={t('common.leaveAndSave')}
              loadingLabel={t('common.saving')}
            />
          </>
        )}
      </div>
    </div>
  )
}
