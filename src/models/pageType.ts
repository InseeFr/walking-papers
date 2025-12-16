import type { LunaticState } from '@inseefr/lunatic'


export enum PAGE_TYPE {
    WELCOME = 'welcomePage',
    VALIDATION = 'validationPage',
    END = 'endPage',
    LUNATIC = 'lunaticPage',
}

export type WalkingPaperPage =
    | PAGE_TYPE.WELCOME
    | PAGE_TYPE.VALIDATION
    | PAGE_TYPE.END

export type PageType = WalkingPaperPage | LunaticState['pageTag']

export type InternalPageType = WalkingPaperPage | PAGE_TYPE.LUNATIC
