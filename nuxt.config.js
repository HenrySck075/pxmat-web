// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@/mein.css'],
  modules: ["nuxt-proxy-request"],
  build: {
    transpile: ['vuetify'],
  },
  publicRuntimeConfig: {
    pxuserid: process.env.Pixiv_User_ID
  },
  proxy: {
    options: [
      {
        target: 'https://www.pixiv.net/ajax',
        pathFilter: ['/pxapi/**'],
        pathRewrite: {
          "(.*)/pxapi": ""
        },
        configureProxyRequest: (e)=>{
          return {
            headers: {
              'Referer': 'https://www.pixiv.net/en',
              'X-User-Id': process.env.Pixiv_User_ID
            }
          }
        },
        enableLogger: false
      },
      {
        target: "https://i.pximg.net",
        pathFilter: ["/pxassets/**"],
        pathRewrite: {"(.*)/pxassets":""},
        configureProxyRequest: (e)=>{
          return {
            headers:{
              'Upgrade-Insecure-Requests':'1',
              'Referer': 'https://i.pximg.net'
            }
          }
        },
        enableLogger: false
      }
    ]
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  components: [
    {
      path: './components',
      extensions: [".vue"]
    }
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
})
