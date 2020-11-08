import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 直接访问login界面 方行
  if (to.path === '/') return next()
  // 直接访问其他页面  判断有没有token字符串 有就放行 没有就强制跳转到login界面
  const token = sessionStorage.getItem('token')
  if (!token) return next('/')
  next()
})

export default router
