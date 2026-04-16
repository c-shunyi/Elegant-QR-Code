declare module 'qrcode-generator' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
  interface QRCodeMatrix {
    addData(data: string, mode?: string): void
    make(): void
    getModuleCount(): number
    isDark(row: number, col: number): boolean
  }
  function qrcode(
    typeNumber: number,
    errorCorrectionLevel: ErrorCorrectionLevel
  ): QRCodeMatrix
  export = qrcode
}
