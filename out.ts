interface pxRequest {
  requestId: string
  planId: string
  fanUserId: null
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
