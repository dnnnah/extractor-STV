'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/atoms'
import { Upload, FileUp } from 'lucide-react'
import { extractPDFData } from '@/features/extractor/pdfExtractor'
import { useBitacoraStore } from '@/stores/useBitacoraStore'

export function PDFUploader() {
  const [loading, setLoading] = useState(false)
  const addPdf = useBitacoraStore((state) => state.addPdf)
  const pdfs = useBitacoraStore((state) => state.pdfs)

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return

      setLoading(true)

      try {
        for (const file of Array.from(files)) {
          if (file.type === 'application/pdf') {
            const pdfData = await extractPDFData(file)
            addPdf(pdfData)
          }
        }
      } catch (error) {
        console.error('Error extracting PDF:', error)
      } finally {
        setLoading(false)
      }
    },
    [addPdf]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      await handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-150 transition-all duration-200 border-primary-300 hover:border-primary-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          ) : (
            <>
              <Upload className="w-10 h-10 mb-3 text-primary-500" />
              <p className="text-sm text-gray-600 font-medium">
                Arrastra PDFs aquí o <span className="text-primary-600">click para buscar</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Puedes subir varios a la vez</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={loading}
        />
      </label>

      {pdfs.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500">{pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} cargado{pdfs.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}