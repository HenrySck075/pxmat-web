<script setup>
  const r = useRoute()
  const id = r.params.id
  const resp = await useFetch("/pxapi/user/"+id+"/profile/top?lang=en").then(({data:n})=>n.value.body)

  let illustCount = 0 // passed from [id].vue
</script>

<template>
  <div>
    <Label>Illustrations and Manga</Label>
    <v-chip>{{illustCount}}</v-chip>
    <div class="d-flex flex-wrap">
      <template v-for="i in resp.illusts">
        <Illust :data="i" />
      </template>
    </div>
  </div>
</template>
