import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './css/gloab.css'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
