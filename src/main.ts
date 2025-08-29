import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore()
await authStore.loadFromStorage()

app.use(router)
app.mount('#app')
