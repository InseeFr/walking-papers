import type { LunaticPageTag } from './lunaticType'

export enum PAGE_TYPE {
  END = 'endPage',
  LUNATIC = 'lunaticPage',
}

export type PageType = PAGE_TYPE.END | LunaticPageTag

export type InternalPageType = PAGE_TYPE.END | PAGE_TYPE.LUNATIC
