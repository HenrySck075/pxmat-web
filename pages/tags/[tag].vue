<script setup>
  const r = useRoute()
  const tag = r.params.tag 
  const tagMeta = await useFetch("/pxapi/search/tags/"+tag+"?lang=en").then(({data: c}) => c._rawValue.body)

  function trim(s,c) {
    c = c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (c === "\\") c = "\\\\";
      return s.replace(new RegExp(
        "^[" + c + "]+|[" + c + "]+$", "g"
      ), "");
    }
      
  const proxyAssetUrl = (a) => {
    if (a === undefined) return "/facebook_male.png"
    return a.replace("https:\/\/i.pximg.net","/pxassets")
  }
  const p = trim(r.fullPath.split("/").slice(-1)[0],"/")

  let tname = ref("v-window-x-transition")
  let tab = ref(p ? (p) : "main")

  let transitioning = ref(false)

  const tabs = {
    main: "Top",
    artworks: "Illustrations"
  }

  const tabidx = {
    main: 0,
    artworks: 1
  }

  function sub(path) {
    const dest = "/tags/"+tag+"/"+(path=="main"?"":path)
    if (dest == r.path) return
    if (tabidx[path] < tabidx[tab.value]) tname.value="v-window-x-reverse-transition"
    if (tabidx[path] > tabidx[tab.value]) tname.value="v-window-x-transition"
    navigateTo(dest)
  }
</script>
<template>
  <div>
    <v-img style="border-radius: 4px; width=100vw" max-height=200px cover :src="proxyAssetUrl(tagMeta.pixpedia.image)"></v-img>
    <v-sheet rounded elevation="2">
      <div>
        <div class="d-flex justify-center pt-6">
          <v-img style="border-radius: 4px" max-width="100px" cover aspect-ratio="1" class="justify-center" :src="proxyAssetUrl(tagMeta.pixpedia.image)"></v-img>
        </div>
        <p class="text-h6 text-center">{{tagMeta.tag}}</p>
        <p style="color: gray; font-size: 12px" class="text-center">{{tagMeta.pixpedia.tag}}</p>
        <p class="text-subtitle-1 text-center">{{tagMeta.pixpedia.description}}</p>
      </div>
    </v-sheet>
    <v-tabs v-model="tab" bg-color="surface" align-tabs="center" :disabled=transitioning>
      <template v-for="i in Object.keys(tabs)">
        <v-tab :value="i" class="text-none" @click="sub(i)">{{tabs[i]}}</v-tab>
      </template>
    </v-tabs>
    <transition :name="tname" @before-enter="()=>{transitioning.value = true}" @after-leave="()=>{transitioning.value = false}">
      <div>
        <NuxtPage />
      </div>
    </transition>
  </div>
</template>
