// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import crypto from 'crypto'
import md5 from 'js-md5';
import Vuex from 'vuex'
import store from './store'
import Calendar from 'vue-calendar-component'
import $ from 'jquery'
import VueJsonp from 'vue-jsonp'
import 'vue-croppa/dist/vue-croppa.css'
import croppa from 'vue-croppa'
Vue.use(croppa)
Vue.use(Vuex)
Vue.use(VueJsonp)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Calendar)
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
