import { Toggle, Input, Label } from '@/components/atoms'
import { FormField } from '@/types'

interface FormFieldsEditorProps {
  fields: FormField
  defaultDate?: string
  onChange: (fields: Partial<FormField>) => void
}

export function FormFieldsEditor({ fields, defaultDate, onChange }: FormFieldsEditorProps) {
  const toggles = [
    { key: 'G' as const, label: 'Imagen inicial' },
    { key: 'H' as const, label: 'Imagen final' },
    { key: 'I' as const, label: 'Domo dañado' },
    { key: 'S' as const, label: 'Cromáticas' },
    { key: 'Y' as const, label: 'Fibra óptica aérea' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Toggles</p>
        {toggles.map(({ key, label }) => (
          <Toggle
            key={key}
            value={fields[key]}
            onChange={(val) => onChange({ [key]: val })}
            label={label}
          />
        ))}
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Textos</p>
        <div>
          <Label>Fecha prueba audio (T)</Label>
          <Input
            value={fields.T || defaultDate || ''}
            onChange={(e) => onChange({ T: e.target.value })}
            placeholder="Ej: 09/05/2026"
          />
        </div>
        <div>
          <Label>Fecha VMS (W)</Label>
          <Input
            value={fields.W || defaultDate || ''}
            onChange={(e) => onChange({ W: e.target.value })}
            placeholder="Ej: 09/05/2026"
          />
        </div>
        <div>
          <Label>Frente</Label>
          <Input
            value={fields.frente || ''}
            onChange={(e) => onChange({ frente: e.target.value })}
            placeholder="Frente del STV"
          />
        </div>
        <div>
          <Label>Técnico</Label>
          <Input
            value={fields.tecnico || ''}
            onChange={(e) => onChange({ tecnico: e.target.value })}
            placeholder="Nombre del técnico"
          />
        </div>
      </div>
    </div>
  )
}