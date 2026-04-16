import Field from './ui/Field'

type Props = {
  logo: string
  onChange: (dataUrl: string) => void
}

export default function LogoUploader({ logo, onChange }: Props) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <Field label="中心 Logo">
      <div className="flex items-center gap-3">
        <label className="px-4 py-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 cursor-pointer transition">
          选择图片
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
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
              onClick={() => onChange('')}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              移除
            </button>
          </>
        )}
      </div>
    </Field>
  )
}
