// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: [
        'back',
        'card',
        'front',
        'normal',
        'muted',
        'border-highlight',
        'border-normal',
        'border-muted',
        'hover',
        'action-primary',
        'action-secondary',
        'danger',
        'warning',
        'success',
        'info',
      ],
    },
  },
});
