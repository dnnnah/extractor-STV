import { PDFData } from '@/types'
import * as pdfjsLib from 'pdfjs-dist'

let workerInitialized = false

function initWorker() {
  if (typeof window !== 'undefined' && !workerInitialized) {
    const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.href
    workerInitialized = true
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

async function extractTextFromPage(page: any): Promise<string> {
  try {
    const textContent = await page.getTextContent()
    const items = textContent.items

    const sortedItems = items
      .filter((item: any) => item.str && item.str.trim())
      .sort((a: any, b: any) => {
        const yDiff = Math.round(b.transform[5]) - Math.round(a.transform[5])
        if (Math.abs(yDiff) > 5) return yDiff
        return a.transform[4] - b.transform[4]
      })

    return sortedItems.map((item: any) => item.str).join(' ')
  } catch (e) {
    console.error('Error extracting page text:', e)
    return ''
  }
}

function extractFirstPageData(text: string): Record<string, string> {
  const result: Record<string, string> = {}

  const patterns: Record<string, RegExp> = {
    stvId: /STV\s+ID\s*[:\s]*(\d+)/i,
    ipCamara: /IP\s+CÁMARA\s*[:\s]*([\d.]+)/i,
    ipAlt1: /IP\s+ALTAVOZ\s+1\s*[:\s]*([\d.]+)/i,
    ipAlt2: /IP\s+ALTAVOZ\s+2\s*[:\s]*([\d.]+)/i,
    tipoPoste: /TIPO\s+DE\s+POSTE\s*[:\s]*(\d+m)/i,
    fecha: /FECHA\s*[:\s]*([\d\/]+)/i,
    c2: /C2\s*[:\s]*([A-Z]+)/i,
    sector: /SECTOR\s*[:\s]*([A-Z]+)/i,
    inicio: /INICIO\s*[:\s]*([\d:]+)/i,
    salida: /SALIDA\s*[:\s]*([\d:]+)/i,
  }

  for (const [key, regex] of Object.entries(patterns)) {
    const match = text.match(regex)
    result[key] = match ? match[1].trim() : ''
  }

  return result
}

function extractObservaciones(text: string): string {
  const saleMatch = text.match(/SALIDA:\s*\d{2}:\d{2}\s+([\s\S]*?)(?=\s+CROMATICAS|$)/i)
  if (saleMatch && saleMatch[1].trim().length > 3) {
    let cleaned = saleMatch[1].trim().replace(/\s+/g, ' ')
    if (!cleaned.endsWith('.')) {
      cleaned = cleaned + '.'
    }
    const cromMatch = text.match(/CROMATICAS\s+([A-Z]+)/i)
    if (cromMatch) {
      return (cleaned + ' CROMATICAS ' + cromMatch[1]).substring(0, 500)
    }
    return cleaned.substring(0, 500)
  }

  const obsMatch = text.match(/OBSERVACIONES:\s*([\s\S]*?)(?=\d+\.\s+SEGURIDAD|$)/i)
  if (obsMatch && obsMatch[1].trim().length > 10) {
    return obsMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500)
  }

  const cromMatch = text.match(/CROMATICAS\s+([A-Z]+)/i)
  if (cromMatch) {
    return `CROMATICAS ${cromMatch[1]}`
  }
  return ''
}

function isValidSerie(value: string): boolean {
  if (!value || value === '') return false
  if (value === 'N/A' || value === 'N') return false
  if (value.length < 2) return false
  if (/^(SERIE|BOTÓN|INVERSOR|CÁMARA|ALTAVOZ|ROUTER|BATERÍA|UPS|PLANTA|FUERZA)$/i.test(value)) return false
  return true
}

function extractSeries(text: string): Record<string, string> {
  const result: Record<string, string> = {}

  const parts = text.split('SERIE:').filter(p => p.trim())

  const values: string[] = []
  for (let i = 1; i < parts.length; i++) {
    const value = parts[i].trim().split(/\s+/)[0]
    values.push(value)
  }

  if (values.length >= 1) result.serieCamara = values[0] || ''
  if (values.length >= 2) result.serieAlt1 = values[1] || ''
  if (values.length >= 3) result.serieAlt2 = values[2] || ''
  if (values.length >= 4) result.serieRouter = values[3] || ''
  if (values.length >= 5) result.serieBateria = values[4] || ''
  if (values.length >= 6) result.serieUPS = values[5] || ''
  if (values.length >= 7) result.serieBoton = values[6] || ''
  if (values.length >= 8) result.serieInversor = values[7] || ''
  if (values.length >= 9) result.serieCamara4k = values[8] || ''

  return result
}

export async function extractPDFData(file: File): Promise<PDFData> {
  initWorker()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
    })

    const pdf = await loadingTask.promise

    const page1 = await pdf.getPage(1)
    const page1Text = await extractTextFromPage(page1)

    const lastPage = await pdf.getPage(pdf.numPages)
    const lastPageText = await extractTextFromPage(lastPage)

    const pageData = extractFirstPageData(page1Text)
    const seriesData = extractSeries(lastPageText)
    const observaciones = extractObservaciones(page1Text)

    return {
      id: generateId(),
      fileName: file.name,
      stvId: pageData.stvId || 'N/A',
      ipCamara: pageData.ipCamara || 'N/A',
      ipAltavo1: pageData.ipAlt1 || 'N/A',
      ipAltavo2: pageData.ipAlt2 || 'N/A',
      tipoPoste: pageData.tipoPoste || 'N/A',
      fecha: pageData.fecha || 'N/A',
      c2: pageData.c2 || 'N/A',
      sector: pageData.sector || 'N/A',
      inicio: pageData.inicio || 'N/A',
      salida: pageData.salida || 'N/A',
      observaciones: observaciones,
      serieCamara: seriesData.serieCamara || 'N/A',
      serieAltavo1: seriesData.serieAlt1 || 'N/A',
      serieAltavo2: seriesData.serieAlt2 || 'N/A',
      serieRouter: seriesData.serieRouter || 'N/A',
      serieBateria: seriesData.serieBateria || 'N/A',
      serieUPS: seriesData.serieUPS || 'N/A',
      serieInversor: seriesData.serieInversor || undefined,
      serieCamara4k: seriesData.serieCamara4k || undefined,
      serieBoton: seriesData.serieBoton || 'N/A',
      imagenInicial: 'N',
      imagenFinal: 'N',
      domoDanado: 'N',
      frente: '',
      fechaPruebaAudio: '',
      tecnico: '',
      fechaVMS: '',
      fibraOpticaAerea: 'N',
      documentadora: '',
      cromaticas: '',
    }
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw error
  }
}