export default defineEventHandler(e=>{
  e.headers.getSetCookie().forEach(c=>{
    e.headers.append("Set-Cookie", c.replace("Secure;",""))
  })
})
