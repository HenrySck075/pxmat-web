export default defineEventHandler(e=>{
  e.headers.getSetCookie().forEach(c=>{
    console.log(c)
    e.headers.append("Set-Cookie", c.replace("Secure;",""))
  })
})
