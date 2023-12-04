// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/': {prerender: true},
    '/api/*': { cache: {maxAge: 60 * 60} },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
})
