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

// Lazy load images directive
app.directive('lazy', {
  mounted(el) {
    const loadImage = () => {
      if (el.dataset.src) {
        el.src = el.dataset.src
        el.classList.add('loaded')
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }, { rootMargin: '50px' })
    
    observer.observe(el)
  }
})

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
