import HomeView from '../views/HomeView.vue'
import Info from '../views/InfoView.vue'
export default [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/info',
    name: 'info',
    component: Info
  }
]