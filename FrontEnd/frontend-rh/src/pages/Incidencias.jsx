import RhCrudPage from '../components/RhCrudPage'

const statusOptions = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En proceso', label: 'En proceso' },
  { value: 'Resuelto', label: 'Resuelto' }
]

export default function Incidencias({ empleados }) {
  return (
    <RhCrudPage
      title="Incidencias"
      subtitle="Da seguimiento a incidencias internas y su estado de resolución"
      endpoint="/incidencias"
      empleados={empleados}
      searchPlaceholder="Buscar por empleado"
      formTitle="incidencia"
      deleteTitle="Eliminar incidencia"
      deleteLabel="Incidencia"
      filter={{
        field: 'status',
        options: statusOptions
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
          name: 'fecha',
          label: 'Fecha',
          type: 'date',
          required: true
        },
        {
          name: 'tipo',
          label: 'Tipo de incidencia',
          required: true
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: statusOptions,
          required: true
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          full: true,
          required: true
        }
      ]}
      columns={[
        {
          key: 'Empleado.nombre',
          label: 'Empleado'
        },
        {
          key: 'fecha',
          label: 'Fecha'
        },
        {
          key: 'tipo',
          label: 'Tipo'
        },
        {
          key: 'status',
          label: 'Status',
          badge: true
        },
        {
          key: 'descripcion',
          label: 'Descripción'
        }
      ]}
      badgeConfig={{
        Pendiente: {
          label: 'Pendiente',
          className: 'bg-amber-100 text-amber-700'
        },
        'En proceso': {
          label: 'En proceso',
          className: 'bg-blue-100 text-blue-700'
        },
        Resuelto: {
          label: 'Resuelto',
          className: 'bg-emerald-100 text-emerald-700'
        }
      }}
      mapBeforeSave={(form) => ({
        ...form,
        empleado_id: Number(form.empleado_id)
      })}
    />
  )
}
