import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import App from '@/App.vue'
import router from '@/router/index'
import '@arco-design/web-vue/dist/arco.css'
import '@/assets/styles/tailwind.css'
import { registerGlobalComponents } from '@/components/globalComponents'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVue)
registerGlobalComponents(app)

app.mount('#app')
