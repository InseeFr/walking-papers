import { useTranslation } from 'react-i18next'

import Button from '@/components/Button'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import { PAGE_TYPE } from '@/models/pageType'

interface Props {
  onNext: () => void
  onPrevious: () => void
  currentPageType?: string
  isFirstPage?: boolean
  isLastPage?: boolean
}

export default function Navigation({
  onNext,
  onPrevious,
  currentPageType = PAGE_TYPE.LUNATIC,
  isFirstPage = false,
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
      {currentPageType !== PAGE_TYPE.END ? (
        <Button onClick={onNext} IconRight={<ArrowRightIcon />}>
          {currentPageType === PAGE_TYPE.VALIDATION
            ? t('common.validateData')
            : t('common.next')}
        </Button>
      ) : null}
    </div>
  )
}
