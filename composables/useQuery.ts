export default function<Value = string | number | boolean | undefined | null>(key: string, value: Value): Value {
  const r = useRoute()
  if (r.query[key] === undefined && value !== undefined) {
    if (value !== null) history.replaceState({},"",r.fullPath+(r.fullPath.includes("?")?"&":"?")+key+"="+value.toString())
    else {history.replaceState({},"",r.fullPath.replace((r.fullPath.includes("?")?"&":"?")+key+"="+r.query[key], ""))}
  }
  return value
}
