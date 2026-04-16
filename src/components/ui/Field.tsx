import type { ReactNode } from 'react'

type Props = { label: string; children: ReactNode }

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
