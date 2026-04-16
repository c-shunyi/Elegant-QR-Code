import { useEffect, useMemo, useRef, type RefObject } from 'react'
import QRCodeStyling, { type Options } from 'qr-code-styling'
import type { QRStyle } from '../types'

function buildOptions(style: QRStyle, size: number): Options {
  const transparent = style.transparentBg
  return {
    width: size,
    height: size,
    data: style.url || ' ',
    margin: style.margin,
    image: style.logo || undefined,
    qrOptions: { errorCorrectionLevel: 'H' },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 4,
      imageSize: style.logoSize,
      hideBackgroundDots: true
    },
    dotsOptions: {
      type: style.dotType,
      color: style.dotColor,
      ...(style.useGradient
        ? {
            gradient: {
              type: 'linear',
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: style.dotColor },
                { offset: 1, color: style.gradientColor }
              ]
            }
          }
        : {})
    },
    backgroundOptions: {
      color: transparent ? 'transparent' : style.bgColor
    },
    cornersSquareOptions: {
      type: style.cornerSquareType,
      color: style.useGradient ? style.gradientColor : style.dotColor
    },
    cornersDotOptions: {
      type: style.cornerDotType,
      color: style.useGradient ? style.gradientColor : style.dotColor
    }
  }
}

export function useQRCode(
  containerRef: RefObject<HTMLDivElement | null>,
  style: QRStyle,
  size = 320
) {
  const qrRef = useRef<QRCodeStyling | null>(null)
  const options = useMemo(() => buildOptions(style, size), [style, size])

  useEffect(() => {
    if (!containerRef.current) return
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options)
      qrRef.current.append(containerRef.current)
    } else {
      qrRef.current.update(options)
    }
  }, [options, containerRef])

  return qrRef
}
