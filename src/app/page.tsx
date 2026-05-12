'use client'

import { useState, useEffect } from 'react'
import { Button, Card } from '@/components/atoms'
import { PDFUploader } from '@/components/organisms/PDFUploader'
import { BitacoraPreview } from '@/components/organisms/BitacoraPreview'
import { EditorPanel } from '@/components/organisms/EditorPanel'
import { PDFListItem } from '@/components/molecules/PDFListItem'
import { useBitacoraStore } from '@/stores/useBitacoraStore'
import { FileText, Trash2, LayoutGrid, List } from 'lucide-react'

export default function Home() {
  const pdfs = useBitacoraStore((state) => state.pdfs)
  const selectedPdfId = useBitacoraStore((state) => state.selectedPdfId)
  const setSelectedPdf = useBitacoraStore((state) => state.setSelectedPdf)
  const removePdf = useBitacoraStore((state) => state.removePdf)
  const clearAll = useBitacoraStore((state) => state.clearAll)

  const [activeTab, setActiveTab] = useState<'upload' | 'preview'>('upload')
  const [editingPdfId, setEditingPdfId] = useState<string | null>(null)

  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent) => {
      setActiveTab(e.detail)
    }
    window.addEventListener('switchTab', handleSwitchTab as EventListener)
    return () => window.removeEventListener('switchTab', handleSwitchTab as EventListener)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  EVE
                </h1>
                <p className="text-xs text-gray-500 font-medium">Extractor de Bitácora STV</p>
              </div>
            </div>
            {pdfs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={18} className="mr-1" />
                Limpiar todo
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {pdfs.length > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <List size={18} />
              Subir PDFs
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'preview'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <LayoutGrid size={18} />
              Preview ({pdfs.length})
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <Card className="p-6 shadow-lg border-0">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary-600" />
                Cargar Reportes PDF
              </h2>
              <PDFUploader />
            </Card>

            {pdfs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Reportes Cargados
                </h3>
                {pdfs.map((pdf) => (
                  <PDFListItem
                    key={pdf.id}
                    pdf={pdf}
                    selected={pdf.id === selectedPdfId}
                    onSelect={() => setSelectedPdf(pdf.id)}
                    onDelete={() => removePdf(pdf.id)}
                    onEdit={() => {
                      setSelectedPdf(pdf.id)
                      setEditingPdfId(pdf.id)
                    }}
                  />
                ))}
              </div>
            )}

            {pdfs.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => setActiveTab('preview')}
                  className="!bg-gradient-to-r !from-primary-500 !to-primary-600 shadow-lg hover:shadow-xl"
                >
                  Continuar a Preview
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && <BitacoraPreview />}

        {editingPdfId && (
          <EditorPanel
            pdfId={editingPdfId}
            onClose={() => setEditingPdfId(null)}
          />
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        EVE v1.0 • Extractor de Bitácora STV
      </footer>
    </div>
  )
}