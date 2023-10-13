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
  options.headers = {...options.headers, Referer: "https://www.pixiv.net/en", "X-User-Id": d[d.findIndex(v=>v==="lang")-2]}
  // @ts-ignore
  return useFetch("/pxapi"+url, options).then(({data: p})=>p.value.body);
}
