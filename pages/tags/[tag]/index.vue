<script setup>
  const tag = useRoute().params.tag
  const {data: payload} = await useFetch("/pxapi/search/artworks/"+tag,{
    query: {
      lang: "en",
      word: tag,
      order:"date_d",
      type: "all",
      mode: "all",
      s_mode: "s_tag_full",
      p: "1"
    }
  })
  const resp = payload._rawValue.body

  const {data: payload2} = await useFetch("/pxapi/search/tags/"+tag+"?lang=en")
  const proxyAssetUrl = (a) => {
    if (a === undefined) return "/facebook_male.png"
    return a.replace("https:\/\/i.pximg.net","/pxassets")
  }
  const tagMeta = payload2._rawValue.body.pixpedia
  // program to generate random strings

  // declare all characters
  const characters ='23456789ABCDE';

  function saygex(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  function isLight(hex) {
    var rgb = parseInt(hex)
    return (0.2126 * ((rgb >> 16) & 0xff) + 0.7152 * ((rgb >> 8) & 0xff) + 0.0722 * ((rgb >> 0) & 0xff)) > 128
  }

  const ttKeys = Object.keys(resp.tagTranslation)
  useHead({
    title: resp.extraData.meta.title
  })
</script>

<template>
  <div>
    <v-img style="border-radius: 4px; width=100%; height=200px" :src="proxyAssetUrl(tagMeta.image)"></v-img>
    <v-sheet rounded elevation="2">
       <div class="d-flex justify-center align-center">
        <div>
          <v-img style="border-radius: 4px; width=50px" :src="proxyAssetUrl(tagMeta.image)"></v-img>
          <p class="text-h6">{{tagMeta.tag}}</p>
          <p class="text-h6">{{tagMeta.description}}</p>
        </div>
      </div>
      <v-slide-group>
        <v-slide-group-item v-for="i in resp.relatedTags">
          <v-sheet rounded @click="navigateTo('/tags/'+i)" class="ma-6" :color="saygex(6)">
            <p class="text-center text-weight-bold">{{i}}</p>
            <p class="text-center text-weight-light" v-if="ttKeys.includes(i)">{{resp.tagTranslation[i].en}}</p>
          </v-sheet>
        </v-slide-group-item>

      </v-slide-group>
      <v-card>
        <p class="text-h5 ma-4">Popular artworks</p>
        <div class="d-flex flex-wrap">
          <template v-for="illust in resp.popular.recent">
            <Illust :data=illust />
          </template>
          <template v-for="illust in resp.popular.permanent">
            <Illust :data=illust />
          </template>
        </div>
      </v-card>

      <v-card>
        <p class="text-h5 ma-4">Illustrations</p>
        <v-chip class="ma-2">{{resp.illustManga.total}}</v-chip>
        <v-spacer></v-spacer>
        <div class="d-flex flex-wrap">
          <template v-for="illust in resp.illustManga.data">
            <IllustOpt :id="illust.id" :thumbUrl=proxyAssetUrl(illust.url) />
          </template>
        </div>
      </v-card>
    </v-sheet>
  </div>
</template>
