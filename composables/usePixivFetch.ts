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
  options.query = {...options.query, "lang": "en", "version": "80dcae62e0e32c099b2eea96e0df6a621404b0ba"}
  // let d = useCookie("__utmv").value.split("=")
  // "X-User-Id": d[d.findIndex(v=>v==="user_id")+1]
  //@ts-ignore
  options.headers = {...options.headers, ...{"Referer": "https://www.pixiv.net/en", "X-User-Id": "76179633"}}
  // ensuring that this won't break when switching to routeRules
  // @ts-ignore
  return useFetch("http://localhost:3000/pxapi"+url, options).then(({data:p})=>p.value.body);
}
