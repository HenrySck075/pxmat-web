<script setup>
  const r = useRoute()
  const id = r.params.id

  /**@type {pxRequestFetchBody}*/
  const data = await usePixivFetch("/commission/page/requests/"+id, {query: {refresh: false}}) 
  const req = data.requests[0]
  /**@type {Record<string,pxUser>}*/
  const users = (()=>{
    let h = {}
    for (let i of data.users) {
      h[i.userId] = i
    }
    return h
  })()
  useHead({
    title: data.ogp.page_title + " Material Design Concept",
  })
  const proxyURL = useProxyURL
  /**git reference*/
  let commitHistory = [
    {
      img: req.fanUserId ? proxyURL(users[req.fanUserId].image) : "/facebook_male.png",
      content: (req.fanUserId ? '<span class="font-weight-bold" style="color: white">'+users[req.fanUserId].name+"</span>" : "An anonymous user") + " sent a request via "+req.plan.planTitle.planTranslationTitle[useLocalData("config").lang].planTitle,
      // its twemoji
      emojiUrl: "/pxsprites/special/twemoji-14.0.2/assets/72x72/1f48c.png"
    }
  ]

  const gato = '<span class="font-weight-bold" style="color: white">'+users[req.fanUserId].name+"</span>"
  // accept status can be not if the requester views the page 
  if (req.plan.planAcceptRequestFlg) {
    commitHistory.push({
      img: users[req.creatorUserId].image,
      content: geto + " accepted the request ",
      emojiUrl: "/pxsprites/special/twemoji-14.0.2/assets/72x72/1f44d.png"
    })
  }
</script>

<template>
  <div class="d-flex justify-center">
    <v-sheet elevation="2" class="ma-8">
      <div>
        <v-chip color="rgb(0,112,255)">Completed</v-chip>
        <div>
          <p class="text-subtitle-1" style="color: gray">Illustration request</p>
          <p>{{req.requestProposal.requestTranslation}}</p>
          <p class="text-subtitle-1 pt-4" style="color: gray">Untranslated text</p>
          <p v-html="req.requestProposal.requestOriginalProposalHtml"></p>
          <div class="d-flex flex-wrap justify-start pt-4">
            <NuxtLink :to="'/tags/'+i" v-for="i in req.tags" :key="i">#{{i}}</NuxtLink>
          </div>
        </div>
      </div>
      <v-sheet elevation="2">
        <div v-for="i in commitHistory" :key="i" class="pt-2 pl-4">
          <div style="margin-right: 16px; display: block">
            <v-avatar>
              <v-img :src="i.img" :aspect-ratio="1" width="40px"></v-img>
            </v-avatar>
          </div>
          <div style="min-width: 10em; flex: auto">
            <span v-html="i.content+`<img src='${i.emoji}'></img>`"></span>
          </div>
        </div>
      </v-sheet>
    </v-sheet>
  </div>
</template>
