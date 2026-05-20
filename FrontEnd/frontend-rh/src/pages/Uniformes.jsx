import RhCrudPage from '../components/RhCrudPage'

const tipoOptions = [
  { value: 'Uniforme', label: 'Uniforme' },
  { value: 'EPP', label: 'EPP' },
  { value: 'Calzado', label: 'Calzado' }
]

export default function Uniformes({ empleados }) {
  return (
    <RhCrudPage
      title="EPP / Calzado"
      subtitle="Controla entregas de uniformes, equipo de protección y calzado"
      endpoint="/uniformes"
      empleados={empleados}
      searchPlaceholder="Buscar por empleado"
      formTitle="entrega"
      deleteTitle="Eliminar entrega"
      deleteLabel="Entrega"
      filter={{
        field: 'tipo',
        options: tipoOptions
      }}
      fields={[
        {
          name: 'empleado_id',
          label: 'Empleado',
          type: 'select',
          options: 'empleados',
          required: true
        },
        {
          name: 'fecha_entrega',
          label: 'Fecha de entrega',
          type: 'date',
          required: true
        },
        {
          name: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: tipoOptions,
          required: true
        },
        {
          name: 'talla',
          label: 'Talla'
        },
        {
          name: 'color',
          label: 'Color'
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          required: true
        },
        {
          name: 'observaciones',
          label: 'Comentarios',
          type: 'textarea',
          full: true
        }
      ]}
      columns={[
        {
          key: 'Empleado.nombre',
          label: 'Empleado'
        },
        {
          key: 'fecha_entrega',
          label: 'Entrega'
        },
        {
          key: 'tipo',
          label: 'Tipo',
          badge: true
        },
        {
          key: 'talla',
          label: 'Talla'
        },
        {
          key: 'color',
          label: 'Color'
        },
        {
          key: 'descripcion',
          label: 'Descripción'
        }
      ]}
      badgeConfig={{
        Uniforme: {
          label: 'Uniforme',
          className: 'bg-blue-100 text-blue-700'
        },
        EPP: {
          label: 'EPP',
          className: 'bg-emerald-100 text-emerald-700'
        },
        Calzado: {
          label: 'Calzado',
          className: 'bg-slate-200 text-slate-700'
        }
      }}
      mapBeforeSave={(form) => ({
        ...form,
        empleado_id: Number(form.empleado_id)
      })}
    />
  )
}
