import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Global styles — order matters: tokens → fonts → base → transitions
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/base.css'
import './styles/transitions.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
