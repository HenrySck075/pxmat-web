<script setup>
  let resp = {}
  let homeData = ref({})
  let homePages = ref({})
  let isR18 = (useRoute().query.mode ?? "all") != "all"
  async function toggleR18(toggle) {
    console.log("hi")
    isR18 = toggle 
    
    resp = await (async ()=>{
      let {data:p} = await usePixivFetch("/top/novel",{query: {
        mode: isR18 ? "r18" : "all"
      }})
      return p.value.body
    })()
    homeData.value = (()=>{
      let h = {}
      for (let i of resp.thumbnails.novel) {
        h[i.id] = i
      }
      return h
    })()
    homePages.value = resp.page

  }

  toggleR18(isR18)

  useHead({
    title: "[pixiv] Novels"
  })

  defineExpose({toggleR18})
</script>

<template>
  <div>
    <Label v-if="homePages.follow">Works by users you're following</Label>
    <v-slide-group v-if="homePages.follow">
      <v-slide-group-item v-for="i in homePages.follow">
        <Novel :data=homeData[i] />
      </v-slide-group-item>
    </v-slide-group>

    <div class="pt-4">
      <Label>Editor's pick</Label>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="i in homePages.editorRecommend" class="pa-6">
          <div class="d-flex flex-wrap" style="width: 400px">
            <Novel :data=homeData[i.novelId] editorPicks />
            <div>
              <p style="color: gray; font-size: 12px">Editor's comment</p>
              <p>{{i.comment}}</p>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </div>
</template>
