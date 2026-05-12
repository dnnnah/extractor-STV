import { Card, Button } from '@/components/atoms'
import { PDFData } from '@/types'
import { Trash2, FileText, CheckCircle, Edit2 } from 'lucide-react'

interface PDFListItemProps {
  pdf: PDFData
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  onEdit: () => void
}

export function PDFListItem({ pdf, selected, onSelect, onDelete, onEdit }: PDFListItemProps) {
  return (
    <div
      className={`relative group ${selected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <Card
        onClick={onEdit}
        selected={selected}
        className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={selected ? 'text-primary-600' : 'text-gray-400'}>
            <FileText size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{pdf.fileName}</p>
            <p className="text-sm text-gray-500">
              STV: {pdf.stvId} | {pdf.fecha} | {pdf.sector}
            </p>
          </div>
          {selected && (
            <CheckCircle size={20} className="text-primary-600 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </Card>
    </div>
  )
}