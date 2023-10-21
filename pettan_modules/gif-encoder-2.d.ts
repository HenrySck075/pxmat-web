declare module "gif-encoder-2" {
  declare class ByteArray {
    constructor()
    data: []
    getData: Buffer
    writeByte(val: any): void
    writeUTFBytes(str: string): void
    writeBytes(array: ArrayLike<any>, offset: number, length: number): void
  }
  declare class GIFEncoder extends require("events") {
    constructor(width: number, height: number, algorithm: "neuquant", useOptimizer: false, totalFrames: 0)
    width: number
    height: number
    algorithm: string
    useOptimizer: string
    totalFrames: number
    frames: 1
    threshold: 90
    indexedPixels: any
    palSizeNeu: 7
    palSizeOct: 7
    sample: 10
    colorTab: any
    reuseTab: any
    colorDepth: any
    usedEntry: Array<any>
    firstFrame: true
    started: false
    image: null
    prevImage: null
    dispose: -1
    repeat: 0
    delay: 0
    transparent: null
    transIndex: 0
    readStreams: []
    out: ByteArray

    start(): void
    end(): void
    finish(): void
    addFrame(input: CanvasRenderingContext2D | ImageData): void

    setFrameRate(fps: number): void
    setDelay(ms: number): void
    setDispose(code: number): void
    setRepeat(repeat: number)
    setTransparent(color: string)

    writeLSD(): void
    writeGraphicCtrlExt(): void
    writeNetscapeExt(): void
    writeImageDesc(): void
    writePalette(): void
    writeShort(pValue: number): void
    writePixels(): void
  }
}
