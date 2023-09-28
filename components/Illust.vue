<template>
  <v-card elevation="2" width="200px" class="ma-6">
    <v-img :src=proxyAssetUrl(data.url) max-height="400px" @click="interact ? this.$router.push({path:'/artworks/'+data.id}) : null" style="position: relative">
      <v-chip style="position: absolute; top:5px; left: 12px; background-color: red; border-radius: 4px" class="pa-2" v-if="data.xRestrict">R-18</v-chip>
      <v-chip style="position: absolute; top:5px; left: 12px; background-color: #D6BA49; border-radius: 50%" class="pa-2" v-if="ranking==1">{{ranking}}</v-chip>
      <v-chip style="position: absolute; top:5px; left: 12px; background-color: #858585; border-radius: 50%" class="pa-2" v-if="ranking==2">{{ranking}}</v-chip>
      <v-chip style="position: absolute; top:5px; left: 12px; background-color: #C8A17E; border-radius: 50%" class="pa-2" v-if="ranking==3">{{ranking}}</v-chip>
      <v-chip style="position: absolute; top:5px; left: 12px; background-color: rgba(133,133,133,0.5); border-radius: 50%" class="pa-2" v-if="ranking>3">{{ranking}}</v-chip>
    </v-img>
    <v-card-title v-if="!compact">{{data.title}}</v-card-title>
    <v-card-actions v-if="!compact">
      <v-list-item class="w-100">        
        <template v-slot:prepend>
          <v-img :src=proxyAssetUrl(data.profileImageUrl) aspect-ratio="1" lazy-src="/facebook_male.png"></v-img>
        </template>
        <v-list-item-title>{{data.userName}}</v-list-item-title>
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
      followed: false,
      toggleFollow(elm) {
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
