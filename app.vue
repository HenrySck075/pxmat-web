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
            <v-list-item @click="this.$router.app.refresh()">
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
          <v-list-item title="Home" value="h" @click="navigateTo('/')"/>
          <v-list-item title="Following" value="f" @click="navigateTo('/bookmarks/illust')"/>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <NuxtErrorBoundary>
          <NuxtPage :keepalive="{}"/>
          <template #error="{ error }">
            <div>
              {{error.message}}
            </div>
          </template>
        </NuxtErrorBoundary>
      </v-main>
    </v-layout>
  </v-sheet>
</template>
<script setup>
  let drawer = ref(false)
  let group = ref(null)
  let searchText = ref("")
  let searchBoxClosed = ref(true)
  import {useTheme, useDisplay} from "vuetify"

  const display = useDisplay()

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
</style>
