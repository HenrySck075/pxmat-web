<script setup>
  const r = useRoute()
  const id = r.params.id
  const page = r.query.p ? + r.query.p : 1
  import nuxtStorage from "nuxt-storage"
  const userIllusts = await ( async ()=>{
    // iife my beloved
    let x = nuxtStorage.localStorage.getData("userArts")
    if (x) {return x}
    else {
      let a = await usePixivFetch("/user/"+id+"/profile/all")
      nuxtStorage.localStorage.setData("userArts", a) 
      return a
    }
  })().then(data=>Object.keys(data.illusts)).then(i=>i.slice(page-1,page*48))
  const resp = usePixivFetch("/user/"+id+"/profile/illusts", {
    query: {
      "ids[]": userIllusts,
      is_first_page: page === 1,
      work_category: "illustManga",
    }
  })
</script>

<template>
  <div>
    holdup lmao
  </div>
</template>
