<script setup>
  const id = useRoute().params.id

  const userResp = await useFetch("/pxapi/user/"+id+"?full=1").then(({data:pl})=>pl.value.body)
</script>
<template>
  <div>
    {{userResp}}
  </div>
</template>
