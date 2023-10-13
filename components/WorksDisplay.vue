<template>
  <div style="display: grid; grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );">
    <slot />
  </div>
</template>

<style>
  .WorksDisplay > div {
    display: flex;
    align-items: center;
    justify-content: center
  }
</style>
