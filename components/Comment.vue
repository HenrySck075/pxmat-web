<template>
  <v-sheet elevation="2" rounded style="display: flex" class="pt-4 pb-4">
    <div style="margin-right: 16px; display: block">
      <NuxtLink :to="'/users/'+data.userId">
        <v-avatar>
          <v-img :src="proxyURL(data.img)" :aspect-ratio="1" width="40px"></v-img>
        </v-avatar>
      </NuxtLink>
    </div>
    <div style="min-width: 10em; flex: auto">
      <NuxtLink :to="'/users/'+data.userId" class="font-weight-bold uncolored-anchor" style="line-height: 22px; text-decoration: none">{{data.userName}}</NuxtLink>
      <span v-if="data.comment" v-html="parse(data.comment)"></span>
      <v-img v-else :src="'/pxsprites/common/images/stamp/generated-stamps/'+data.stampId+'_s.jpg'" width="96px" height="96px" style="border-radius: 4px"></v-img>
      <span> 
        <span style="color: gray">{{data.commentDate}}</span>
        {{'   '}}
        <span style="color: #00509f">Reply</span>
      </span>
    </div>
  </v-sheet>
</template>

<script setup>
  defineProps(["data"])
  const proxyURL = useProxyURL
  const emojiMap = {
    "heart": "501"
  }
  function parse(content) {
    for (let i of Object.keys(this.emojiMap)) {
      content = content.replace("("+i+")", `<img src="/pxsprites/common/images/emoji/${emojiMap[i]}.png" style="width: 24px; height: 24px; vertical-align: -6px; margin: 0 2px"></img>`)
    }
    return "<p>"+content+"</p>"
  }
</script>
