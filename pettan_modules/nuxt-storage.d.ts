enum ExpiryUnit{'s',"m","h","d"}


declare module "nuxt-storage" {
  declare namespace localStorage {
    function getData<value>(key: string): value
    function setData(key: string, value: any, expiry?: number, expiryUnit?: ExpiryUnit): void
    function removeItem(key: string): void
    function clear(): void
  }
  declare namespace sessionStorage {
    function getData<value>(key: string): value
    function setData(key: string, value: any, expiry?: number, expiryUnit?: ExpiryUnit): void
    function removeItem(key: string): void
    function clear(): void
  }
}
