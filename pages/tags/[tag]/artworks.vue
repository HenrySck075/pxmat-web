<script setup>
  const tag = useRoute().params.tag
  let resp = ref({})
  let pageIllusts = ref([])
  let amode = useRoute().query.mode ?? "all"
  async function loadPage(pa, init = false) {
    console.log(pa)
    let page = pa.toString()
    pageIllusts.value={}
    const {data: payload} = await useFetch("/pxapi/search/illustrations/"+tag, {
      query: {
        word: tag,
        order: "date_d",
        mode: amode,
        p: page,
        s_mode: "s_tag_full",
        type: "illust_and_ugoira",
        lang:"en"
      }
    })
    if (init) {
      resp.value = payload._rawValue.body
      pageIllusts.value = resp.value.illust.data
    }
    else {
      pageIllusts.value = payload._rawValue.body.illust.data
    }
  }

  let page = ref(1)

  useRoute().query
  watch(page, async (p,h) => {await loadPage(p)})

  await loadPage(1, true)
</script>
<template>
  <div>
    <p class="ml-4 font-weight-bold">Works</p>
    <div class="d-flex flex-wrap justify-start">
      <template v-for="i in pageIllusts">
        <Illust :data="i" />
      </template>
    </div>
    <v-pagination v-model="page" :length="resp.illust.lastPage" rounded="circle"></v-pagination>
  </div>
</template>
