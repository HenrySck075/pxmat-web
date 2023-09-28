<script setup>
</script>

<template>
  <div>
    <div class="d-flex flex-wrap">
      <v-btn class="text-none" color="background">Users you're following</v-btn>
    </div>
    <v-spacer></v-spacer>
    <v-tabs v-model=tab bg-color="transparent">
      <v-tab value="illust" class="text-none">Illustrations and Manga</v-tab>
      <v-tab value="novel" class="text-none">Novel</v-tab>
    </v-tabs>
    <NuxtPage />
  </div>
</template>

<script>
  export default {
    data: () => ({
      tab: useRoute().path.split("/").slice(-1)[0],
    })
  }
</script>
