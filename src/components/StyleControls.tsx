import Field from './ui/Field'
import ColorInput from './ui/ColorInput'
import Select from './ui/Select'
import {
  cornerDotTypes,
  cornerSquareTypes,
  dotTypes
} from '../lib/presets'
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  QRStyle
} from '../types'

type Props = {
  style: QRStyle
  onChange: (patch: Partial<QRStyle>) => void
}

export default function StyleControls({ style, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="主色">
          <ColorInput
            value={style.dotColor}
            onChange={(v) => onChange({ dotColor: v })}
          />
        </Field>
        <Field label="渐变副色">
          <ColorInput
            value={style.gradientColor}
            onChange={(v) => onChange({ gradientColor: v })}
            disabled={!style.useGradient}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={style.useGradient}
          onChange={(e) => onChange({ useGradient: e.target.checked })}
        />
        启用渐变色
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field label="背景色">
          <ColorInput
            value={style.bgColor}
            onChange={(v) => onChange({ bgColor: v })}
            disabled={style.transparentBg}
          />
        </Field>
        <label className="flex items-end gap-2 text-sm text-gray-700 pb-2.5">
          <input
            type="checkbox"
            checked={style.transparentBg}
            onChange={(e) => onChange({ transparentBg: e.target.checked })}
          />
          透明背景
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="点样式">
          <Select
            value={style.dotType}
            onChange={(v) => onChange({ dotType: v as DotType })}
            options={dotTypes}
          />
        </Field>
        <Field label="角框样式">
          <Select
            value={style.cornerSquareType}
            onChange={(v) =>
              onChange({ cornerSquareType: v as CornerSquareType })
            }
            options={cornerSquareTypes}
          />
        </Field>
        <Field label="角点样式">
          <Select
            value={style.cornerDotType}
            onChange={(v) => onChange({ cornerDotType: v as CornerDotType })}
            options={cornerDotTypes}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={`Logo 尺寸 ${Math.round(style.logoSize * 100)}%`}>
          <input
            type="range"
            min={0.1}
            max={0.5}
            step={0.05}
            value={style.logoSize}
            onChange={(e) => onChange({ logoSize: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label={`边距 ${style.margin}px`}>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={style.margin}
            onChange={(e) => onChange({ margin: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
      </div>
    </div>
  )
}
