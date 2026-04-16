import type { ReactNode } from 'react'

type Props = { label: string; children: ReactNode }

// 表单字段包装器：在控件上方加一条灰色标签，统一表单排版样式
export default function Field({ label, children }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
