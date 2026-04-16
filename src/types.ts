import type {
  DotType,
  CornerSquareType,
  CornerDotType
} from 'qr-code-styling'

export type { DotType, CornerSquareType, CornerDotType }

export type Preset = {
  name: string
  dotColor: string
  gradientColor: string
  bgColor: string
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
}

export type QRStyle = {
  url: string
  logo: string
  bgImage: string
  dotColor: string
  gradientColor: string
  useGradient: boolean
  bgColor: string
  transparentBg: boolean
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
  logoSize: number
  margin: number
}
