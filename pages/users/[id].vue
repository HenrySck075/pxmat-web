<script setup>
  const r = useRoute()
  const id = r.params.id

  const resp = await useFetch("/pxapi/user/"+id+"?full=1&lang=en").then(({data:pl})=>pl.value.body)
  const works = await useFetch("/pxapi/user/"+id+"/profile/all?lang=en").then(({data:pl})=>pl.value.body)

  const proxyURL=useProxyURL

  useHead({
    title: resp.name+" [pixiv Material Design Concept]"
  })

  const baseUrl="/users/"+id
  
  console.log(+works.manga)
  
  const page = ref()
  let h = watch(page, async () => {
    if (page.value.pageRef?.illustCount !== undefined) {
      page.value.pageRef.illustCount = Object.keys(works.illusts).length
      the()
    }
  })
  function the() {h()}

</script>

<template>
  <div>
    <v-img :src="proxyURL(resp.background?.url) ?? ''" width=100vw v-if=resp.background?.url class="pb-4"></v-img>
    <div style="width: 100vw; height: 176px" v-else></div>
    <v-sheet rounded>
      <div>
        <v-avatar :image=proxyURL(resp.image) style="position: absolute; width: 120px; height: 120px; transform: translateY(-80px)" class="ml-7"></v-avatar>
        <div style="transform: translateX(170px)" id="spacing">
          <p class="font-weight-bold text-h5">{{resp.name}}</p>
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
      <v-tabs>
        <v-tab value="main" :to="baseUrl">Home</v-tab>
        <v-tab value="artworks" :to="baseUrl+'/artworks'">Illustrations</v-tab>
        <v-tab value="manga" :to="baseUrl+'/manga'" v-if="+works.manga">Manga</v-tab>
        <v-tab value="novels" :to="baseUrl+'/novels'" v-if="+works.novels">Novels</v-tab>
      </v-tabs>
      <NuxtPage ref="page" class="pt-6"/>
    </v-sheet>
  </div>
</template>

<style>
  #spacing > * {
    margin: 22px 0
  }
</style>
