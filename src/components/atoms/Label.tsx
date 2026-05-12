import { ReactNode } from 'react'

interface LabelProps {
  children: ReactNode
  className?: string
}

export function Label({ children, className = '' }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}