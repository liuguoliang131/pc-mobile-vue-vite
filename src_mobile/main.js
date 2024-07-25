import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.less'
import './common/rem'

const vueApp = createApp(App)
if (import.meta.env.VITE_SELF_ENV === 'prod') {
  window.console.log = function () { };
}
vueApp.use(router).mount('#app')
