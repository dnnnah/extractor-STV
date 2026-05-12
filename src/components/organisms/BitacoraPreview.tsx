'use client'

import { useState, useEffect } from 'react'
import { Button, Card } from '@/components/atoms'
import { PreviewRow } from '@/components/molecules'
import { useBitacoraStore } from '@/stores/useBitacoraStore'
import { generateBitacoraExcel } from '@/features/bitacora/bitacoraGenerator'
import { EditorPanel } from './EditorPanel'
import { Download, FileSpreadsheet, FileText, Trash2, X, Edit2 } from 'lucide-react'

export function BitacoraPreview() {
  const pdfs = useBitacoraStore((state) => state.pdfs)
  const rows = useBitacoraStore((state) => state.generateBitacoraRows())
  const removePdf = useBitacoraStore((state) => state.removePdf)
  const setSelectedPdf = useBitacoraStore((state) => state.setSelectedPdf)
  const selectedPdfId = useBitacoraStore((state) => state.selectedPdfId)

  const [editingPdfId, setEditingPdfId] = useState<string | null>(null)

  useEffect(() => {
    if (pdfs.length === 0) {
      window.dispatchEvent(new CustomEvent('switchTab', { detail: 'upload' }))
    }
  }, [pdfs.length])

  const handleGenerateComplete = () => {
    if (rows.length > 0) {
      generateBitacoraExcel(rows)
    }
  }

  const handleGenerateSingle = (pdfId: string) => {
    const pdfIndex = pdfs.findIndex((p) => p.id === pdfId)
    if (pdfIndex !== -1 && rows[pdfIndex]) {
      generateBitacoraExcel([rows[pdfIndex]], `BITACORA_${pdfs[pdfIndex].stvId}.xlsx`)
    }
  }

  const handleDeleteSingle = (pdfId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removePdf(pdfId)
  }

  if (pdfs.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileSpreadsheet className="text-primary-600" size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{pdfs.length} Reporte{pdfs.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-500">Listos para bitácora</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleGenerateComplete}>
            <Download size={18} className="mr-2" />
            Exportar Todo
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => {
          const pdf = pdfs[index]
          if (!pdf) return null

          return (
            <Card key={pdf.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1}
                  </span>
                  <span className="text-white font-semibold">
                    STV {pdf.stvId} | {pdf.fecha} | {pdf.sector}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="!bg-white/20 !text-white hover:!bg-white/30 border-0"
                    onClick={() => handleGenerateSingle(pdf.id)}
                  >
                    <FileText size={16} className="mr-1" />
                    Exportar
                  </Button>
                  <button
                    onClick={(e) => handleDeleteSingle(pdf.id, e)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPdf(pdf.id)
                      setEditingPdfId(pdf.id)
                    }}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <PreviewRow
                  row={row}
                  pdf={pdf}
                  index={index}
                  onEdit={() => {
                    setSelectedPdf(pdf.id)
                    setEditingPdfId(pdf.id)
                  }}
                />
              </div>
            </Card>
          )
        })}
      </div>

      {editingPdfId && (
        <EditorPanel
          pdfId={editingPdfId}
          onClose={() => setEditingPdfId(null)}
        />
      )}
    </div>
  )
}