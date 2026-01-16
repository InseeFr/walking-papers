import { useTranslation } from 'react-i18next'

import Button from '@/components/Button'
import DialogButton from '@/components/DialogButton'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

interface Props {
  onNext: () => void
  onPrevious: () => void
  isFirstPage?: boolean
  isLastPage?: boolean
}

export default function Navigation({
  onNext,
  onPrevious,
  isFirstPage = false,
  isLastPage = false,
}: Readonly<Props>) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-x-6">
      <Button
        onClick={onPrevious}
        disabled={isFirstPage}
        IconLeft={<ArrowLeftIcon />}
      >
        {t('common.previous')}
      </Button>
      {isLastPage ? (
        <DialogButton
          onValidate={onNext}
          label={t('common.validateData')}
          title={t('validate.title')}
          body={t('validate.label')}
        />
      ) : (
        <Button onClick={onNext} IconRight={<ArrowRightIcon />}>
          {t('common.next')}
        </Button>
      )}
    </div>
  )
}
