import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './css/gloab.css'
import '../public/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false

const token = sessionStorage.getItem('token')

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.defaults.headers.Authorization = token

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
