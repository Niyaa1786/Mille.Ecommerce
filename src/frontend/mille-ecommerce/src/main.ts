import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService, ToastService } from 'primevue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
  license: import.meta.env.VITE_LICENSE_KEY,
})
app.use(ConfirmationService)
app.use(ToastService)
app.use(createPinia())
app.use(router)

app.mount('#app')
