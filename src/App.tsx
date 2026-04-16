import { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling, {
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type FileExtension
} from 'qr-code-styling'

const dotTypes: DotType[] = [
  'square',
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'extra-rounded'
]
const cornerSquareTypes: CornerSquareType[] = ['square', 'dot', 'extra-rounded']
const cornerDotTypes: CornerDotType[] = ['square', 'dot']

type Preset = {
  name: string
  dotColor: string
  gradientColor: string
  bgColor: string
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
}

const presets: Preset[] = [
  {
    name: '极光紫',
    dotColor: '#6d28d9',
    gradientColor: '#ec4899',
    bgColor: '#ffffff',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  },
  {
    name: '海洋蓝',
    dotColor: '#0ea5e9',
    gradientColor: '#14b8a6',
    bgColor: '#ffffff',
    dotType: 'classy-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  },
  {
    name: '日落橙',
    dotColor: '#f59e0b',
    gradientColor: '#ef4444',
    bgColor: '#fff7ed',
    dotType: 'dots',
    cornerSquareType: 'dot',
    cornerDotType: 'dot'
  },
  {
    name: '经典黑',
    dotColor: '#111827',
    gradientColor: '#111827',
    bgColor: '#ffffff',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square'
  },
  {
    name: '森林绿',
    dotColor: '#059669',
    gradientColor: '#84cc16',
    bgColor: '#f0fdf4',
    dotType: 'extra-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  }
]

export default function App() {
  const [url, setUrl] = useState('https://claude.ai')
  const [logo, setLogo] = useState<string>('')
  const [dotColor, setDotColor] = useState('#6d28d9')
  const [gradientColor, setGradientColor] = useState('#ec4899')
  const [useGradient, setUseGradient] = useState(true)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [transparentBg, setTransparentBg] = useState(false)
  const [dotType, setDotType] = useState<DotType>('rounded')
  const [cornerSquareType, setCornerSquareType] =
    useState<CornerSquareType>('extra-rounded')
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot')
  const [logoSize, setLogoSize] = useState(0.3)
  const [margin, setMargin] = useState(8)

  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  const qrOptions = useMemo(
    () => ({
      width: 320,
      height: 320,
      data: url || ' ',
      margin,
      image: logo || undefined,
      qrOptions: { errorCorrectionLevel: 'H' as const },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 4,
        imageSize: logoSize,
        hideBackgroundDots: true
      },
      dotsOptions: {
        type: dotType,
        color: dotColor,
        ...(useGradient
          ? {
              gradient: {
                type: 'linear' as const,
                rotation: Math.PI / 4,
                colorStops: [
                  { offset: 0, color: dotColor },
                  { offset: 1, color: gradientColor }
                ]
              }
            }
          : {})
      },
      backgroundOptions: {
        color: transparentBg ? 'transparent' : bgColor
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: useGradient ? gradientColor : dotColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: useGradient ? gradientColor : dotColor
      }
    }),
    [
      url,
      logo,
      dotColor,
      gradientColor,
      useGradient,
      bgColor,
      transparentBg,
      dotType,
      cornerSquareType,
      cornerDotType,
      logoSize,
      margin
    ]
  )

  useEffect(() => {
    if (!containerRef.current) return
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(qrOptions)
      qrRef.current.append(containerRef.current)
    } else {
      qrRef.current.update(qrOptions)
    }
  }, [qrOptions])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDownload = (ext: FileExtension) => {
    qrRef.current?.download({ name: 'elegant-qr', extension: ext })
  }

  const applyPreset = (p: Preset) => {
    setDotColor(p.dotColor)
    setGradientColor(p.gradientColor)
    setBgColor(p.bgColor)
    setDotType(p.dotType)
    setCornerSquareType(p.cornerSquareType)
    setCornerDotType(p.cornerDotType)
    setUseGradient(p.dotColor !== p.gradientColor)
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Elegant QR Code
          </h1>
          <p className="text-gray-500 mt-2">
            把链接和图片，变成一枚好看的二维码
          </p>
        </header>

        <div className="grid md:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <Field label="链接 / 文本">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition"
              />
            </Field>

            <Field label="中心 Logo">
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 cursor-pointer transition">
                  选择图片
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <>
                    <img
                      src={logo}
                      alt="logo"
                      className="w-10 h-10 rounded object-cover border"
                    />
                    <button
                      onClick={() => setLogo('')}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      移除
                    </button>
                  </>
                )}
              </div>
            </Field>

            <Field label="预设风格">
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition"
                    style={{
                      background: `linear-gradient(135deg, ${p.dotColor}22, ${p.gradientColor}22)`
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="主色">
                <ColorInput value={dotColor} onChange={setDotColor} />
              </Field>
              <Field label="渐变副色">
                <ColorInput
                  value={gradientColor}
                  onChange={setGradientColor}
                  disabled={!useGradient}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
              />
              启用渐变色
            </label>

            <div className="grid grid-cols-2 gap-4">
              <Field label="背景色">
                <ColorInput
                  value={bgColor}
                  onChange={setBgColor}
                  disabled={transparentBg}
                />
              </Field>
              <label className="flex items-end gap-2 text-sm text-gray-700 pb-2.5">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                />
                透明背景
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="点样式">
                <Select value={dotType} onChange={(v) => setDotType(v as DotType)} options={dotTypes} />
              </Field>
              <Field label="角框样式">
                <Select
                  value={cornerSquareType}
                  onChange={(v) => setCornerSquareType(v as CornerSquareType)}
                  options={cornerSquareTypes}
                />
              </Field>
              <Field label="角点样式">
                <Select
                  value={cornerDotType}
                  onChange={(v) => setCornerDotType(v as CornerDotType)}
                  options={cornerDotTypes}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={`Logo 尺寸 ${Math.round(logoSize * 100)}%`}>
                <input
                  type="range"
                  min={0.1}
                  max={0.5}
                  step={0.05}
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`边距 ${margin}px`}>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full"
                />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div
              ref={containerRef}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundImage: transparentBg
                  ? 'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)'
                  : undefined,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            />
            <div className="mt-6 w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDownload('png')}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white font-medium shadow hover:shadow-lg transition"
              >
                下载 PNG
              </button>
              <button
                onClick={() => handleDownload('svg')}
                className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium shadow hover:shadow-lg transition"
              >
                下载 SVG
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              提示：带 Logo 时建议使用高纠错级别（已默认启用 H 级）
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function ColorInput({
  value,
  onChange,
  disabled
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-200 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 outline-none text-sm font-mono"
      />
    </div>
  )
}

function Select({
  value,
  onChange,
  options
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-500 outline-none bg-white text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
