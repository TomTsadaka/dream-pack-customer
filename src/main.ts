import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useSettingsStore } from './stores/settings'
import { watch } from 'vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize settings store
const settingsStore = useSettingsStore()
settingsStore.loadFromStorage()

// Apply initial locale
document.documentElement.lang = settingsStore.locale

// Watch for locale changes and update document attributes
settingsStore.$subscribe((mutation, state) => {
  document.documentElement.lang = state.locale
  // Update i18n locale
  i18n.global.locale.value = state.locale
})

// Initial i18n locale sync
i18n.global.locale.value = settingsStore.locale

app.mount('#app')