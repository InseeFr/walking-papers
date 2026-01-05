import type { LunaticState } from '@inseefr/lunatic'

export enum PAGE_TYPE {
  WELCOME = 'welcomePage',
  VALIDATION = 'validationPage',
  END = 'endPage',
  LUNATIC = 'lunaticPage',
}

export type NirvanaPage = PAGE_TYPE.END

export type PageType = NirvanaPage | LunaticState['pageTag']
