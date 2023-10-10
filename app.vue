<template>
  <v-sheet>
    <v-layout>
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

      <v-app-bar
        color="background"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>
          <v-img src="/favicon.ico" :aspect-ratio="1" width=21px></v-img>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <v-text-field
            v-model.trim="searchText"
            dense
            filled
            rounded
            clearable
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            class="pt-6 shrink expanding-search"
            :class="{ closed: searchBoxClosed && !searchText }"
            @focus="searchBoxClosed = false"
            @blur="searchBoxClosed = true"
            @keyup.enter="this.$router.push({path:'/tags/'+searchText})
"
        ></v-text-field>

        <v-btn variant="text" icon="mdi-filter"></v-btn>

        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="this.$nuxt.refresh()">
              <v-list-item-title>Refresh page</v-list-item-title>
            </v-list-item>
            <v-list-item @click="toggleTheme()">
              <v-list-item-title>Switch to <span v-if=theme.global.current.value.dark>light</span><span v-else>dark</span> theme</v-list-item-title>
            </v-list-item>
            <v-list-item @click="(()=>{navigator.clipboard.writeText(pxurl()); snack=true})()">
              <v-list-item-title>Copy URL as pixiv URL</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :permanent="!display.mobile.value"
      >
        <v-list>
          <v-list-subheader title="Home"/>
          <v-list-item title="Illustrations" value="a" @click="navigateTo('/home')"/>
          <v-list-item title="Manga" value="b" @click="navigateTo('/home/manga')"/>
          <v-list-item title="Novels" value="c" @click="navigateTo('/home/novels')"/>

          <v-list-item type="divider" />

          <v-list-subheader title="Discovery" />
          <v-list-item title="Following" value="f" @click="navigateTo('/bookmarks/illust')"/>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <NuxtPage :keepalive="{}" @after-enter="updateURL()" v-if=cookieSet />
        <v-form v-else ref="entryForm" class="d-flex justify-center align-center" @submit.prevent="setCookie">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="Enter your account's cookie to continue" v-model=model></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-btn block :disabled="cooking" :loading=cooking type="submit" color="primary">Submit</v-btn>
            </v-row>
          </v-container>
        </v-form>

        <v-sheet>
          <p class="text-center"><v-icon icon="mdi-copyleft" /> 2023 HenrySck075. {{AllWrongsReserved}}</p>
          <div class="d-flex flex-wrap me justify-center">
            <NuxtLink class="text-center" :to="a">Not affiliated with pixiv</NuxtLink>
            <a href="https://www.github.com/HenrySck075/pxmat">GitHub</a>
          </div>
        </v-sheet>
        <v-snackbar v-model="snack" style="background-color: black">
          Copied to clipboard
          <template v-slot:actions>
            <v-btn color="primary" variant="text" @click="snackbar = false" >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
    </v-layout>
  </v-sheet>
</template>
<script setup>
  const cookieSet = ref(!!useCookie("__utmv", {default: ()=>null}).value)

  let h = {}
  let model = ref("")
  const cooking  = ref(false)
  function setCookie() {
    console.log("setting cookies")
    cooking.value = true
    for (let c of model.value.split(";")) {
      let [k,...v] = c.split("=")
      h[k.trim()] = useCookie(k.trim(), {default: ()=>0, expires: new Date("2030-12-31T23:59:59")})
      h[k.trim()].value = v.join("=")
    }
    console.log('holding for 5 seconds')
    cookieSet.value = true
    cooking.value = false
  }
  const a = ref("https://www.pixiv.net/en")
  function updateURL() {
    a.value = pxurl()
  }
  let snack = ref(false)
  const r = useRoute()
  let drawer = ref(false)
  let group = ref(null)
  let n = r.path.split("/tags/")
  // keep this as ref("") and modifu it on pages/tags/[tag].vue
  let searchText = ref(n.length == 1 ? "" : decodeURI(n[1].match(/(.*)[\/]/g)[0].replace("/","")))
  let searchBoxClosed = ref(true)
  import {useTheme, useDisplay} from "vuetify"

  const display = useDisplay()

  import s from 'nuxt-storage'
  s.localStorage.clear() // this will only run once so

  const AllWrongsReserved = (()=>{
    let h = [
      "Flip the copyleft when you have the rights",
      "3/4 of pixiv is literally a php site it doesnt even transition",
      "It's Geometry Dash 2.2 month wahoooo (October)",
      "duh",
      "Powder that makes you say 'real'",
      "If you think you can just steal this and not telling me because there's no mention of reserving then you're blind, it's in the code itself."
    ]
    return h[Math.floor(Math.random()*h.length)]
  })()

  function pxurl() {
    let url = r.path
    url = url.startsWith("/home") ? url.slice(5) : url 
    return "https://www.pixiv.net/en" + url
  }

  watch(group, (n,o) => {drawer.value = false})

  const theme = useTheme() 
  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  useRouter().beforeEach((to, from, next) => {
    if (to.path.startsWith("/jump.php")) {return {
      path: decodeURIComponent(to.fullPath.slice(8)),
      external: true
    }}
    else next()
  })

</script>
<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.3s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
  .uncolored-anchor {
    color: white
  }
  .me > * {
    padding-left: 9px;
    padding-right: 9px
  }
  .v-slide-group__wrapper {
    overflow-x: auto; /* Enables the horizontal scrollbar */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .v-slide-group__wrapper::-webkit-scrollbar {
    display: none; /* Chrome opera and Safary */
    width: 0px;
    background: transparent;
  }
</style>
