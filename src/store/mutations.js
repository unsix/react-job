import * as types from './mutation-types'

const mutations = {
  [types.SET_USER](state, user) {
    state.user = user
  },
  [types.SET_NOWCOMPANY_NAME](state,nowCompanyName) {
  	state.nowCompanyName = nowCompanyName
  },
  [types.SET_NOWCOMPANY_ID](state,nowCompanyId) {
  	state.nowCompanyId = nowCompanyId
  },
  [types.SET_COM_PERSON_LIST](state,comPersonList) {
  	state.comPersonList = comPersonList
  },
  [types.SET_COM_DEPART_LIST](state,comDepartList) {
  	state.comDepartList = comDepartList
  },
  [types.SET_COM_PART_PERSON_LIST](state,comPartPersonList) {
  	state.comPartPersonList = comPartPersonList
  },
  [types.SET_TOKEN](state,token) {
  	state.token = token
  },
  [types.SET_USERSTATE](state,userState) {
  	state.userState = userState
  },
  [types.SET_COMPANYLIST](state,companyList) {
  	state.companyList = companyList
  },
}

export default mutations