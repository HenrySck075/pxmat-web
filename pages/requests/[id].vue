<script setup>
  import storage from "nuxt-storage"
  const r = useRoute()
  const id = r.params.id

  const req = storage.sessionStorage.getData("requests")[id]

  useHead({
    title: "Send a request to "+""+" | pixiv Material Design Concept"
  })
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
      <div>
         Request history goes here
         <Illust :data="req.illustData" />
      </div>
    </v-sheet>
  </div>
</template>
