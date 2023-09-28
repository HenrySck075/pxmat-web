real


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

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# Before wandering around (project setup)
- You need to set your pixiv instance's cookies to the site for the followimg features to work:
+ everything

here's how you set your cookies after obtaining it: 
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

<template>
  <div>
    numero 5, smurf catto
  </div>
</template>
```
after setting cookies, refresh

- Set the Pixiv_User_Id environment variable to your pixiv user id 
- h

# Known issues
- Pages that uses query (`/tags/[tag]`, `/bookmarks`, ...) does not reload if it's entered before even with different query values

