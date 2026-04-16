type Props = {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

// 颜色输入控件：并列一个 color picker 和一个十六进制文本框，两者绑定同一个 value，支持 disabled 降低透明度
export default function ColorInput({ value, onChange, disabled }: Props) {
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
        className="flex-1 outline-none text-sm font-mono bg-transparent"
      />
    </div>
  )
}
