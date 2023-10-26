export default defineEventHandler((e) => {
  // return e.path
  e.headers.delete("Host")
  return proxyRequest(e, "https://www.pixiv.net/ajax/"+e.path.slice(7), {
    cookieDomainRewrite: {
      "*": ""
    },
    headers:{
      "X-User-Id": "76179633",
      "Referer": "https://www.pixiv.net/en"
    }
  })
})

