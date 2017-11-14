import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
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
//function _getDepartName(department_id) {
//	let param = new URLSearchParams();
//	param.append("personnel_id", 15);
//	axios.post("/index/Mobile/user/get_company_user_info", param)
//	.then((res) => {
//			return '未分组'
//			if(!res.data.data){
//				return '未分组'
//			}else{
//				return  res.data.data.department_name
//			}
//		})
//}
export function createJurisdictionList(item) {
  return new jurisdiction_list({
    uid: item.uid,
    name: item.name,
    avatar: 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns',
  })
}

