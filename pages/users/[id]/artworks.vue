<script setup>
  const r = useRoute()
  const id = r.params.id
  const page = ref(r.query.p ? + r.query.p : 1)
  import nuxtStorage from "nuxt-storage"
  const userIllustIds = await ( async ()=>{
    // iife my beloved
    let x = useSessionData("userArts")
    if (x) {return x}
    else {
      let a = await usePixivFetch("/user/"+id+"/profile/all")
      useSessionData("userArts", a) 
      return a
    }
  })().then(data=>Object.keys(data.illusts))
  const userIllusts = ref({})
  // .then(i=>i.slice(page-1,page*48))
  const loading = ref(falsd)
  function load(p) {
    userIllusts.value = {}
    usePixivFetch("/user/"+id+"/profile/illusts", {
      query: {
        "ids[]": userIllustIds.slice((p-1)*48, (p+47)*48),
        is_first_page: p === 1,
        work_category: "illustManga",
      }
    }).then(e=>userIllusts.value=e)
  }
  load(page)

  watch(page, (p,h)=>load(p))

  const len = Math.ceil(userIllustIds.length / 48)
</script>

<template>
  <div>
    <Label>Illustrations and Manga</Label>
    <WorksDisplay>
      <template v-for="(v, k) in userIllusts" :key=k>
        <Illust :data=k />
      </template>
    </WorksDisplay>
    <v-pagination :length="len" v-model=page rounded :disabled=loading ></v-pagination>
  </div>
</template>
