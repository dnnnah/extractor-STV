import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

export function Card({ children, className, onClick, selected }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-white rounded-xl border transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-md',
          selected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200',
          className
        )
      )}
    >
      {children}
    </div>
  )
}