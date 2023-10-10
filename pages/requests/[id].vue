<script setup>
  import storage from "nuxt-storage"
  const r = useRoute()
  const id = r.params.id

  const req = storage.localStorage.getData("requests")

  useHead({
    title: "Send a request to "
  })
</script>

<template>
  <div>
  </div>
</template>
