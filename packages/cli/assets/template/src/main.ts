import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/vue-kit.css'
import { initializeTheme } from './composables/useTheme'

initializeTheme()
createApp(App).use(router).mount('#app')
