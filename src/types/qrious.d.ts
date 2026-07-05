declare module 'qrious' {
  export interface QRiousOptions {
    value?: string
    background?: string
    backgroundAlpha?: number
    foreground?: string
    foregroundAlpha?: number
    level?: 'L' | 'M' | 'Q' | 'H'
    mime?: string
    padding?: number | null
    size?: number
  }
  export default class QRious {
    constructor(options?: QRiousOptions)
    toDataURL(mime?: string): string
    static setDefaults(options: Partial<QRiousOptions>): void
  }
}
