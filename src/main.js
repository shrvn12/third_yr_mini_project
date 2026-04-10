import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App).use(createPinia())
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
app.use(router)
app.mount('#app')