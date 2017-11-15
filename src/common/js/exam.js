//import Vue from 'vue'
//import axios from 'axios'
//import VueAxios from 'vue-axios'
//Vue.use(VueAxios, axios)
export default class jurisdiction_list {
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

export function createJurisdictionList(item) {
  return new jurisdiction_list({
    approval_id: item.approval_id,
    name: item.name,
    avatar: 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns',
    company_name:item.company_name,
    add_time:item.add_time,
    type:item.type,
    title:item.title
  })
}

