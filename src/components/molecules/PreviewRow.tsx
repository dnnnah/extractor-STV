import { PDFData, BitacoraRow } from '@/types'
import { Edit2 } from 'lucide-react'

interface PreviewRowProps {
  row: BitacoraRow
  pdf: PDFData
  index: number
  onEdit: () => void
}

export function PreviewRow({ row, pdf, index, onEdit }: PreviewRowProps) {
  const formatCell = (value: string | undefined) => {
    if (value === 'S') return '✓'
    if (value === 'N') return '✗'
    return value || '-'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Edit2 size={14} />
          Editar datos
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Cámara</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.J}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Altavoz 1</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.K}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Altavoz 2</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.L}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Router</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.M}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Batería</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.P}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">UPS</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.N}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Inversor</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.O}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Cámara 4K</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.Q}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-400 block">Botón</span>
          <span className="text-sm font-medium text-gray-800 truncate block">{row.R}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
        <span className="font-medium">Observaciones:</span> {row.U || 'Sin observaciones'}
      </div>
    </div>
  )
}