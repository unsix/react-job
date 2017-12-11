import {getAvatar} from '@/common/js/avatar.js'
export default class person_info {
  constructor({uid, name,avatar, personnel_id, department_name,phone,is_manage}) {
    this.uid = uid
    this.name = name
    this.avatar = avatar
    this.personnel_id = personnel_id
    this.department_name = department_name
    this.phone = phone
    this.is_manage = is_manage
  }
}
export function createPersonInfo(item) {
  return new person_info({
    uid: item.uid,
    name: item.name,
    avatar: getAvatar(item.avatar),
    personnel_id: item.personnel_id,
    department_name: item.department_name,
    phone: item.phone,
    is_manage: item.is_manage
  })
}

