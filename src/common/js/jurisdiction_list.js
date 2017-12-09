import {getPic} from '@/common/js/pic.js'
export default class jurisdiction_list {
  constructor({uid, name,avatar}) {
    this.uid = uid
    this.name = name
    this.avatar = avatar
  }
}
function getAvatar(str) {
	return ''
}

export function createJurisdictionList(item) {
  return new jurisdiction_list({
    uid: item.uid,
    name: item.name,
    avatar: getPic(item.avatar)
  })
}

