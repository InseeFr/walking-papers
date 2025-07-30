import userEvent from '@testing-library/user-event'

import { renderWithI18n } from '@/testing/render'

import DataDownload from './DataDownload'
import { downloadFile } from './utils/file'

vi.mock('./utils/file', () => ({
  downloadFile: vi.fn(),
}))

describe('DataDownload', () => {
  it('trigger data download when button is clicked', async () => {
    const user = userEvent.setup()
    const foo = vi.fn().mockReturnValue({ hello: 'world' })
    const { getByRole } = renderWithI18n(<DataDownload getData={foo} />)

    await user.click(getByRole('button', { name: /Download data/i }))
    expect(foo).toHaveBeenCalledOnce()
    expect(downloadFile).toHaveBeenCalledWith({ hello: 'world' })
  })
})
