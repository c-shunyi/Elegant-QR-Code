import Field from './ui/Field'

type Props = { value: string; onChange: (v: string) => void }

export default function UrlInput({ value, onChange }: Props) {
  return (
    <Field label="链接 / 文本">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition"
      />
    </Field>
  )
}
