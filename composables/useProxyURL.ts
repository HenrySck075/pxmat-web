export default function (a: String) {
  if (a === undefined) return ""
  return a.replace("https:\/\/s.pximg.net","/pxsprites").replace("https:\/\/i.pximg.net","/pxassets")
}
