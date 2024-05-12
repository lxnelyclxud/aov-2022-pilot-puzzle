// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', "@vueuse/nuxt"],
  build: {
    transpile: ['motion/vue', '@motionone/vue']
  },
  routeRules: {
    '/': {
      prerender: true
    }
  }
})