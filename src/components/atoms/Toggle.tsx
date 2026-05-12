import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ToggleProps {
  value: 'S' | 'N'
  onChange: (value: 'S' | 'N') => void
  label?: string
  className?: string
}

export function Toggle({ value, onChange, label, className }: ToggleProps) {
  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(value === 'S' ? 'N' : 'S')}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          value === 'S' ? 'bg-primary-600' : 'bg-gray-300'
        )}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200',
            value === 'S' ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      <span className={clsx('text-sm font-medium', value === 'S' ? 'text-primary-600' : 'text-gray-400')}>
        {value === 'S' ? 'SÍ' : 'NO'}
      </span>
    </div>
  )
}