<script setup>
  var resp = {}
  var pageIds = []
  var illustData = ref({})

  let page = "1"
  let mode = "all"
  async function load() {
    const {data:p} = await useFetch("/pxapi/follow_latest/illust", {
      query: {
        "mode": mode,
        p: page,
        lang: "en"
      }
    })

    resp = p._rawValue.body

    pageIds = resp.page.ids 
    illustData.value = (() => {
      let h = {}
      for (let i of resp.thumbnails.illust) {h[i.id] = i}
      return h
    })()

  }

  await load()


  useHead({title: "Works by users you're following [pixiv Material Design Concept]"})

  let isR18 = ref(false)
  const toggleR18 = (h) => {
    isR18 = h
    mode = isR18 ? "r18" : "all"
    load()
  }

  defineExpose(["toggleR18"])
</script>


<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn color="surface" @click="toggleR18(false)" class="text-none">All</v-btn>
      <v-btn color="surface" @click="toggleR18(true)" class="text-none">R18</v-btn>
    </div>
    <div class="d-flex flex-wrap">
      <template v-for="illust in illustData">
        <Illust :data=illust />
      </template>
    </div>
  </div>
</template>
