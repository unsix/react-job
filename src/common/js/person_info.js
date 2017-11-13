
export default class person_info {
  constructor({uid, name,avatar, personnel_id, department_name}) {
    this.uid = uid
    this.name = name
    this.avatar = avatar
    this.personnel_id = personnel_id
    this.department_name = department_name
  }
}
function getAvatar(str) {
	if(str.indexOf('jpg') !== -1) {
		return 'http://img-bbsf.6655.la/FnF0MmO7g-WONz-QYU6BsWMTwNR_'
	} else {
		return 'http://img-bbsf.6655.la/' + str
	}
}
export function createPersonInfo(item) {
  return new person_info({
    uid: item.uid,
    name: item.name,
    avatar: getAvatar(item.avatar),
    personnel_id: item.personnel_id,
    department_name: item.department_name
  })
}

