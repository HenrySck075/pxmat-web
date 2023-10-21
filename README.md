real
also hey this isnt a place to store your code henry

# Nuxt Setup

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# Before wandering around (project setup)
- You need to set your pixiv instance's cookies to the site for the followimg features to work:
+ everything except playground (in most cases)

UPDATE: cookies are now prompted if required cookie(s) is not set so use that

here's how you previously set your cookies after obtaining it: 
```
<script setup>
  let cookie = {}
  const cook = {
     the cookies as json 
  }

  for (let i of Object.keys(cook)) {
    let e = useCookie(i,{expires:new Date("2030-12-31T23:59:59"),default:()=>0})
    e.value = cook[i]
    cookie[i] = e
  }
</script>

 (in most cases)<template>
  <div>
    numero 5, smurf catto
  </div>
</template>
```
after setting cookies, refresh

# Known issues
- Pages that uses query (`/tags/[tag]`, `/bookmarks`, ...) does not reload if it's entered before even with different query values (e.g. Search filters)
- ~~Going back in history after opening illust in full view returns to the previous artwork as the history stack is replaced (keep it like that)~~ Ok so pixiv desktop also does this, it's just mobile adding #big_idx hash fsr
- Avatars sometimes hidden for some reason
- `composables/useFileFetch.js`: Content-Length header is missing in HEAD request, using full file fetch rn
- Cookies sometimes refuses to work on some devices, even if it's the same shit (i cant work on pc now :sadge:)

# some funky dev stuff
- Every page needs to have `filter` variable for filtering
  + Option structure: 
  ```
  {
      r18: boolean,
      before: Date,
      after: Date
  }
  ```
- Always restart server when modifying composables, hmr doesn't work on my machine

# TODO:
- Download dialog
- Ugoira download (as gif)
- User dropdown
- Finish `tags/`, `users/`, `bookmarks/`
