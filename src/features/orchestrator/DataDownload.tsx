import { useTranslation } from 'react-i18next'

import Button from '@/components/Button'
import DownloadIcon from '@/components/icons/DownloadIcon'

import { downloadFile } from './utils/file'

interface Props {
  getData: (enable: boolean) => object
}

export default function DataDownload({ getData }: Readonly<Props>) {
  const { t } = useTranslation()

  function handleClick() {
    const data = getData(true)
    downloadFile(data)
  }

  return (
    <Button onClick={handleClick} IconLeft={<DownloadIcon />}>
      {t('common.downloadData')}
    </Button>
  )
}
