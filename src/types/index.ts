export interface PDFData {
  id: string
  fileName: string
  stvId: string
  ipCamara: string
  ipAltavo1: string
  ipAltavo2: string
  tipoPoste: string
  fecha: string
  c2: string
  sector: string
  inicio: string
  salida: string
  observaciones: string
  serieCamara: string
  serieAltavo1: string
  serieAltavo2: string
  serieRouter: string
  serieBateria: string
  serieUPS: string
  serieInversor?: string
  serieCamara4k?: string
  serieBoton: string
  imagenInicial: 'S' | 'N'
  imagenFinal: 'S' | 'N'
  domoDanado: 'S' | 'N'
  frente: string
  fechaPruebaAudio: string
  tecnico: string
  fechaVMS: string
  fibraOpticaAerea: 'S' | 'N'
  documentadora: string
  cromaticas: string
}

export interface FormField {
  G: 'S' | 'N'
  H: 'S' | 'N'
  I: 'S' | 'N'
  S: 'S' | 'N'
  Y: 'S' | 'N'
  T: string
  W: string
  frente: string
  tecnico: string
}

export type ColumnKey =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export interface BitacoraRow {
  A: string
  B: string
  C: string
  D: string
  E: string
  F: string
  G: 'S' | 'N' | ''
  H: 'S' | 'N' | ''
  I: 'S' | 'N' | ''
  J: string
  K: string
  L: string
  M: string
  N: string
  O: string
  P: string
  Q: string
  R: string
  S: 'S' | 'N' | ''
  T: string
  U: string
  V: string
  W: string
  X: string
  Y: 'S' | 'N' | ''
  Z: string
}