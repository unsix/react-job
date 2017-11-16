//import Vue from 'vue'
//import axios from 'axios'
//import VueAxios from 'vue-axios'
//Vue.use(VueAxios, axios)
export default class exam_list {
  constructor({approval_id, name,avatar,company_name,add_time,type,title}) {
    this.approval_id = approval_id
    this.name = name
    this.avatar = avatar
    this.company_name = company_name
    this.add_time = add_time
    this.type = type
    this.title = title
  }
}
function get_data(time){
	return `${time.slice(0,4)}年${time.slice(5,7)}月${time.slice(8,10)}日
	${time.slice(11)}`
}

export function create_exam_list(item) {
  return new exam_list({
    approval_id: item.approval_id,
    name: item.name,
    avatar: 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns',
    company_name:item.company_name,
    add_time:get_data(item.add_time),
    type:get_type(item.type),
    title:item.title
  })
}

function get_type(type){
	if(type === '0'){
		return '请款单'
	}else if(type === '2'){
		return '家装'
	}else if(type === '3'){
		return '家装请购单'
	}else if(type === '5'){
		return '申请公章'
	}else if(type === '6'){
		return '呈批件'
	}else if(type === '7'){
		return '工装请购'
	}else if(type === '8'){
		return '请款单'
	}else if(type === '9'){
		return '其他请款'
	}

}