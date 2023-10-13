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

  let tab = ref(p ? (p) : "illust")

  const tabs = [
    ["illust","Illustrations"],
    ["manga", "Manga"],
    ["novels", "Novels"],
  ]

  function sub(path) {
    const dest = "/home/"+(path=="illust"?"":path)
    if (dest == r.path) return
    navigateTo(dest)
  }

  const filter = computed(()=>page.value?.filter)
</script>

<template>
  <v-sheet>
    <v-tabs v-model="tab" color="primary" fixed-tabs >
      <template v-for="i in tabs">
        <v-tab class="text-none" :value=i[0] @click="sub(i[0])">{{i[1]}}</v-tab>
      </template>
    </v-tabs>

    <NuxtPage ref="page" @before-enter="transitioning = true" @after-leave="transitioning = false" />

  </v-sheet>
</template>
