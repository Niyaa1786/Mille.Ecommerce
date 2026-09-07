import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService, ToastService } from 'primevue'
import { definePreset, type Preset } from '@primeuix/themes'

const MinimalistIndigoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eep2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
  },
})

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: MinimalistIndigoPreset,
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
