/**only visible to account owne, else it's just null*/
interface PrivacyLevlUserInfo {
  name: string | null,
  privacyLevel: string | null
}
interface UserCountry extends PrivacyLevlUserInfo {
  prefecture: null,
  region: string
}
interface UserSocialMeta {
  url: string
}
interface User {
  acceptRequests: boolean,
  age: PrivacyLevlUserInfo,
  /**User background url*/
  background: string | null,
  canSendMessage: true,
  /**aka about me*/
  comment: string,
  /**about me but more vulnerable*/
  commentHtml: string,
  followedBack: boolean,
  following: number,
  gender: PrivacyLevlUserInfo,
  group: null,
  image: string,
  imageBig: string,
  isBlocking: boolean,
  isFollowed: boolean,
  isMypixiv: boolean,
  job: PrivacyLevlUserInfo,
  mypixivCount: number,
  name: string,
  official: boolean,
  partial: number,
  premium: boolean,
  region: UserCountry,
  sketchLiveId: null | number | string,
  sketchLives: any[], // todo: find someone who did
  social: Record<string, UserSocialMeta>,
  userId: string,
  webpage: string | null,
  workspace: string | null
}
