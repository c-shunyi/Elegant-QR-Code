import { useCallback, useState } from 'react'
import Header from './components/Header'
import UrlInput from './components/UrlInput'
import LogoUploader from './components/LogoUploader'
import BackgroundUploader from './components/BackgroundUploader'
import PresetPicker from './components/PresetPicker'
import StyleControls from './components/StyleControls'
import QRPreview from './components/QRPreview'
import type { Preset, QRStyle } from './types'

const initialStyle: QRStyle = {
  url: 'https://claude.ai',
  logo: '',
  bgImage: '',
  dotColor: '#111827',
  gradientColor: '#ec4899',
  useGradient: false,
  bgColor: '#ffffff',
  transparentBg: false,
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoSize: 0.3,
  margin: 8
}

// 根组件：组装页面布局，维护全局二维码样式状态，并把状态分发给各子组件
export default function App() {
  const [style, setStyle] = useState<QRStyle>(initialStyle)

  // 局部更新样式：接收 QRStyle 的一个子集，合并到现有样式中，避免各子组件重复写 setState 展开逻辑
  const patch = useCallback(
    (p: Partial<QRStyle>) => setStyle((s) => ({ ...s, ...p })),
    []
  )

  // 应用预设：将预设中的颜色与形状字段覆盖到当前样式，并根据主色/副色是否相等自动决定是否启用渐变
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

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <UrlInput value={style.url} onChange={(v) => patch({ url: v })} />
            <LogoUploader
              logo={style.logo}
              onChange={(v) => patch({ logo: v })}
            />
            <BackgroundUploader
              bgImage={style.bgImage}
              onChange={(v) => patch({ bgImage: v })}
            />
            <PresetPicker onPick={applyPreset} />
            <StyleControls style={style} onChange={patch} />
          </div>
          <QRPreview style={style} />
        </div>
      </div>
    </div>
  )
}
