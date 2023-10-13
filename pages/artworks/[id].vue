<script setup>
  // illustType
  // 0: single-image 
  // 1: multi-image 
  // 2: ugoira
  const route = useRoute()
  let id = route.params.id
  const config=useRuntimeConfig()

  const s = (a, b) => a>b

  const {data:illustDataRef} = await useFetch(`/pxapi/illust/${id}?lang=en&ref=https://www.pixiv.net/en`,{method:"GET",headers:{"X-User-Id":"76179633"}})
  const illustData = illustDataRef._rawValue.body
  const userIllusts = Object.keys(illustData.userIllusts).sort(s)

  let related = ref([])
  let relatedNextIds = []

  const rLoading = ref(false)

  async function loadRelated() {
    console.log("h")
    if (!related.value.length) {
      const payload = await usePixivFetch("/illust/"+id+"/recommend/init",{method:"GET",headers:{"X-User-Id":config.pxuserid}, query: {limit: 18}})
      related.value = payload.illusts 
      relatedNextIds = payload.nextIds
    } else {
      rLoading.value = true
      const payload = await usePixivFetch("/illust/recommend/illusts",{
        query: {
          "illust_ids[]": relatedNextIds.slice(0,18),
        },
        method:"GET",headers:{"X-User-Id":config.pxuserid}
      })
      relatedNextIds = relatedNextIds.slice(18)
      related.value.push(...payload.illusts)
    }
    rLoading.value = false
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
  let userIllustsData = ref({})

  const fetchIllustInRange = async (start, range) => {
    if (start < 0) {start = 0}
    return await usePixivFetch("/user/"+illustData.userId+"/illusts",{
      query: {"ids[]": userIllusts.slice(start,start+range+1), lang: "en"} 
    })
  }

  let multiimaged = ref(false)

  let images = ref([{urls: illustData.urls}])

  const b = () => {
    fetchIllustInRange(current-range,range).then(d=>{
      userIllustsData.value = {...userIllustsData.value,...d}

      current=current-Object.keys(d).length
    })
  }
  
  const a = () => {
    fetchIllustInRange(current+range,range).then(d=>{
      userIllustsData.value = {...d,...userIllustsData.value}

      current=current+Object.keys(d).length
    })
  }

  function loadAllPage() {
    if (route.query.expand === undefined) history.replaceState({},"",route.fullPath+(route.fullPath.includes("?")?"&":"?")+"expand=1")
    usePixivFetch("/illust/"+id+"/pages", {"method":"GET",headers:{"X-User-Id":config.pxuserid}}).then((pay) => {
      multiimaged.value = true
      images.value.push(...pay.slice(1))
    })
  }
  if (route.query.expand) loadAllPage()

  let uilLoading = ref(false)

  let loadUgoira = ref(false)

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

  const mainStyle = ref("0")
  const imgvStyle = ref("120vh")
  const easing = ref("cubic-bezier(0.16, 1, 0.13, 1)")
  const fullImage = ref("") // it does count
  const fullImageLazy = ref("/facebook_male.png") // it does count
  const fIdx = ref(0)

  let animDir = ref("normal")

  import {useDisplay} from "vuetify"

  const d = useDisplay()

  function openImage(img, idx) {
    if (illustData.illustType === 2) return
    animDir.value = "normal"
    fullImage.value = proxyAssetUrl(img.urls.original)
    fullImageLazy.value = proxyAssetUrl(img.urls.small)
    mainStyle.value = "-20vh"
    imgvStyle.value = "0vh"
    fIdx.value = idx
    if (route.query.view === undefined) history.replaceState({},"",route.fullPath+(route.fullPath.includes("?")?"&":"?")+"view="+idx)
  }

  function closeImage() {
    console.log("send help")
    animDir.value = "reverse"
    mainStyle.value = "0vh"
    imgvStyle.value = "120vh"
    history.replaceState({},"",route.fullPath.replace((route.fullPath.includes("?")?"&":"?") +"view="+route.query.view), "")
  }

  function openImageP() {
    let h = route.query.view
    if (h !== undefined) {
      if (+h > 0) {loadAllPage()}
      openImage(images.value[+h], +h)
    }
  }

  function drawUgoiraFrame(asyncblob, ctx) {
    return () => {
      asyncblob.theb(b=>{
        ctx.drawImage(createImageBitmap(b),0,0)
      })
    }
  }

  const callbackhell = ({data: lo, frames: f, canvasContext: ctx}) => {
    const zip = new (require("jszip"))
    loadUgoira.value = true
    zip.loadAsync(lo).then(z=>{
      let dur = 0
      for (let i of frames) {dur+=i.delay}
      function loop() {
        for (let i of frames) {
          setTimeout(drawUgoiraFrame(z.file(i.name).async("blob"), ctx), i.delay)
        }
      }
      setInterval(loop, dur)
    })
  }

  function loadUgoiraF(canvas) {
    useFetch("/pxapi/illust/"+id+"/ugoira_meta?lang=en", {method: "GET",headers:{"X-User-Id":config.pxuserid}}).then(({data: pay}) => {
      let resp = pay._rawValue.body
      const src = proxyAssetUrl(resp.originalSrc)

      const frames = resp.frames

      useFetch(src, {method: "GET"}).then(n=>callbackhell({...n, ...{"frames": frames, "canvasContext": canvas.getContext("2d")}}))
    })
  }

  const uilSlideModel = ref(Object.keys(userIllustsData).findIndex(v=>v===id)) // actually it doesnt need to be ref since if it changes, user will be directed to a new artworks anyways

  function jpg2png() {
    const imgEl = document.querySelector("#imgview img")

    import("image-conversion").then(imgConv=>{
      imgConv.downloadFile(imgConv.canvastoFile(imgConv.imagetoCanvas(imgEl)), id+"_p"+fIdx.value+".png")
    })
  }

  </script>

<template>
  <div>
    <!--appbar zindex is 1006-->
    <div class="t" id="imgv" :style="{position:'fixed', zIndex:'1007', top: imgvStyle, left:'0', 'transition-timing-function': easing, height: '100%', width: '100%'}">
      <div style="z-index: 2000; ">
        <v-icon icon="mdi-arrow-left" size="x-large" style="z-index: 10" @click="closeImage()"></v-icon>
        <v-menu location="start">
          <template v-slot:activator="{props}">
            <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" style="position: absolute: right: 0; top: 0; z-index: 2000"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="jpg2png()">
              <v-list-item-title>Download as PNG</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-img id="imgview" style="position: absolute; left:auto; top:0" :src=fullImage :lazy-src="fullImageLazy" height="99%" width="100%" :eager="true"></v-img>
    </div>

    <div class="t" :style="{position:'relative', top: mainStyle, left:'0', 'transition-timing-function': easing}">
      <div id="illust-view">
        <v-sheet class="align-center text-center text-h6" rounded width="100%">
          <div>
            <p>{{illustData.title}}</p>
          </div>
        </v-sheet>
        <div>
          <template v-for="(i, idx) in images">
            <v-img v-show="!loadUgoira" :src="proxyAssetUrl(i.urls[d.smAndDown ? 'small' : d.md ? 'medium' : 'large'])" max-height=1000px width=98% id=illustImg class="mt-2 mb-2" @click="(illustData.pageCount!=1 && !multiimaged) ? loadAllPage() : openImage(i, idx)" @load="(illustData.illustType === 2) ? loadUgoiraF() : openImageP()"></v-img>
          </template>
          <canvas v-show="loadUgoira" class="pt-2 pb-2" style="max-height: 1000px" @show="loadUgoiraF(this.$el)"></canvas>

          <div class="d-flex justify-center">
            <v-btn 
              style="margin-left: auto; margin-right: auto; width: 100px; background-color: black" 
              v-if="illustData.pageCount!=1 && !multiimaged"
              @click="loadAllPage()"
            >See all</v-btn>

          </div>
            
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
          <div class="d-flex flex-wrap pt-4 pb-4">
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
              <NuxtLink :to="'/users/'+illustData.userId" class="uncolored-anchor">{{illustData.userName}}</NuxtLink>
              <template v-slot:append>
                <AButton href="/" btnStyle="text-none text-subtitle-4" style="display: inline; anchor: right">
                  <v-icon icon="mdi-plus"></v-icon>
                  Follow
                </AButton>
              </template>
            </v-list-item>
          </v-card-actions>
        </v-card>
        <div color="background" class="d-flex align-center w-100">
          <p class="text-center">Sending comments won't be available because i said so :troll_king:</p>
        </div>
        <v-sheet rounded>
          <v-slide-group v-model="uilSlideModel" center-active show-arrows id="userIllusts">
            <v-slide-group-item>
              <v-card class="d-flex justify-center align-center" v-if="current>0" @click="loadOld()">
                <v-icon v-if="!uilLoading" icon="mdi-menu-left-outline"></v-icon>
                <v-progress-circular v-if="uilLoading" color="primary" indeterminate />
              </v-card>
            </v-slide-group-item>
            <v-slide-group-item v-for="(illust, k) in userIllustsData">
              <Illust :data=illust :interact="k!=id" compact/>
            </v-slide-group-item>
            <v-slide-group-item>
              <v-card class="d-flex justify-center align-center" @click="loadOld()">
                <v-icon v-if="!uilLoading" icon="mdi-menu-right-outline"></v-icon>
                <v-progress-circular v-if="uilLoading" color="primary" indeterminate />
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
      <div class="pt-4">
        <Label>Related works</Label>
        <WorksDisplay v-if="related">
          <template v-for="i in related">
            <Illust :data="i" />
          </template>
        </WorksDisplay>
        <div v-if="related" class="d-flex justify-center">
          <v-btn @click="loadRelated()" :disabled="rLoading" :loading="rLoading">Load more</v-btn>
        </div>
        <div class="d-flex justify-center align-center" style="height: 80vh; width: 100vw" v-else>
          <p class="font-weight-bold">Nothing :(</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .t {
  	transition: top 0.4s, transform 0.4s; 
    animation-direction: v-bind(animDir);
  }

  #imgv {
    background: black
  }
</style>
p
