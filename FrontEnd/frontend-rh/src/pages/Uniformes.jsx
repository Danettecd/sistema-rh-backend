import RhCrudPage from '../components/RhCrudPage'

const tipoOptions = [
  { value: 'Uniforme', label: 'Uniforme' },
  { value: 'EPP', label: 'EPP' },
  { value: 'Calzado', label: 'Calzado' }
]

export default function Uniformes({ empleados }) {
  return (
    <RhCrudPage

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

      summary={{
        field: 'tipo',
        sumField: 'cantidad',
        totalLabel: 'entregas',
        items: [
          {
            value: 'Uniforme',
            label: 'Uniformes',
            dotClass: 'bg-[#7db8e8]'
          },
          {
            value: 'EPP',
            label: 'EPP',
            dotClass: 'bg-emerald-400'
          },
          {
            value: 'Calzado',
            label: 'Calzado',
            dotClass: 'bg-amber-400'
          }
        ]
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
          name: 'cantidad',
          label: 'Cantidad',
          type: 'number',
          defaultValue: 1,
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
          label: 'Fecha de entrega'
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
        },
        {
          key: 'cantidad',
          label: 'Cantidad'
        }
      ]}
      badgeConfig={{
        Uniforme: {
          label: 'Uniforme',
          className: 'bg-[#EAF4FC] text-[#164e87]'
        },

        EPP: {
          label: 'EPP',
          className: 'bg-emerald-100 text-emerald-700'
        },

        Calzado: {
          label: 'Calzado',
          className: 'bg-amber-100 text-amber-700'
        }
      }}
      mapBeforeSave={(form) => ({
        ...form,
        empleado_id: Number(form.empleado_id),
        cantidad: Number(form.cantidad)
      })}
    />
  )
}
