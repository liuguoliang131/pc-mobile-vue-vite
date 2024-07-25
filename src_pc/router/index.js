import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// 路由守卫
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
  document.title = '憨猴链生态浏览器'
})


export default router
