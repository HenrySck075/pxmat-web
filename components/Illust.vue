<template>
  <v-card elevation="2" width="200px" :class="!compact?'ma-6':''">
    <NuxtLink :to="'/artworks/'+data.id" :custom=!interact class="uncolored-anchor">
      <v-img :src=proxyAssetUrl(data.url) max-height="400px" :style="{position: 'relative', opacity: imgOpacity}" @mouseover="imgOpacity = 0.6" @mouseleave="imgOpacity = 1">
        <!--pixiv will never rank nsfw so dont worry-->
        <v-chip style="font-size: 10px; position: absolute; top:5px; left: 12px; background-color: rgb(255,64,96); border-radius: 4px" class="pa-2" v-if="data.xRestrict">R-18</v-chip>
        <v-chip :style="{fontSize: '10px', position: 'absolute', top: '5px', left: '12px', backgroundColor: ranking==1 ? '#D6BA49' : ranking==2 ? '#858585' : ranking==3 ? '#C8A17E' : 'rgba(133,133,133,0.5)', borderRadius: '50%'}" class="pa-2" v-if="ranking">{{ranking}}</v-chip>
        <v-chip style="font-size: 10px; position: absolute; top:5px; right:12px; background-color: rgba(133,133,133,0.5)" v-if="data.pageCount>1" class="pa-2">{{data.pageCount}}</v-chip>
        <v-icon style="background-color: rgba(133,133,133,0.5); position: absolute; margin: auto; display: block; width: 35px" size=35px icon="mdi-play" v-if="data.illustType == 2"></v-icon>
      </v-img>
    </NuxtLink>
    <v-card-title v-if="!compact">{{data.title}}</v-card-title>
    <v-card-actions v-if="!compact">
      <v-list-item class="w-100">        
        <NuxtLink :to="'/users/'+data.userId" class=uncolored-anchor v-if=!userPage>
          <div class="d-flex justify-start">
            <v-img :src=proxyAssetUrl(data.profileImageUrl) :aspect-ratio="1" height=30px lazy-src="/facebook_male.png"></v-img>
            <span>{{data.userName}}</span>
          </div>
        </NuxtLink>
         <template v-slot:append>
          <div class="justify-self-end">
            <v-btn icon="mdi-heart-outline" v-if="!followed" @click="toggleFollow(this)"></v-btn>
            <v-btn icon="mdi-heart" v-if="followed"></v-btn>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      data: Object,
      interact: {
        type: Boolean,
        default: () => true
      },
      compact: {
        type: Boolean,
        default: () => false
      },
      userPage: {
        type: Boolean,
        default: () => false
      },
      ranking: {
        type: String,
        default: () => "" // false so ok
      }
    },
    data: () => ({
      proxyAssetUrl: (a) => {
        if (a === undefined) return ""
        return a.replace("https:\/\/i.pximg.net","/pxassets")
      },
      imgOpacity: 1,
      followed: false,
      toggleFollow: (elm) => {
        useFetch("/pxapi/illusts/bookmarks/add",{
          method: "POST",
          body: JSON.stringify({
            illust_id: id,
            comment: "",
            restrict: 0,
            tags: []
          })
        }).then(d=>{
          followed = true
        })
      }
    })
  }
</script>
