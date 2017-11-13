import * as types from './mutation-types'

const mutations = {
  [types.SET_USER](state, user) {
    state.user = user
  },
  [types.SET_NOWCOMPANY_ID](state,nowCompanyId) {
  	state.nowCompanyId = nowCompanyId
  }
}

export default mutations