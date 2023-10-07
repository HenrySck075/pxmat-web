import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    blueprint: md3,
    ssr: false,
    theme: {
      defaultTheme: "dark"
    },
    options: {
      customProperties: true
    },
    components,
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
