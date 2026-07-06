import { useState } from 'react'

import { useMatch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { executePreLogoutActions } from '@/features/orchestrator/hooks/usePreLogoutAction'

import Button, { ButtonStyle } from './Button'
import Dialog from './Dialog'
import ExitIcon from './icons/ExitIcon'

export default function SaveAndExitButton() {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const interrogationMatch = useMatch({
    from: '/interrogations/$interrogationId',
    shouldThrow: false,
  })

  const exitUrl = import.meta.env.VITE_BASE_EXIT_URL

  const handleGoToInterrogation = () => {
    if (interrogationMatch?.params?.interrogationId) {
      setIsDialogOpen(true)
    }
  }

  const handleSaveAndLeave = async () => {
    if (!interrogationMatch?.params?.interrogationId) return

    await executePreLogoutActions()
    window.location.href = `${exitUrl}/interrogation/${interrogationMatch.params.interrogationId}`
  }

  if (!interrogationMatch || !exitUrl) {
    return null
  }

  return (
    <>
      <Button
        buttonStyle={ButtonStyle.Transparent}
        onClick={handleGoToInterrogation}
        IconLeft={<ExitIcon />}
      >
        {t('common.leaveQuestionnaire')}
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
  )
}
