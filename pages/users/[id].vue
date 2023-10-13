<script setup>
  const r = useRoute()
  const rr = useRouter()
  const id = r.params.id

  const resp = await usePixivFetch("/user/"+id+"?full=1")
  const works = ref({
    illustrations: "truthy value",
    manga: "",
    novels: ""
  })

  console.log(works)

  useSessionData("userWorks", works) 
  import nuxtStorage from "nuxt-storage"

  rr.afterEach((to, from, fail) => {
    if (!to.path.startsWith("/users/") && !fail) nuxtStorage.sessionStorage.removeItem("userWorks")
  })


  const proxyURL=useProxyURL
  function trim(s,c) {
    c = c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (c === "\\") c = "\\\\";
    return s.replace(new RegExp(
      "^[" + c + "]+|[" + c + "]+$", "g"
    ), "");
  }

  useHead({
    title: resp.name+" [pixiv Material Design Concept]"
  })
  const p = trim(r.fullPath.split("/").slice(-1)[0],"/")

  const baseUrl="/users/"+id
  let tab = ref(p ? (p) : "main")

  const tabs = [
    "main", "illustrations", "manga", "novels", "bookmarks"
  ]

  function sub(path) {
    const dest = baseUrl+"/"+(path=="main"?"":(path=="bookmarks"?"bookmarks/artworks":path))
    if (dest == r.path) return
    navigateTo(dest)
  }

  function tabmod(v) {
    works.value = v
  }
 
  console.log(+works.manga)

</script>

<template>
  <div>
    <v-img :src="proxyURL(resp.background?.url) ?? ''" width=100vw v-if=resp.background?.url class="pb-4"></v-img>
    <div style="width: 100vw; height: 176px" v-else></div>
    <v-sheet rounded>
      <div>
        <v-avatar :image=proxyURL(resp.image) style="position: absolute; width: 120px; height: 120px; transform: translateY(-80px)" class="ml-7"></v-avatar>
        <div style="transform: translateX(170px)" id="spacing">
          <span class="font-weight-bold text-h5">{{resp.name}}</span>
          <v-spacer></v-spacer>
          <v-btn class="text-none">Follow</v-btn>
          <span>          </span>
          <span class="font-weight-bold text-subtitle-1" style="color: gray">{{resp.following}}</span><span style="color: gray" class="text-subtitle-1"> following</span>
          <div class="pt-4 d-flex">
            <NuxtLink :to="resp.webpage" class="uncolored-anchor" v-if=resp.webpage>
              <v-icon icon="mdi-home" size="32px"></v-icon>
            </NuxtLink>
            <template v-for="(v, k) in resp.social">
              <NuxtLink :to="v.url" class="uncolored-anchor">
                <Icons :icon="k" />
              </NuxtLink>
            </template>
            <v-icon icon="mdi-email" size="32px" ></v-icon>
          </div>
        </div>
      </div>
      <v-tabs v-model=tab>
        <v-tab value="main" :to="baseUrl">Home</v-tab>
        <v-tab value="illustrations" :to="baseUrl+'/illustrations'">Illustrations</v-tab>
        <v-tab value="manga" :to="baseUrl+'/manga'" v-if="+works.manga">Manga</v-tab>
        <v-tab value="novels" :to="baseUrl+'/novels'" v-if="+works.novels">Novels</v-tab>
      </v-tabs>
      <NuxtPage ref="page" class="pt-6" @tabmod="tabmod" />
    </v-sheet>
  </div>
</template>

<style>
  #spacing > * {
    margin: 22px 0
  }
</style>
