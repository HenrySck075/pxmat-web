<script setup>
  let id = useRoute().params.id
  const config=useRuntimeConfig()

  const s = (a, b) => a>b

  const {data:illustDataRef} = await useFetch(`/pxapi/illust/${id}?lang=en&ref=https://www.pixiv.net/en`,{method:"GET",headers:{"X-User-Id":"76179633"}})
  const illustData = illustDataRef._rawValue.body
  const userIllusts = Object.keys(illustData.userIllusts).sort(s)

  let related = ref([])
  let relatedNextIds = []

  async function loadRelated() {
    if (!ref.value) {
      const {data:payload} = await useFetch("/pxapi/illust/"+id+"/recommend/init?limit=18&lang=en",{method:"GET",headers:{"X-User-Id":config.pxuserid}})
      related.value = payload._rawValue.body.illusts 
      relatedNextIds = payload._rawValue.body.nextIds
    } else {
      const {data:payload} = await useFetch("/pxapi/illust/recommend/illusts",{
        query: {
          "illust_ids[]": relatedNextIds.slice(0,18),
          lang: "en"
        },
        method:"GET",headers:{"X-User-Id":config.pxuserid}
      })
      relatedNextIds = relatedNextIds.slice(18)
      related.value.push(...payload.value.bodu.illusts)
    }
  }

  async function onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        await loadRelated()
      }
    }

  await loadRelated()

  useHead({
    title: `${illustData.alt} - pixiv`
  })

  const proxyAssetUrl = (a) => {
    if (a === undefined) return ""
    return a.replace("https:\/\/i.pximg.net","/pxassets")
  }

  const vue = useNuxtApp().vueApp

  let current = userIllusts.indexOf(id) + 3
  let range = 9
  let userIllustsData = {}

  const fetchIllustInRange = async (start, range) => {
    if (start < 0) start = 0
    const {data:h} = await useFetch(`/pxapi/user/${illustData.userId}/illusts`,{
      query: {"ids[]": userIllusts.slice(start,start+range+1), lang: "en"} 
    })
    return h._rawValue
  }

  let multiimaged = ref(false)

  let images = ref([{urls: illustData.urls}])

  const b = () => {
    fetchIllustInRange(current-range,range).then(d=>{
      userIllustsData = {...userIllustsData,...d.body}

      current=current-Object.keys(d.body).length
    })
  }
  
  const a = () => {
    fetchIllustInRange(current+range,range).then(d=>{
      userIllustsData = {...d.body,...userIllustsData}

      current=current+Object.keys(d.body).length
    })
  }

  function loadAllPage() {
    useFetch("/pxapi/illust/"+id+"/pages?lang=en", {"method":"GET",headers:{"X-User-Id":config.pxuserid}}).then(({data: pay}) => {
      multiimaged.value = true
      images.value.push(...pay.value.body.slice(1))
    })
  }

  var uilLoading = ref(false)

  const loadOld = () => {
    uilLoading.value = true
    b()
    uilLoading.value = false
  }

  const loadNew = () => {
    uilLoading.value = true
    a()
    uilLoading.value = false
  }

  loadOld()

</script>

<template>
  <div>
    <div id="illust-view">
      <v-sheet class="align-center text-center text-h6" rounded width="100%">
        <div>
          <p>{{illustData.title}}</p>
        </div>
      </v-sheet>
      <div>
        <template v-for="i in images">
          <v-img :src=proxyAssetUrl(i.urls.small) max-height=1000px width=98% id=illustImg class="pt-2 pb-2"></v-img>
        </template>
        <v-btn 
          style="margin-left: auto; margin-right: auto; width: 100px; background-color: black" 
          v-if="illustData.pageCount!=1 && !multiimaged"
          @click="loadAllPage()"
        >See all</v-btn>

      </div>
      <v-sheet rounded>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon icon="mdi-heart" @click="console.log('favorite')"></v-icon>
          <v-icon icon="mdi-share-variant" @click="console.log('google en passant')"></v-icon>
        </v-card-actions>
      </v-sheet>
      <v-sheet rounded>
        <p class="text-h5 ma-4">{{illustData.title}}</p>
        <p class="font-weight-light ma-2"><span v-html=illustData.description /></p>
        <div class="d-flex flex-wrap">
          <div v-for="i in illustData.tags.tags">
            <NuxtLink :to="'/tags/'+i.tag+'/artworks'+(illustData.xRestrict ? '?mode=r18' : '')" class="ma-2">
              #{{i.tag}}
            </NuxtLink>
            <NuxtLink v-if="Object.keys(i).includes('translation')" :to="'/tags/'+i.tag+'/artworks'+(illustData.xRestrict ? '?mode=r18' : '')" style="color: gray">
              {{i.translation.en}}
            </NuxtLink>
          </div>
        </div>
      </v-sheet>
      <p class="ma-2 text-weight-bold"></p>
      <v-card id="illust-author-bar">
        <v-card-actions>
          <v-list-item class="w-100">
            <template v-slot:prepend>
              <v-img :src=proxyAssetUrl(illustData.profileImageUrl)></v-img>
            </template>
            <span>{{illustData.userName}}</span>
            <template v-slot:append>
              <AButton href="/" btnStyle="text-none text-subtitle-4" style="display: inline; anchor: right">
                <v-icon icon="mdi-plus"></v-icon>
                Follow
              </AButton>
            </template>
          </v-list-item>
        </v-card-actions>
      </v-card>
      <v-spacer></v-spacer>
      <v-sheet rounded>
        <v-slide-group center-active show-arrows id="userIllusts">
          <v-slide-group-item>
            <v-card class="d-flex justify-center align-center" v-if="current>0" @click="loadOld()">
              <p v-if="!uilLoading">Load more</p>
              <v-progress-circular v-if="uilLoading" color="primary" indeterminate />
            </v-card>
          </v-slide-group-item>
          <v-slide-group-item v-for="(illust, k) in userIllustsData">
            <Illust :data=illust :interact="k!=id"/>
          </v-slide-group-item>
          <v-slide-group-item>
            <v-card class="d-flex justify-center align-center" @click="loadOld()">
              <p v-if="!uilLoading">Load more</p>
              <v-progress-circular v-if="uilLoading" color="primary" indeterminate />
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
    <div class="pt-4">
      <Label>Related works</Label>
      <div class="d-flex flex-wrap justify-start" @scroll="onScroll">
        <template v-for="i in related">
          <Illust :data="i" />
        </template>
      </div>
    </div>
  </div>
</template>
