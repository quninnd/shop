import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './css/gloab.css'
import '../public/fonts/iconfont.css'
// import './plugins/element.js'
import axios from 'axios'
// 导入富文本编辑器及其相关样式
import quillEditor from 'vue-quill-editor' // 调用编辑器
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 格子树形表格
import ZkTable from 'vue-table-with-tree-grid'
// 导入进度条效果
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css' // 样式必须引入

Vue.use(quillEditor)

Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

const token = sessionStorage.getItem('token')

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.defaults.headers.Authorization = token

axios.interceptors.request.use(config => {
  Nprogress.start()
  return config
})

axios.interceptors.response.use(res => {
  Nprogress.done()
  return res
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
