import * as XLSX from 'xlsx'
import { BitacoraRow } from '@/types'

const HEADERS = [
  'Id del sitio',
  'Fecha de ejecución',
  'C2',
  'Sector',
  'Tipo de poste',
  'Hora de inicio',
  'Imagen inicial',
  'Imagen final',
  'Domo dañado',
  'N/S Cámara',
  'N/S Altavoz 1',
  'N/S Altavoz 2',
  'N/S Router',
  'N/S UPS/Planta de fuerza',
  'N/S Inversor',
  'N/S batería',
  'N/S Cámara 4K',
  'N/S Intercomunicador',
  'Cromáticas',
  'Frente',
  'Observaciones',
  'Fecha prueba de audio',
  'Técnico',
  'Fecha de VMS',
  'Fibra óptica aérea',
  'Documentadora',
]

function toSpanishYesNo(value: string): string {
  return value === 'S' ? 'SI' : 'NO'
}

function rowToArray(row: BitacoraRow): (string | number)[] {
  return [
    row.A,              // A: Id del sitio
    row.B,              // B: Fecha de ejecución
    row.C,              // C: C2
    row.D,              // D: Sector
    row.E,              // E: Tipo de poste
    row.F,              // F: Hora de inicio
    toSpanishYesNo(row.G),  // G: Imagen inicial
    toSpanishYesNo(row.H),  // H: Imagen final
    toSpanishYesNo(row.I),  // I: Domo dañado
    row.J,              // J: N/S Cámara
    row.K,              // K: N/S Altavoz 1
    row.L,              // L: N/S Altavo2
    row.M,              // M: N/S Router
    row.N,              // N: N/S UPS
    row.O,              // O: N/S Inversor
    row.P,              // P: N/S batería
    row.Q,              // Q: N/S Cámara 4K
    row.R,              // R: N/S Intercomunicador
    toSpanishYesNo(row.S),  // S: Cromáticas
    row.T,              // T: Frente
    row.U,              // U: Observaciones
    row.V,              // V: Fecha prueba de audio
    row.W,              // W: Técnico
    row.X,              // X: Fecha de VMS
    toSpanishYesNo(row.Y),  // Y: Fibra óptica aérea
    row.Z,              // Z: Documentadora
  ]
}

export function generateBitacoraExcel(rows: BitacoraRow[], fileName?: string): void {
  const worksheetData = [HEADERS, ...rows.map(rowToArray)]
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })]
    if (cell) {
      cell.s = {
        fill: { fgColor: { rgb: '0EA5E9' } },
        font: { color: { rgb: 'FFFFFF' }, bold: true },
        alignment: { horizontal: 'center' },
      }
    }
  }

  const columnWidths = [
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 10 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 50 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
  ]
  worksheet['!cols'] = columnWidths

  for (let i = 0; i < HEADERS.length; i++) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: i })
    worksheet[cell] = {
      t: 's',
      v: HEADERS[i],
      s: {
        fill: { fgColor: { rgb: '0EA5E9' } },
        font: { color: { rgb: 'FFFFFF' }, bold: true },
        alignment: { horizontal: 'center' },
      }
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bitácora')

  const file = fileName || `BITACORA_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, file)
}