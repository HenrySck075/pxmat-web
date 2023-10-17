<template>
  <v-sheet min-height="100vh">
    <v-layout>
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

      <v-app-bar
        color="background"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" v-if=cookieSet></v-app-bar-nav-icon>

        <v-app-bar-title>
          <v-img src="/favicon.ico" :aspect-ratio="1" width=21px></v-img>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <v-text-field
            v-if="cookieSet"
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

        <v-btn variant="text" icon="mdi-filter" @click="filterD = true"></v-btn>

        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="cookieSet=!cookieSet">
              <v-list-item-title>DevTools: toggle cookieSet</v-list-item-title>
            </v-list-item>
            <v-list-item @click="toggleTheme()">
              <v-list-item-title>Switch to <span v-if=theme.global.current.value.dark>light</span><span v-else>dark</span> theme</v-list-item-title>
            </v-list-item>
            <v-list-item @click="settingsD = true">
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :permanent="!display.mobile.value"
        v-if="cookieSet"
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
        <!--Settings dialog-->
        <v-dialog v-model="settingsD" width=98vw height=98vh>
          <v-sheet rounded :elevation="2" class="pa-3" height=98vh>
            <span class="text-h5">Settings</span>
            <div style="overflow: auto; height: 81vh">
              <p class="font-subtitle-1 pt-5">Language</p>
              <v-select :items="langMap" v-model=settingsModel.langSelect item-title="dis" item-value="code"></v-select>
              <p class="font-subtitle-1 pt-5">Chunked file download size</p>
              <v-text-field v-model.trim="settingsModel.chunkSize" :rules="[validations.numberOnly]"></v-text-field>
              <p class="font-subtitle-1 pt-5">Toggle options</p>
              <v-switch v-model="settingsModel.toggle_redirect" label="Redirect to this site for every pixiv URLs on this site when clicking" title="(except for URLs in the bottom bar)"></v-switch>
              <p class="font-subtitle-1 pt-5">Dangerous area or smth</p>
              <p class="font-subtitle-1 font-weight-bold pt-5">Think twice before clicking!!!</p>
              <v-btn color="#ff0000" @click="flushCookies()" >Delete all cookies</v-btn>
            </div>
            <div class="d-flex justify-end" >
              <v-btn @click="apply()" :disabled="!modified_change">Apply</v-btn>
              <v-btn @click="settingsD = false" color=background>Close</v-btn>
            </div>
          </v-sheet>
        </v-dialog>

        <!--Filters dialog-->
        <v-dialog v-model="filterD" width=98vw>
          <v-sheet rounded :elevation="2" class="pa-3">
            <span class="text-h5">Filter</span>
            <p class="text-center text-subtitle-1" v-if="$route.path.startsWith('/artworks')">No filters available for this page</p>
            <div v-else>
              <p class="font-subtitle-1 pt-5">Age</p>
              <!--v-select :items="filterModel.modeItems" v-model="filterModel.mode" item-title="dis" item-value="code"></v-select-->
              <v-select v-model="filterModel.mode">
                <v-list>
                  <v-list-item title="All" value="all" />
                  <v-list-item title="All ages" value="safe" v-if="$route.path.startsWith('/artworks')" />
                  <v-list-item title="R18" value="r18" />
                </v-list>
              </v-select>
            </div>
          </v-sheet>
        </v-dialog>

        <NuxtPage :keepalive="{}" @after-enter="updateURL()" ref="page" v-if=cookieSet />

        <!--cookie form-->
        <v-form v-else ref="entryForm" class="d-flex justify-center align-center" @submit.prevent="setupAccount">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="Enter your account's cookie to continue" v-model=model></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-btn block :disabled="cooking" :loading=cooking type="submit" color="primary">Submit</v-btn>
            </v-row>
            <v-row>
              <v-col style="width: 94vw">
                <span class="font-weight-bold text-h4" id="cookieHow">How to obtain cookie</span>
                <v-icon size="16px" icon="mdi-menu-down-outline" @click="cookieHow = !cookieHow"></v-icon>
                <v-expand-transition>
                  <!--content/ exists-->
                  <v-sheet v-show="cookieHow" width=100%>
                    <span class="font-weight-bold">Step 1:</span>
                    <span>Go to <NuxtLink to="https://www.pixiv.net/en?pxmat_force_redirect=1">pixiv.net</NuxtLink>, type </span><span style="font-family: monospace, monospace">javascript:</span> <span>in address bar and paste the following text:</span>
                    <p style="font-family: monospace, monospace; background-color: bg-background">setTimeout(()=&gt;navigator.clipboard.writeText(document.cookie),3000)</p>
                    
                    <span class="font-weight-bold">Step 2:</span>
                    <p>Paste to da box</p>
                  </v-sheet>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-sheet class="pt-6">
          <p class="text-center"><v-icon icon="mdi-copyleft" /> 2023 HenrySck075. {{AllWrongsReserved}}</p>
          <p class="text-center">All artworks / novels belongs to their respective owners.</p>
          <div class="d-flex flex-wrap me justify-center">
            <NuxtLink class="text-center" :to="a">Not affiliated with pixiv</NuxtLink>
            <a href="https://www.github.com/HenrySck075/pxmat">GitHub</a>
            <a href="https://www.youtube.com/@henrysck075">Youtube</a>
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
  // moar stuff
  const page = ref()
  const updateFilter = computed(()=>page.value?.filter)
  const cookieSet = ref(!!useCookie("__utmv", {default: ()=>null}).value)

  let h = {}
  let model = ref("")
  const cooking  = ref(false)
  function setupAccount() {
    cooking.value = true
    console.log(model.value)
    for (let c of model.value.split(";")) {
      let [k,...v] = c.split("=")
      h[k.trim()] = useCookie(k.trim(), {default: ()=>0, expires: new Date("2030-12-31T23:59:59"), encode: (no)=>{return no}})
      h[k.trim()].value = v.join("=")
      if (k.includes("__utmv")) {
        let a = v.findIndex(v=>v==="lang")
        useLocalData("lang", v[a+1])
        // const userInfo = usePixivFetch("/user/"+v[a-2], {query:{full:1}})
        // useLocalData("userInfo", {userId: v[a-2], image: userInfo.image})
      }
    }
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
  const cookieHow = ref(false)
  let n = r.path.split("/tags/")
  // keep this as ref("") and modifu it on pages/tags/[tag].vue
  let searchText = ref(n.length == 1 ? "" : decodeURI(n[1].match(/(.*)[\/](.*)/g)[0].replace("/","")))
  let searchBoxClosed = ref(true)
  import {useTheme, useDisplay} from "vuetify"

  const display = useDisplay()

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

  // setting section
  const settingsModel = {
    langSelect: ref(useLocalData("lang") ?? "en"),
    chunkSize: ref(useLocalData("chunkSize") ?? "300000"),
    toggle_redirect: ref(true)

  }
  const modified_change = ref(false)
  function mumei(h,h2) {modified_change.value = true}
  for (let i of Object.values(settingsModel)) {
    watch(i, mumei)
  }
  const validations = {
    numberOnly: v=> {return !isNaN(v) || "Input must only contains number"}
  }
  const langMap = [
    {dis: 'English', code: "en"}, 
    {dis: 'Japanese',code: "ja"}
  ]
  const lang = ["en", "ja"]

  function apply() {
    useLocalData("chunkSize", settingsModel.chunkSize)
    useLocalData("lang", settingsModel.langSelect)
    modified_change.value = false
  }

  function flushCookies() {
    let cooks = document.cookie 
    console.log(cooks.split("; "))
    for (let h of cooks.split("; ")) {
      let c = h.split("=")[0].trim()
      let d = useCookie(c)
      d.value = null
    }
    settingsD.value = false
    cookieSet.value = false
  }

  // filter section
  let filterModel = {
    mode: ref("all"),
    modeItems: [{dis: "All", code: "all"},{dis: "All ages", code: "safe"},{dis: "R18", code: "r18"}]
  }

  let currentMode = {
    r18: false,
    before: null,
    after: null
  }

  watch(filterModel.mode, (n,o)=>{currentMode.r18 = n; updateFilter()})
  // let userExtra = await usePixivFetch("/user/extra")

  function pxurl(url) {
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
    else {
      a.value = pxurl(to.fullPath)
      next()
    }
  })

  const settingsD = ref(false)
  const filterD = ref(false)
</script>
<style>
  a {
    text-decoration: none;
  }

  #illustImg {
    transition: all 0.4s
  }
  .v-input.expanding-search {
    transition: max-width 0.4s
  }
  .v-input__slot.closed {
    max-width: 70px
  }
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
