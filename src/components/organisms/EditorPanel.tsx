'use client'

import { useState, useEffect } from 'react'
import { PDFData, FormField } from '@/types'
import { Button, Input, Card, Label } from '@/components/atoms'
import { FormFieldsEditor } from '@/components/molecules'
import { useBitacoraStore } from '@/stores/useBitacoraStore'
import { ArrowLeft, Save, X } from 'lucide-react'

interface EditorPanelProps {
  pdfId: string
  onClose: () => void
}

export function EditorPanel({ pdfId, onClose }: EditorPanelProps) {
  const pdf = useBitacoraStore((state) => state.pdfs.find((p) => p.id === pdfId))
  const formFields = useBitacoraStore((state) => state.formFields[pdfId])
  const updatePdf = useBitacoraStore((state) => state.updatePdf)
  const updateFormField = useBitacoraStore((state) => state.updateFormField)

  const [localPdf, setLocalPdf] = useState<Partial<PDFData>>({})
  const [localFields, setLocalFields] = useState<FormField | null>(null)

  useEffect(() => {
    if (pdf) setLocalPdf(pdf)
    if (formFields) setLocalFields(formFields)
  }, [pdf, formFields])

  if (!pdf || !formFields) return null

  const handleSave = () => {
    updatePdf(pdfId, localPdf as PDFData)
    if (localFields) updateFormField(pdfId, localFields)
    onClose()
  }

  const fields = [
    { key: 'stvId', label: 'STV ID' },
    { key: 'ipCamara', label: 'IP Cámara' },
    { key: 'ipAltavo1', label: 'IP Altavoz 1' },
    { key: 'ipAltavo2', label: 'IP Altavoz 2' },
    { key: 'tipoPoste', label: 'Tipo Poste' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'c2', label: 'C2' },
    { key: 'sector', label: 'Sector' },
    { key: 'inicio', label: 'Inicio' },
    { key: 'salida', label: 'Salida' },
  ]

  const seriesFields = [
    { key: 'serieCamara', label: 'N/S Cámara' },
    { key: 'serieAltavo1', label: 'N/S Altavoz 1' },
    { key: 'serieAltavo2', label: 'N/S Altavoz 2' },
    { key: 'serieRouter', label: 'N/S Router' },
    { key: 'serieBateria', label: 'N/S Batería' },
    { key: 'serieUPS', label: 'N/S UPS/Planta de fuerza' },
    { key: 'serieBoton', label: 'N/S Botón' },
    { key: 'serieInversor', label: 'N/S Inversor' },
    { key: 'serieCamara4k', label: 'N/S Cámara 4K' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose}>
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">Editar: {pdf.stvId}</h2>
              </div>
              <Button variant="ghost" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Datos del Sitio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {fields.map(({ key, label }) => (
                    <Input
                      key={key}
                      label={label}
                      value={(localPdf as any)?.[key] || ''}
                      onChange={(e) => setLocalPdf({ ...localPdf, [key]: e.target.value })}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Números de Serie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {seriesFields.map(({ key, label }) => (
                    <Input
                      key={key}
                      label={label}
                      value={(localPdf as any)?.[key] || ''}
                      onChange={(e) => setLocalPdf({ ...localPdf, [key]: e.target.value })}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Observaciones</h3>
                <textarea
                  value={localPdf.observaciones || ''}
                  onChange={(e) => setLocalPdf({ ...localPdf, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Campos Adicionales</h3>
                {localFields && (
                  <FormFieldsEditor
                    fields={localFields}
                    defaultDate={pdf.fecha}
                    onChange={(fields) => setLocalFields((prev) => prev ? { ...prev, ...fields } : null)}
                  />
                )}
              </section>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save size={18} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}