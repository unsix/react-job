import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
const STORAGE_KEY='todos-vuejs'
Vue.use(Vuex)


export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
//   fetch(){
//     return JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'[]')
// },
// save(items){
//     window.localStorage.setItem(STORAGE_KEY,JSON.stringify(catherreson))
// }
})
