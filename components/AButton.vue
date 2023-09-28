<template>
  <div>
    <NuxtLink :to="href">
      <v-btn elevation="2" variant="elevated" :style=btnStyle>
        <slot></slot>
      </v-btn>
    </NuxtLink>
  </div>
</template>

<script>
  export default {
    props: ["href", "btnStyle", "btn-variant"]
  }
</script>
