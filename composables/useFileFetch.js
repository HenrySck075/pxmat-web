
import {Buffer as Bufferr} from "buffer"

/**
* @param {string} url 
* @returns {Promise<Bufferr>}*/
export default function(url, options, chunkSize = 300000, progress = ()=>{}) {
  chunkSize = 600000
  console.log(chunkSize)
  chunkSize = chunkSize-1
  let cooking = false
  let opt = {...options}
  delete opt.headers.Cookie 
  opt.headers.Range = "bytes=0-1"
  return new Promise((resol, rejec)=>{
    useFetch(url, {...opt, async onResponse({response:resp}) {
      const ContentLength = + resp.headers.get("Content-Range").split("/")[1]
      console.log(ContentLength)
      let buf = [] // or bytes
      let opt = {...options}
      opt.headers["Range"] = ""
      if (ContentLength <= chunkSize) {
        opt.headers["Range"] = `bytes=0-${ContentLength-1}`
        const {data:p} = await useFetch(url, opt)
        buf.push(Bufferr.from(await p.value.arrayBuffer()))
        progress(1)
      }
      else {
        for (let a = 0; a < ContentLength/chunkSize; a++) {
          let dests = a*chunkSize+chunkSize
          
          opt.headers["Range"] = `bytes=${a*chunkSize}-${dests <= ContentLength ? dests : ContentLength-1}`
          const {data:p} = await useFetch(url, opt)
          buf.push(Bufferr.from(await p.value.arrayBuffer()))
          progress((a+1)*chunkSize/ContentLength)
        }
        progress(1)
      }
      resol(Bufferr.concat(buf))
    }

    })
  })
}
