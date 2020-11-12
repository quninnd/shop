import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/Home'
import Welcome from '../components/welcome'
import Users from '../components/users/user'
import Roles from '../components/rights/rights_role'
import RightsList from '../components/rights/rights_list'
import GoodsList from '../components/goods/goods_list'

Vue.use(VueRouter)

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: RightsList },
      { path: '/goods', component: GoodsList }
    ]
  }
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
