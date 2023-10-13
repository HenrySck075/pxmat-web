<script setup>
  const r = useRoute()
  const id = r.params.id
  const resp = await usePixivFetch("/user/"+id+"/profile/top") // not really just checking if user have a type of work
  const emit = defineEmits(["tabmod"]);
  emit("tabmod",{illusts: !!resp.illusts, manga: !!resp.manga, novels: !!resp.novels})
  
</script>

<template>
  <div>
    <Label>Illustrations and Manga</Label>
    <WorksDisplay>
      <template v-for="i in resp.illusts">
        <Illust :data="i" />
      </template>
    </WorksDisplay>
    <div class="d-flex justify-center">
      <NuxtLink :to="r.path+'/artworks'">
        <v-btn class="text-none w-99">See all</v-btn>
      </NuxtLink>
    </div>
    <p>wtf is booth btw</p>
  </div>
</template>
