import {getAvatar} from '@/common/js/avatar.js'
export default class jurisdiction_list {
  constructor({uid, name,avatar,sequence_id}) {
    this.uid = uid
    this.name = name
    this.avatar = avatar
    this.sequence_id = sequence_id
  }
}

export function createJurisdictionList(item) {
  return new jurisdiction_list({
    uid: item.uid,
    name: item.name,
    avatar: getAvatar(item.avatar),
    sequence_id:item.sequence_id
  })
}

