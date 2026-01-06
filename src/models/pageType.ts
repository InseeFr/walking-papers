import type { LunaticState } from '@inseefr/lunatic'

export enum PAGE_TYPE {
  END = 'endPage',
  LUNATIC = 'lunaticPage',
}

export type PageType = PAGE_TYPE.END | LunaticState['pageTag']
