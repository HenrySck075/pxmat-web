<script setup>
  const tag = useRoute().params.tag 
  const resp = await usePixivFetch("/search/top/"+tag,{
    query: {
      word: tag,
      order:"date_d",
      type: "all",
      mode: "all",
      s_mode: "s_tag_full",
    }
  })

  const proxyAssetUrl =useProxyURL 
  const ttKeys = Object.keys(resp.tagTranslation)
  useHead({
    title: resp.extraData.meta.title
  })
</script>

<template>
  <div>
    <v-sheet>
      <v-slide-group>
        <v-slide-group-item v-for="i in resp.relatedTags">
          <v-sheet rounded @click="navigateTo('/tags/'+i)" class="pa-6">
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
            <Illust compact :data=illust />
          </template>
        </div>
      </v-card>
    </v-sheet>
  </div>
</template>
