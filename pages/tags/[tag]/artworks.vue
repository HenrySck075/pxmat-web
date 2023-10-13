<script setup>
  const r = useRoute()
  const tag = r.params.tag
  let resp = ref({})
  let pageIllusts = ref([])
  let amode = r.query.mode ?? "all"
  function toPathQuery(q) {
    let h = []
    for (let i of Object.keys(q)) {
      h.push(i+"="+q[i])
    }
    return h.join("&")
  }
 
  async function loadPage(pa, init = false) {
    let page = pa.toString()
    pageIllusts.value={}
    const re = await usePixivFetch("/search/artworks/"+tag, {
      query: {
        word: tag,
        order: "date_d",
        mode: amode,
        p: page,
        s_mode: "s_tag_full",
        type: "illust_and_ugoira",
      }
    })
    if (init) {
      resp.value = re
      pageIllusts.value = resp.value.illustManga.data
    }
    else {
      pageIllusts.value = re.illustManga.data
      history.replaceState({},"",r.path+"?"+toPathQuery({...r.query, "page": page}))
    }
  };

 
  let page = ref(+(r.query.page ?? "1"))

  useRoute().query
  watch(page, async (p,h) => {await loadPage(p)})

  await loadPage(1, true)
</script>
<template>
  <div>
    <v-sheet elevation="2">
      <v-pagination v-model="page" :length="resp.illustManga.lastPage" rounded="circle"></v-pagination>
      <p class="ml-4 font-weight-bold">Works</p>
      <WorksDisplay>
        <template v-for="i in pageIllusts">
          <Illust :data="i" />
        </template>
      </WorksDisplay>
      <v-pagination v-model="page" :length="resp.illustManga.lastPage" rounded="circle"></v-pagination>
    </v-sheet>
  </div>
</template>
