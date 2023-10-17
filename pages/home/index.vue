<script setup>
  useHead({
    title: "Online community for artists [pixiv Material Design Concept]"
  })
  
  const route = useRoute()

  const resp = await usePixivFetch("/top/illust?mode=all", {
    method: "GET",
    headers: {"Referer": "https://www.pixiv.net/en"}
  })

  // avoid lag on main menu fron the "Recommended by tag" elements
  const rbtExpand=reactive((()=>{
    let d = []
    for (let h = 0; h < resp.page.recommendByTag.length; h++) {
      d.push(false)
    }
    return d
  })())

  const homePages = resp.page

  const homeIllustData = (() => {
    let h = {}
    for (let i of resp.thumbnails.illust) {
      h[i.id] = i
    }
    return h
  })()

  const users = (()=>{
    let h = {}
    for (let i of resp.users) {
      h[i.userId] = i
    }
    return h
  })()

  useSessionData("requests", (()=>{
    let h = {}
    for (let i of resp.requests) {
      h[i.requestId] = {
        ...i,
        illustData: homeIllustData[i.postWork.postWorkId],
        userPartial: {
          requester: users[i.fanUserId] ?? null, // accessing undefined keys returns undefined so making it null is funnier
          creator: users[i.creatorUserId]
        }
      }
    }
    return h
  })())

  function toMonth(s) {
    switch (s) {
      case "01": return "Jan"
      case "02": return "Feb"
      case "03": return "Mar"
      case "04": return "Apr"
      case "05": return "May"
      case "06": return "Jun"
      case "07": return "Jul"
      case "08": return "Aug"
      case "09": return "Sep"
      case "10": return "Oct"
      case "11": return "Nov"
      case "12": return "Jan"
    }
  }

  const proxyAssetUrl = useProxyURL
  let tab = ref(route.query.tab ?? "illust")

  /**
  @param {{r18: boolean}} f
  */
  function filter(f) {}

</script>

<template>
  <div>
    <v-slide-group>
      <v-slide-group-item v-for="i in resp.relatedTags">
        <v-sheet rounded @click="navigateTo('/tags/'+i)" class="ma-6">
          <p class="text-center text-weight-bold">{{i}}</p>
          <p class="text-center text-weight-light" v-if="ttKeys.includes(i)">{{resp.tagTranslation[i].en}}</p>
        </v-sheet>
      </v-slide-group-item> 
    </v-slide-group>

    <!--illusts-->
    <p class="text-h6 font-weight-bold pl-6 pt-4">Works by following users</p>
    <v-slide-group show-arrows>
      <v-slide-group-item v-for="illust in homePages.follow">
        <Illust :data=homeIllustData[illust] />
      </v-slide-group-item>
    </v-slide-group>
    <p class="text-h6 font-weight-bold pl-6">Recommended works</p>
    <WorksDisplay>
      <template v-for="illust in homePages.recommend.ids">
        <Illust :data=homeIllustData[illust] />
      </template>
    </WorksDisplay>
    <v-spacer></v-spacer>
    <!--rank-->
    <div>
      <p style="color: gray; font-size: 12px" class="pl-6">Daily ranking</p>
      <p class="pl-6 font-weight-bold">{{toMonth(homePages.ranking.date.slice(4,6))}} {{homePages.ranking.date.slice(-2)}} ranking</p>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="(illust,idx) in homePages.ranking.items" :key=idx :value="illust">
          <Illust :data=homeIllustData[illust.id] :ranking=illust.rank />
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <!--request-->
    <div class="pt-6">
      <p class="font-weight-bold pl-4">Requested works</p>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="i in resp.requests">
          <v-sheet :title="i.requestProposal.requestOriginalProposal" rounded color="background" class="pa-2 ma-6" width="400px">
            <NuxtLink :to="'/requests/'+i.requestId" class="uncolored-anchor">
              <p style="display: -webkit-box; -webkit-line-clamp: 6; width: 400px; text-overflow: ellipsys; overflow-wrap: break-word; overflow: hidden; -webkit-box-orient: vertical; hyphens: auto;" >{{i.requestProposal.requestOriginalProposal}}</p>
            </NuxtLink>
            <Illust :data="homeIllustData[i.postWork.postWorkId]" compact/>
          </v-sheet>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <v-spacer></v-spacer>
    <!--pixivision-->
    <div>
      <Label>New on pixivision</Label>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="i in homePages.pixivision">
          <v-sheet rounded color="background" @click="navigateTo(i.url,{external: true})" width="450px" class="pl-4 pr-4">
            <v-img :src="proxyAssetUrl(i.thumbnailUrl)" style="position: relative" class="pixivision">
              <p style="word-wrap: normal; position: absolute; bottom: 2px; left: 2px" class="font-weight-bold">{{i.title}}</p>
            </v-img>
          </v-sheet>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <!--Ongoing contests--->
    <div>
      <Label>Ongoing contests</Label>
      <div v-for="i in homePages.contestOngoing" style="width: 100%">
        <v-card :href="i.url" target="_blank">
          <v-card-actions>
            <v-list-item class="w-100">
              <template v-slot:prepend>
                <v-img style="width: 14px" :aspect-ratio="1" :src=proxyAssetUrl(i.iconUrl)></v-img>
              </template>
              <v-list-item-title>{{i.name}}</v-list-item-title>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <!--Recommended tags--> 
    <div v-if="false">
      <Label>Popular tags</Label>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="i in homePages.tags">
          <v-img :src="proxyAssetUrl(homeIllustData[i.ids[0]].urls['540x540'])" style="position: relative" @click="navigateTo('/tags/'+i.tag)" eager>
            <p class="pl-2 pr-2 pb-2" style="position: absolute; bottom: 1px">{{i.tag}}</p>
          </v-img>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <!--Recommended users-->
    <div class="pt-2">
      <Label>Recommended users</Label>
      <v-slide-group>
        <v-slide-group-item v-for="i in homePages.recommendedUser" >
          <v-card width="391.993px">
            <div class="d-flex">
              <template v-for="j in i.illustIds">
                <v-img width="130.664px" eager :aspect-ratio="1" :src=homeIllustData[j].url></v-img>
              </template>
            </div>
            <v-card-actions>
              <template v-slot:prepend>
                <v-img width="14px" :aspect-ratio="1" :src="users[i.id]"></v-img>
              </template>
            </v-card-actions>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <!--Recommended illusts of a tag -->
    <template v-for="(i, idx) in homePages.recommendByTag">
      <div class="pt-2">
        <Label>Recommended illustrations tagged <NuxtLink class="uncolored-anchor" :to="'tags/'+i.tag">#{{i.tag}}</NuxtLink></Label>
        <WorksDisplay>
          <!--https://vuejs.org/guide/essentials/conditional.html#v-if-with-v-for-->
          <template v-for="(j,idd) in i.ids">
            <Illust :data="homeIllustData[j]" v-if="idd < 4 || rbtExpand[idx]"/>
          </template>
        </WorksDisplay>
        <v-btn class="w-100" @click="rbtExpand[idx] = true" v-if="!rbtExpand[idx]">Expand</v-btn>
      </div>
    </template>
  </div>
</template>
<style>
.pixivision:before {
  content: '';
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5));
  width: 450px;
  height: 250px;
  pointer-events: none;
}
</style>
