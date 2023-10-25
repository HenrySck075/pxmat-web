
declare module "nuxt-storage" {
  declare namespace localStorage {
    function getData<value>(key: string): value
    function setData(key: string, value: any, expiry?: number, expiryUnit?:  "s"|"m"|"h"|"d"): void
    function removeItem(key: string): void
    function clear(): void
  }
  declare namespace sessionStorage {
    function getData<value>(key: string): value
    function setData(key: string, value: any, expiry?: number, expiryUnit?:  "s"|"m"|"h"|"d"): void
    function removeItem(key: string): void
    function clear(): void
  }
}
