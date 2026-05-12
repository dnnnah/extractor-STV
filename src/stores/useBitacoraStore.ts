import { create } from 'zustand'
import { PDFData, BitacoraRow, FormField } from '@/types'

interface BitacoraStore {
  pdfs: PDFData[]
  formFields: Record<string, FormField>
  selectedPdfId: string | null

  addPdf: (pdf: PDFData) => void
  updatePdf: (id: string, data: Partial<PDFData>) => void
  removePdf: (id: string) => void
  setSelectedPdf: (id: string | null) => void
  updateFormField: (pdfId: string, field: Partial<FormField>) => void
  clearAll: () => void

  generateBitacoraRows: () => BitacoraRow[]
}

export const useBitacoraStore = create<BitacoraStore>((set, get) => ({
  pdfs: [],
  formFields: {},
  selectedPdfId: null,

  addPdf: (pdf) =>
    set((state) => ({
      pdfs: [...state.pdfs, pdf],
      formFields: {
        ...state.formFields,
        [pdf.id]: {
          G: 'N',
          H: 'N',
          I: 'N',
          S: 'N',
          Y: 'N',
          T: pdf.fecha || '',
          W: pdf.fecha || '',
          frente: '',
          tecnico: '',
        },
      },
    })),

  updatePdf: (id, data) =>
    set((state) => ({
      pdfs: state.pdfs.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  removePdf: (id) =>
    set((state) => ({
      pdfs: state.pdfs.filter((p) => p.id !== id),
      formFields: Object.fromEntries(
        Object.entries(state.formFields).filter(([key]) => key !== id)
      ),
    })),

  setSelectedPdf: (id) => set({ selectedPdfId: id }),

  updateFormField: (pdfId, field) =>
    set((state) => ({
      formFields: {
        ...state.formFields,
        [pdfId]: { ...state.formFields[pdfId], ...field },
      },
    })),

  clearAll: () => set({ pdfs: [], formFields: {}, selectedPdfId: null }),

  generateBitacoraRows: () => {
    const { pdfs, formFields } = get()
    return pdfs.map((pdf) => {
      const fields = formFields[pdf.id] || {
        G: 'N',
        H: 'N',
        I: 'N',
        S: 'N',
        Y: 'N',
        T: '',
        W: '',
      }

      return {
        A: pdf.stvId,
        B: pdf.fecha,
        C: pdf.c2,
        D: pdf.sector,
        E: pdf.tipoPoste,
        F: pdf.inicio,
        G: fields.G,
        H: fields.H,
        I: fields.I,
        J: pdf.serieCamara || 'N/A',
        K: pdf.serieAltavo1 || 'N/A',
        L: pdf.serieAltavo2 || 'N/A',
        M: pdf.serieRouter || 'N/A',
        N: pdf.serieUPS || 'N/A',
        O: pdf.serieInversor || 'N/A',
        P: pdf.serieBateria || 'N/A',
        Q: pdf.serieCamara4k || 'N/A',
        R: pdf.serieBoton || 'N/A',
        S: fields.S,
        T: fields.frente || '',
        U: pdf.observaciones,
        V: fields.T || '',
        W: fields.tecnico || '',
        X: fields.W || '',
        Y: fields.Y,
        Z: 'Eve',
      }
    })
  },
}))