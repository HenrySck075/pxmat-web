<template>
  <canvas @click="h(this)" width="500px" height="500px"></canvas>
</template>

<script>
  export default {
    data: () => ({
      tab: "two",
    }),
    methods: {
      h(t) {console.log(t.$el)}
    }
  }
</script>
