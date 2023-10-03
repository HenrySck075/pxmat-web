<script setup>  
  function trim(s,c) {
    c = c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (c === "\\") c = "\\\\";
    return s.replace(new RegExp(
      "^[" + c + "]+|[" + c + "]+$", "g"
    ), "");
  }
     
  const r = useRoute()
  const page = ref()
  const p = trim(r.fullPath.split("/").slice(-1)[0],"/")

  let tname = ref("v-window-x-transition")
  let tab = ref(p ? (p) : "illust")

  let transitioning = ref(false)

  const tabs = {
    illust: "Illustrations",
    manga: "Manga",
    novels: "Novels",
  }

  const tabidx = {
    illust: 0,
    manga: 1,
    novels: 2,
  }

  function sub(path) {
    const dest = "/home/"+(path=="illust"?"":path)
    if (dest == r.path) return
    if (tabidx[path] < tabidx[tab.value]) tname.value="v-window-x-reverse-transition"
    if (tabidx[path] > tabidx[tab.value]) tname.value="v-window-x-transition"
    navigateTo(dest)
  }
</script>

<template>
  <v-sheet>
    <v-tabs v-model="tab" color="primary" fixed-tabs >
      <template v-for="(i, k) in tabs">
        <v-tab class="text-none" :value=k @click="sub(k)">{{i}}</v-tab>
      </template>
    </v-tabs>

    <div class="d-flex justify-end">
      <v-btn @click="()=>{page.pageRef.toggleR18(false)}" color=background>All</v-btn>
      <v-btn @click="()=>{page.pageRef.toggleR18(true)}" color=background>R18</v-btn>
    </div>
    <transition :name="tname" @before-enter="()=>{transitioning = true}" @after-leave="()=>{transitioning = false}">
      <NuxtPage ref="page"/>
    </transition>

  </v-sheet>
</template>
