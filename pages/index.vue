<script setup>  
  useHead({
    title: "Online community for artists [pixiv Material Design Concept]"
  })

  const {data:h} = await useFetch("/pxapi/top/illust?mode=all&lang=en&version=3293428791d78bc27e839167e71ceabcb899355e", {
    method: "GET",
    headers: {"Referer": "https://www.pixiv.net/en"}
  })

  const resp = h._rawValue.body

  const homeIllustPayload = resp.thumbnails.illust
  const homePages = resp.page
  const homeIllustData = (() => {
    let h = {}
    for (let i of homeIllustPayload) {
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

  const proxyAssetUrl = (a) => {
    if (a === undefined) return ""
    return a.replace("https:\/\/i.pximg.net","/pxassets")
  } 
  let tab = ref(null)
</script>

<template>
  <v-sheet>
    <v-tabs v-model="tab" color="primary" fixed-tabs >
      <v-tab value="illust">Illustration</v-tab>
      <v-tab value="manga">Manga</v-tab>
      <v-tab value="novel">Novels</v-tab>

    </v-tabs>
    <v-window v-model="tab" :touch="{left: null, right: null}">
      <v-window-item value="illust">
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
        <div class="d-flex flex-wrap justify-start">
          <div v-for="illust in homePages.recommend.ids">
            <Illust :data=homeIllustData[illust] />
          </div>
        </div>
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
              <v-sheet rounded color="background" class="pa-2 ma-6" width="400px">
                <span v-html="i.requestProposal.requestOriginalProposalHtml"></span>
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
                <v-img :src="proxyAssetUrl(i.thumbnailUrl)" style="position: relative">
                  <p style="word-wrap: normal; position: absolute; bottom: 2px; left: 2px">{{i.title}}</p>
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
        <div>
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
        <template v-for="i in homePages.recommendByTag">
          <div class="pt-2">
            <Label>Recommended illustrations tagged #{{i.tag}}</Label>
            <div class="d-flex flex-wrap justify-start">
              <template v-for="j in i.ids">
                <Illust :data="homeIllustData[j]" />
              </template>
            </div>
          </div>
        </template>
      </v-window-item>

      <v-window-item value="manga">
        Nothing here for now
      </v-window-item>

      <v-window-item value="novel">
        Nothing here for now
      </v-window-item>
    </v-window>
  </v-sheet>
</template>
