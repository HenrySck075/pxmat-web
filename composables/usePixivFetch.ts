enum Method{"GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE", "PATCH"}
interface UseFetchOptions {
  method?: Method;
  query?: Record<string, any>;
  headers?: Record<string, string>;
}
export default function(url: string, options: UseFetchOptions) {
  // __utmv
  if (options.query === undefined) options.query = {lang: "en"}
  options.query["lang"] = "en"
  // @ts-ignore
  return useFetch("/pxapi"+url, options).then(({data: p})=>p.value.body);
}
