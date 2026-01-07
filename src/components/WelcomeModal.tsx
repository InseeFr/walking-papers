import { useTranslation } from 'react-i18next'

import Dialog from '@/components/Dialog'

interface WelcomeModalProps {
  onValidate: () => void
  onCancel: () => void
  open?: boolean
  setOpen?: (open: boolean) => void
}

/**
 * A welcome dialog used to warn the user that they have already started
 * the questionnaire, and allow them to either continue where they
 * left off or start over.
 */
export default function WelcomeModal({
  onValidate,
  onCancel,
  open,
  setOpen,
}: Readonly<WelcomeModalProps>) {
  const { t } = useTranslation()

  return (
    <Dialog
      title={t('welcomeModal.title')}
      body={t('welcomeModal.label')}
      onValidate={onValidate}
      onCancel={onCancel}
      controlledOpen={open}
      setControlledOpen={setOpen}
      validateLabel={t('welcomeModal.resume')}
      cancelLabel={t('welcomeModal.backToStart')}
    />
  )
}
