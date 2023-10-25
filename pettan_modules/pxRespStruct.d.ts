// Regular stuff
interface pxZoneConfig {
  url: string
}
interface pxTagTranslations {
  romaji?: string,
  en?: string,
  ko?: string,
  ja?: string,
  zh?: string,
  zh_tw?: string
}
/**also known as thumbnails in response*/
interface pxWorks {
  illust: pxIllustration[],
  novel: null[]
}
//Users

/**only visible to account owne, else it's just null*/
interface pxPrivacyLevelUserInfo {
  name: string | null,
  privacyLevel: string | null
}
interface pxUserCountry extends pxPrivacyLevelUserInfo {
  prefecture: null,
  region: string
}
interface pxUserSocialMeta {
  url: string
}
interface pxUser {
  acceptRequests: boolean,
  age: pxPrivacyLevelUserInfo,
  /**User background url*/
  background: string | null,
  canSendMessage: true,
  /**aka about me*/
  comment: string,
  /**about me but more vulnerable*/
  commentHtml: string,
  followedBack: boolean,
  following: number,
  gender: pxPrivacyLevelUserInfo,
  group: null,
  /**pfp*/
  image: string,
  /**orig pfp*/
  imageBig: string,
  isBlocking: boolean,
  isFollowed: boolean,
  isMypixiv: boolean,
  job: pxPrivacyLevelUserInfo,
  mypixivCount: number,
  name: string,
  /**Is user an official account (like pixiv and related service or smth)*/
  official: boolean,
  /**Is this is a partial data (Available partials in [UserPartial]{@link UserPartial})*/
  partial: 0,
  premium: boolean,
  region: UserCountry,
  sketchLiveId: null | number | string,
  sketchLives: any[], // todo: find someone who did
  social: Record<string, pxUserSocialMeta>,
  userId: string,
  webpage: string | null,
  workspace: string | null
}
interface pxUserPartial {
  mypixivCount: number,
  name: string,
  /**Is user an official account (like pixiv and related service or smth)*/
  official: boolean,
  /**Is this is a partial data (Full data in [UserPartial]{@link User})*/
  partial: 1,
}

// Works 
interface pxIllustration {
  id: string
  title: string
  illustType: number
  xRestrict: number
  restrict: number
  sl: number
  url: string
  description: string
  tags: string[]
  userId: string
  userName: string
  width: number
  height: number
  pageCount: number
  isBookmarkable: boolean
  bookmarkData: null // unknown yet
  alt: string
  titleCaptionTranslation: {
    workTitle: string | null
    workCaption: string | null
  }
  createDate: string
  updateDate: string
  isUnlisted: boolean
  isMasked: boolean
  aiType: number
  urls: {       
    "250x250": string
    "360x360": string
    "540x540": string
  }
  /**author profile image*/
  profileImageUrl: string
}

// Requests
interface pxRequestOGP {
  title: string,
  description: string,
  url: string,
  image: string,
}
interface pxRequestPageMetadata {
  creator: {
    creatorUserId: string,
    creatorStoppedFlg: boolean,
    /**min price*/
    requestPriceLowerLimit: number,
    /**max price*/
    requestPriceUpperLimit: number,
    tokusho: null
  },
  recommendedUserIds: number[],
  confettiModalStatus: {
    inProgressFan: boolean,
    inProgressCreator: boolean,
    completeFanOrCollaborateUser: boolean
  },
  userList: {
    id: string,
    /**illust ids to use as 3 image in user profile component*/
    illustIds: string[]
  }[],
  /**reqs in progress*/
  inProgressRequestIds: string[],
  /**the*/
  completeRequestIds: string[],
  alreadyRequestCollaborate: boolean,
  platformFeeCampaignLabel: null,
  /**find another req, current type is unknown*/
  eligibleCampaignList: string[],
  isUnlisted: boolean,
  ogp: {
    twitter_card: pxRequestOGP & {card: string},
    meta_ogp: pxRequestOGP & {type: "website"},
    page_title: string,
    description: string,
  },
}
interface pxRequestFetchBody {
  page: pxRequestPageMetadata,
  zoneConfig: Record<string, pxZoneConfig>,
  tagTranslation: Record<string, pxTagTranslations>,
  thumbnails: pxWorks,
  illustSeries: null[],
  requests: pxRequest[],
  users: User[]
}
interface pxRequest {
  requestId: string
  planId: string
  /**null if anonymous*/
  fanUserId: string | null
  creatorUserId: string
  requestStatus: string
  requestAcceptStatus: string
  requestPostWorkType: string
  requestPrice: number
  requestProposal: {        
    requestOriginalProposal: string
    requestOriginalProposalHtml: string
    requestOriginalProposalLang: string
    requestTranslationProposal: {            
      requestProposal: string
      requestProposalHtml: string
      requestProposalLang: string
    }[]
  }
  requestTags: string[]
  requestAdultFlg: boolean
  requestAnonymousFlg: boolean
  requestRestrictFlg: boolean
  requestAcceptCollaborateFlg: boolean
  requestResponseDeadlineDatetime: string
  requestPostDeadlineDatetime: string
  role: string
  plan: {        
    currentPlanId: null
    planId: string
    creatorUserId: string
    planAcceptRequestFlg: boolean
    planStandardPrice: number
    planTitle: {            
      planOriginalTitle: string
      planOriginalTitleLang: string
      planTranslationTitle: Record<string, {planTitle: string, planTtieLang: string}>
    }
    planDescription: {
      planOriginalDescription: string
      planOriginalDescriptionHtml: string
      planOriginalLang: string
      planTranslationDescription: Record<string, { planDescription: string,planDescriptionHtml: string, planLang: string}>
    }
    planAcceptAdultFlg: boolean
    planAcceptAnonymousFlg: boolean
    planAcceptIllustFlg: boolean
    planAcceptUgoiraFlg: boolean
    planAcceptMangaFlg: boolean
    planAcceptNovelFlg: boolean
    planCoverImage: null
    planAiType: number
  }
  collaborateStatus: {        
    collaborating: boolean
        collaborateAnonymousFlg: boolean
        collaboratedCnt: number
        collaborateUserSamples: null[]
  }
  giftFile: null
  postWork: null
  notifyBadge: null
  fanbox: { 
    fanIsSupporter: boolean
  }
  requestResend: {
    requestResendDeadlineDatetime: null
    requestResendOfferEnabled: null
    requestResendEnabled: null
    requestResendStatus: null
    modification: { 
      requestPostWorkType: null
      requestAdultFlg: null
    }
    fanAdultSendable: null
    isResentRequest: null
  }
  fanLetter: {
    fanLetterArrived: boolean
    fanLetterSendEnabled: boolean
  }
}
