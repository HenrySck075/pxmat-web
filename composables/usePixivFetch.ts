enum Method{"GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE", "PATCH"}
interface UseFetchOptions {
  method?: Method;
  query?: Record<string, any>;
  headers?: Record<string, string>;
}
export default function(url: string, options?: UseFetchOptions) {
  // __utmv
  if (!options) options = {}
  // const lang = utmv[utmv.findIndex((v)=>v==="lang")+1]
  let lang = "en"
  if (url.startsWith("/pxapi")) {url = url.slice(6)}
  if (!options.query) options.query = {"lang": lang}
  options.query["lang"] = lang
  let d = useCookie("__utmv").value.split("=")
  //@ts-ignore
  options.headers = {...options.headers, ...{"Referer": "https://www.pixiv.net/en", "Host": "pixiv.net", "X-User-Id": d[d.findIndex(v=>v==="user_id")+1]}}
  console.log(d)
  // ensuring that this won't break when switching to routeRules
  // @ts-ignore
  return useFetch("http://localhost:3000/pxapi"+url, options).then(({data:p})=>p.value.body);
}
