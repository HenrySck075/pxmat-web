import ns from "nuxt-storage"

/**
* Will return falsy value if value is not undefined*/
export default function<Value>(name: string, value: Value | undefined): Value {
  if (value !== undefined) {
    ns.localStorage.setData(name, value); 
    return value
  }
  else return ns.localStorage.getData(name)
}
