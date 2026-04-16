import { useEffect, useMemo, useRef, type RefObject } from 'react'
import QRCodeStyling, { type Options } from 'qr-code-styling'
import type { QRStyle } from '../types'

// 根据用户自定义样式构建 qr-code-styling 的配置对象，封装颜色 / 渐变 / 形状 / Logo 等所有参数的映射
function buildOptions(style: QRStyle, size: number): Options {
  // 下列任一情况都强制 QR 透明：显式透明 / 带背景图 / 透明度 < 1（后两种由 Canvas/SVG 合成阶段再铺底）
  const transparent =
    style.transparentBg || Boolean(style.bgImage) || style.qrOpacity < 1
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

// 自定义 Hook：在传入容器中挂载 QRCodeStyling 实例，首次挂载时 append，后续样式变化时仅调用 update 复用实例
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
