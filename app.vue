<template>
  <v-sheet>
    <v-layout>
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

      <v-app-bar
        color="background"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

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
        <NuxtPage :keepalive="{}"/>
        <v-sheet>
          <p class="text-center"><v-icon icon="mdi-copyleft" /> 2023 HenrySck075. {{AllWrongsReserved}}</p>
          <NuxtLink href="https://www.pixiv.net/en"><p class="text-center">Not affiliated with pixiv</p></NuxtLink>
        </v-sheet>
      </v-main>
    </v-layout>
  </v-sheet>
</template>
<script setup>
  const r = useRoute()
  let drawer = ref(false)
  let group = ref(null)
  let n = r.path.split("/tags/")
  // keep this as ref("") and modifu it on pages/tags/[tag].vue
  let searchText = ref(n.length == 1 ? "" : decodeURI(n[1].match(/(.*)[\/]/g)[0].replace("/","")))
  let searchBoxClosed = ref(true)
  import {useTheme, useDisplay} from "vuetify"

  const display = useDisplay()

  const AllWrongsReserved = (()=>{
    let h = [
      "Flip the copyleft when you have the rights",
      "3/4 of pixiv is literally a php site it doesnt even transition",
      "It's Geometry Dash 2.2 month wahoooo (October)"
    ]
    return h[Math.floor(Math.random()*h.length)]
  })()

  watch(group, (n,o) => {drawer.value = false})

  const theme = useTheme() 
  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

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
</style>
