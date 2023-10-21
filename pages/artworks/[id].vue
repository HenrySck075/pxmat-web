<script setup>
  // illustType
  // 0: single-image 
  // 1: multi-image 
  // 2: ugoira
  const route = useRoute()
  let id = route.params.id
  const config=useRuntimeConfig()

  const s = (a, b) => a>b

  const illustData = await usePixivFetch(`/illust/${id}?ref=https://www.pixiv.net/en`,{method:"GET"})
  const userIllusts = Object.keys(illustData.userIllusts).sort(s)
  const comments = ref([])
  const hasNext = ref(true)
  const chillBro = ref(false)
  let cOffset = 3

  async function loadPreviewComments() {
    const real = await usePixivFetch("/illusts/comments/roots", {query: {
      illust_id: id,
      offset: 0,
      limit: 3
    }})
    comments.value = real.comments 
    hasNext.value = real.hasNext
    console.log(comments)
  }

  async function loadMoreComments() {
    chillBro.value = true
    let me = await usePixivFetch("/illusts/comments/roots", {query: {
      illust_id: id,
      offset: cOffset,
      limit: 50
    }})
    hasNext.value = me.hasNext
    comments.value.push(...me.comments)
    if (hasNext.value) cOffset+=me.comments.length
  }

  const commentsDisabled = !!illustData.commentOff
  if (!commentsDisabled) await loadPreviewComments()

  let related = ref([])
  let relatedNextIds = []

  const rLoading = ref(false)

  async function loadRelated() {
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

  const proxyUrl = (a) => {
    if (a === undefined) return ""
    return a.replace("https:\/\/i.pximg.net","/pxugoira")
  }
  const proxyAssetUrl = useProxyURL

  let current = userIllusts.indexOf(id) + 3
  let range = 9
  const userIllustsData = ref({})

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
    useQuery("expand", 1)
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
    useQuery("view", idx)
  }

  function closeImage() {
    console.log("send help")
    animDir.value = "reverse"
    mainStyle.value = "0vh"
    imgvStyle.value = "120vh"
    useQuery("view", null)
  }

  function openImageP() {
    let h = route.query.view
    if (h !== undefined) {
      if (+h > 0) {loadAllPage()}
      openImage(images.value[+h], +h)
    }
  }

  // promises hell
  function drawUgoiraFrame(asyncblob, ctx) {
    return () => {
      asyncblob.then(b=>{
        createImageBitmap(b).then(pr=>ctx.drawImage(pr,0,0))
      })
    }
  }

  function callbackhell({data: lo, frames: f, canvasContext: ctx}) {
    // promises are just too funny sorry guys
    console.log("smurf cat")
    import("jszip").then(zip=>{
      zip.loadAsync(lo).then(z=>{
        let dur = 0
        let frameblob = {}
        for (let i of f) {
          dur+=i.delay
          frameblob[i.file] = z.file(i.file).async("blob")
        }
        loadUgoira.value = true
        function loop() {
          let last = 0
          for (let i of f) {
            last += i.delay
            setTimeout(drawUgoiraFrame(frameblob[i.file], ctx), last)
          }
        }
        setInterval(loop, dur)
      })
    })
  }

  let ugoiraSrc = ["", ""]
  let ugoiraFrames = []

  function loadUgoiraF() {
    /**@type {HTMLCanvasElement}*/
    const canvas = document.querySelector("#ugoiraCanvas")
    const imageRect = document.querySelector("#illustImg").getBoundingClientRect()
    console.log(imageRect)
    canvas.width = 0+imageRect.width
    canvas.height = 0+imageRect.height
    usePixivFetch("/illust/"+id+"/ugoira_meta", {method: "GET"}).then((resp) => {
      ugoiraSrc = [resp.originalSrc, resp.src]
      const src = proxyAssetUrl(resp.src)

      const frames = resp.frames
      ugoiraFrames = frames

      import("jszip-utils").then(jzutil=>{
        jzutil.getBinaryContent(src, (e,n)=>{callbackhell({data: n, "frames": frames, "canvasContext": canvas.getContext("2d")})})
      })
    })
  }

  const uilSlideModel = ref(Object.keys(userIllustsData).findIndex(v=>v===id)) // actually it doesnt need to be ref since if it changes, user will be directed to a new artworks anyways

  // converters
  function jpg2png() {
    const imgEl = document.querySelector("#imgview img")

    import("image-conversion").then(imgConv=>{
      imgConv.imagetoCanvas(imgEl).then(i=>imgConv.canvastoFile(i, undefined, "image/png")).then(b=>imgConv.downloadFile(b, id+"_p"+fIdx.value+".png"))
    })
  }

  async function ugoira2gif(srci = 1) {
    Promise.all([import("jszip"), import("jszip-utils"), import("gif-encoder-2")]).then(([jszip,jzutil,gifenc])=>{
      jzutil.getBinaryContent(ugoiraSrc[srci], async (e,n)=>{
        const z = await jszip.loadAsync(n)
        const [w,h] = ugoiraSrc[srci].slice(0,-4).split("_ugoira")[1].split("x")
        const gif = new gifenc.GIFEncoder(+w,+h,"neuquant",false,ugoiraFrames.length)
        const offscreen = new OffscreenCanvas(+w,+h)
        const ctx = offscreen.getContext("2d")
        gif.setFrameRate(30)
        gif.start()
        for (let i of ugoiraFrames) {
          gif.setDelay(i.delay)
          ctx.drawImage(await createImageBitmap(await z.file(i.file).async("blob")),0,0)
          gif.addFrame(ctx)
        }
        gif.finish()
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([gif.out.getData()]))
        link.download = id+"_"+w+"x"+h+".gif"
        document.body.appendChild(link)
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', false, false)
        link.dispatchEvent(evt)
        document.body.removeChild(link)
      })
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
            <v-img v-show="!loadUgoira" :src="proxyAssetUrl(i.urls[d.smAndDown ? 'small' : d.md ? 'medium' : 'large'])" max-height=1000px width=98% id=illustImg class="mt-2 mb-2" @click="(illustData.pageCount!=1 && !multiimaged) ? loadAllPage() : openImage(i, idx)" @load="(illustData.illustType === 2) ? (()=>{loadUgoiraF()})() : openImageP()"></v-img>
          </template>
          <div class="d-flex justify-center" v-show="loadUgoira">
            <canvas class="pt-2 pb-2" style="max-height: 1000px" id="ugoiraCanvas"></canvas>
          </div>

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
        <div color="background" class="align-center w-100 pa-8" v-if="!commentsDisabled">
          <p class="font-weight-bold">Comments</p>
          <div id="commentsection">
            <template v-for="i in comments" :key="i">
              <Comment :data=i />
            </template>
          </div>
          <v-btn @click="loadMoreComments()" :disabled="chillBro" :loading="chillBro" v-if="hasNext">Load more</v-btn>
        </div>
        <v-sheet rounded>
          <v-slide-group v-model="uilSlideModel" center-active id="userIllusts">
            <v-slide-group-item>
              <v-card class="d-flex justify-center align-center" width="50px" v-if="current>0" @click="loadOld()">
                <v-icon v-if="!uilLoading" icon="mdi-menu-left-outline"></v-icon>
                <v-progress-circular v-if="uilLoading" color="primary" indeterminate />
              </v-card>
            </v-slide-group-item>
            <v-slide-group-item v-for="(illust, k) in userIllustsData">
              <Illust :data=illust :interact="k!=id" compact/>
            </v-slide-group-item>
            <v-slide-group-item>
              <v-card class="d-flex justify-center align-center" width="50px" @click="loadNew()">
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
