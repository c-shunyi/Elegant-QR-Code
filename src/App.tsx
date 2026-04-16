import { useCallback, useState } from 'react'
import Header from './components/Header'
import UrlInput from './components/UrlInput'
import LogoUploader from './components/LogoUploader'
import SourceImageUploader from './components/SourceImageUploader'
import PresetPicker from './components/PresetPicker'
import StyleControls from './components/StyleControls'
import QRPreview from './components/QRPreview'
import type { Preset, QRStyle } from './types'

const initialStyle: QRStyle = {
  url: 'https://claude.ai',
  logo: '',
  sourceImage: '',
  dotColor: '#111827',
  gradientColor: '#ec4899',
  useGradient: false,
  bgColor: '#ffffff',
  transparentBg: false,
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoSize: 0.3,
  margin: 8,
  imageDotScale: 0.55,
  imageAlpha: 1
}

export default function App() {
  const [style, setStyle] = useState<QRStyle>(initialStyle)

  const patch = useCallback(
    (p: Partial<QRStyle>) => setStyle((s) => ({ ...s, ...p })),
    []
  )

  const applyPreset = useCallback((p: Preset) => {
    setStyle((s) => ({
      ...s,
      dotColor: p.dotColor,
      gradientColor: p.gradientColor,
      bgColor: p.bgColor,
      dotType: p.dotType,
      cornerSquareType: p.cornerSquareType,
      cornerDotType: p.cornerDotType,
      useGradient: p.dotColor !== p.gradientColor
    }))
  }, [])

  const isImageMode = Boolean(style.sourceImage)

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <UrlInput value={style.url} onChange={(v) => patch({ url: v })} />
            <SourceImageUploader
              sourceImage={style.sourceImage}
              dotScale={style.imageDotScale}
              imageAlpha={style.imageAlpha}
              onImageChange={(v) => patch({ sourceImage: v })}
              onDotScaleChange={(v) => patch({ imageDotScale: v })}
              onImageAlphaChange={(v) => patch({ imageAlpha: v })}
            />
            {!isImageMode && (
              <>
                <LogoUploader
                  logo={style.logo}
                  onChange={(v) => patch({ logo: v })}
                />
                <PresetPicker onPick={applyPreset} />
                <StyleControls style={style} onChange={patch} />
              </>
            )}
            {isImageMode && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2">码点颜色</div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-200">
                  <input
                    type="color"
                    value={style.dotColor}
                    onChange={(e) => patch({ dotColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.dotColor}
                    onChange={(e) => patch({ dotColor: e.target.value })}
                    className="flex-1 outline-none text-sm font-mono bg-transparent"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  图片模式下码点固定为实心圆，暂不支持渐变 / 样式预设
                </p>
              </div>
            )}
          </div>
          <QRPreview style={style} />
        </div>
      </div>
    </div>
  )
}
