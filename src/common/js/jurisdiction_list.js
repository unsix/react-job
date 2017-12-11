import {getAvatar} from '@/common/js/avatar.js'
export default class jurisdiction_list {
  constructor({uid, name,avatar}) {
    this.uid = uid
    this.name = name
    this.avatar = avatar
  }
}

export function createJurisdictionList(item) {
  return new jurisdiction_list({
    uid: item.uid,
    name: item.name,
    avatar: getAvatar(item.avatar)
  })
}

