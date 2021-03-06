import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login'
// import Home from '../components/Home'
// import Welcome from '../components/welcome'
// import Users from '../components/users/user'
// import Roles from '../components/rights/rights_role'
// import RightsList from '../components/rights/rights_list'
// import GoodsList from '../components/goods/goods_list'
// import addGood from '../components/goods/addGood'
// import GoodCategories from '../components/goods/goods_categories'
// import GoodParams from '../components/goods/goods_params'
// import Orders from '../components/orders/orders'
// import Reports from '../components/report/report'

const Login = () => import(/* webpackChunkName: "Login" */ '../components/login')
const Welcome = () => import(/* webpackChunkName: "Home-Welcome" */ '../components/welcome')
const Home = () => import(/* webpackChunkName: "Home-Welcome" */ '../components/Home')
const Users = () => import(/* webpackChunkName: "User" */ '../components/users/user')
const Roles = () => import(/* webpackChunkName: "Roles-RightsList" */ '../components/rights/rights_role')
const RightsList = () => import(/* webpackChunkName: "Roles-RightsList" */ '../components/rights/rights_list')
const GoodsList = () => import(/* webpackChunkName: "Goods" */ '../components/goods/goods_list')
const addGood = () => import(/* webpackChunkName: "Goods" */ '../components/goods/addGood')
const GoodCategories = () => import(/* webpackChunkName: "Goods" */ '../components/goods/goods_categories')
const GoodParams = () => import(/* webpackChunkName: "Goods" */ '../components/goods/goods_params')
const Orders = () => import(/* webpackChunkName: "Orders" */ '../components/orders/orders')
const Reports = () => import(/* webpackChunkName: "Reports" */ '../components/report/report')

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
      { path: '/goods', component: GoodsList },
      { path: '/addGood', component: addGood },
      { path: '/categories', component: GoodCategories },
      { path: '/params', component: GoodParams },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
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
