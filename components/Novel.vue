<template>
  <div>
    <v-container class="bg-background-variant pa-4" style="width: 500px">
      <v-row no-gutter align="start">
        <v-col>
          <NuxtLink :to="'/novel/'+data.id">
            <v-img style="width: 299px" class="pl-1 pr-1" :src=proxyAssetUrl(data.url) height=200px></v-img>
          </NuxtLink>
        </v-col>
        <v-col>
          <div class="pl-auto pr-auto">
            <p style="text-overflow: ellipsys; overflow: hidden; white-space: " class="font-weight-bold text-h6">{{data.title}}</p>
            <p style="text-overflow: ellipsys; color: gray; overflow: hidden; overflow-wrap: break-word; -webkit-line-clamp: 3; -webkit-box-orient: vertical; hyphens: auto; display: -webkit-box" class=text-subtitle-1 v-html=data.description v-if="!editorPicks"></p>
            <div class="d-flex" v-if="!editorPicks">
              <span style="color: gray">{{data.textCount.toLocaleString("en-US")}} character(s)</span>
              <span style="color: gray">{{secondsToHM(data.readingTime)}}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    props: {"data": {}, "editorPicks": {type: Boolean, default: ()=>false}},
    methods: {
      proxyAssetUrl: (a) => {
        if (a === undefined) return ""
        return a.replace("https:\/\/i.pximg.net","/pxassets")
      },
      secondsToHM: (d) => {
        var h = Math.floor(d/3600)
        var m = Math.floor(d%3600/60)

        var hDisplay = h > 0 ? h + (h == 1 ? "hr " :"hrs " ) : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "min" : "mins" ) : "" 

        return hDisplay+mDisplay
      }
    }
  }
</script>
