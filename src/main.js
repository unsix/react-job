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
import VueJsonp from 'vue-jsonp'
import 'vue-croppa/dist/vue-croppa.css'
import croppa from 'vue-croppa'
import getPost from '@/common/js/http'
import getCro from '@/common/js/crowd'
import './assets/icon/iconfont.css'
Vue.prototype.$test = getPost
Vue.prototype.$testLogin = getCro
Vue.use(croppa)
Vue.use(Vuex)
Vue.use(VueJsonp)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Calendar)
// Vue.use(Viewer)
// Viewer.setDefaults({
//   Options: { "inline": true, "button": false, "navbar": false, "title": false, "toolbar": false, "tooltip": false, "movable": false, "zoomable": false, "rotatable": false, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
// });
// Viewer.setDefaults({
//   zIndexInline: 2017
// })
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
