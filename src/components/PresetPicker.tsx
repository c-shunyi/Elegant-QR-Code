import Field from './ui/Field'
import { presets } from '../lib/presets'
import type { Preset } from '../types'

type Props = { onPick: (p: Preset) => void }

export default function PresetPicker({ onPick }: Props) {
  return (
    <Field label="预设风格">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => onPick(p)}
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
  )
}
