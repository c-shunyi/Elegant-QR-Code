type Props = {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}

export default function Select({ value, onChange, options }: Props) {
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
