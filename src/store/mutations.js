import * as types from './mutation-types'

const mutations = {
  [types.SET_USER](state, user) {
    state.user = user
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
  }
}

export default mutations