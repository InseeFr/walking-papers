import { downloadFile } from './file'

describe('downloadFile', () => {
  const createObjectURLMock = vi.fn(() => 'blob:mock-url')
  const revokeObjectURLMock = vi.fn()
  const clickMock = vi.fn()

  beforeEach(() => {
    // Mock global URL object
    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    })

    // Mock anchor element
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        href: '',
        download: '',
        click: clickMock,
      } as unknown as HTMLAnchorElement
    })

    // Mock DOM append/remove child
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    createObjectURLMock.mockClear()
    revokeObjectURLMock.mockClear()
    clickMock.mockClear()
  })

  it('generates valid JSON in blob content', () => {
    let blobContent: string = ''

    vi.stubGlobal('Blob', function (this: unknown, parts: string[]) {
      blobContent = parts[0]
    })

    downloadFile({ foo: 'bar', nums: [1, 2, 3] })

    const parsed = JSON.parse(blobContent)
    expect(parsed).toEqual({ foo: 'bar', nums: [1, 2, 3] })
  })

  it('uses the provided filename', () => {
    const anchorMock = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement

    vi.spyOn(document, 'createElement').mockReturnValue(anchorMock)

    downloadFile({ name: 'test' }, 'custom.json')

    expect(anchorMock.download).toBe('custom.json')
  })

  it('downloads with default filename `data.json` if no provided filename', () => {
    const data = { key: 'value' }

    const anchorMock = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement

    vi.spyOn(document, 'createElement').mockReturnValue(anchorMock)

    downloadFile(data)

    expect(createObjectURLMock).toHaveBeenCalled()
    expect(anchorMock.download).toBe('data.json')
    expect(anchorMock.click).toHaveBeenCalled()
  })

  it('logs an error and skips download if no data', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // @ts-expect-error intentionally passing invalid params
    downloadFile()

    expect(consoleError).toHaveBeenCalledWith('No data to download.')
    expect(clickMock).not.toHaveBeenCalled()
  })
})
