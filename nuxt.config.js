// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass'],
  modules: ["nuxt-proxy-request"],
  build: {
    transpile: ['vuetify'],
  },
  publicRuntimeConfig: {
    pxuserid: process.env.Pixiv_User_ID
  },
  //nitro: {
  //  devProxy: {
  //    "/pxapi/**": {target: "https://www.pixiv.net/ajax", changeOrigin:true, prependPath: true, headers: {'Referer': 'https://www.pixiv.net/en','X-User-Id': process.env.Pixiv_User_ID}},
  //    "/pxassets/**": {target: "https://i.pximg.net", prependPath: true, headers: {'Referer': 'https://www.pixiv.net/en','Upgrade-Insecure-Requests': "1"}},
  //    "/pxsprites/**": {target: "https://s.pximg.net", prependPath: true , headers: {'Referer': 'https://www.pixiv.net/en','Upgrade-Insecure-Requests': "1"}}
  //  },
  //  routeRules: {
  //    "/pxapi/**": {proxy: "https://www.pixiv.net/ajax", headers: {'Referer': 'https://www.pixiv.net/en','X-User-Id': process.env.Pixiv_User_ID}},
  //    "/pxassets/**": {proxy: "https://i.pximg.net", headers: {'Referer': 'https://www.pixiv.net/en','Upgrade-Insecure-Requests': "1"}},
  //    "/pxsprites/**": {proxy: "https://s.pximg.net", headers: {'Referer': 'https://www.pixiv.net/en','Upgrade-Insecure-Requests': "1"}}
  //  }
  //},
  proxy: {
    options: [
      {
        target: 'https://www.pixiv.net/ajax',
        pathFilter: ['/pxapi/**'],
        pathRewrite: {
          "(.*)/pxapi": ""
        },
        changeOrigin: true,
        configureProxyRequest: (e)=>{
          return {
            cookieDomainRewrite: {
              '.pixiv.net': ''
            },
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
      },
      {
        target: "https://i.pximg.net",
        pathFilter: ["/pxugoira/**"],
        pathRewrite: {"(.*)/pxugoira":""},
        configureProxyRequest: (e)=>{
          return {
            headers:{
              'Referer': 'https://i.pximg.net'
            }
          }
        },
        enableLogger: false
      },
      {
        target: "https://s.pximg.net",
        pathFilter: ["/pxsprites/**"],
        pathRewrite: {"(.*)/pxsprites":""},
        configureProxyRequest: (e)=>{
          return {
            headers:{
              'Upgrade-Insecure-Requests':'1',
              'Referer': 'https://s.pximg.net'
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
    pageTransition: { name: 'page', mode: 'out-in' },
    meta: [{name:"description", content: "what here"}]
  },
  ssr:false,
})
