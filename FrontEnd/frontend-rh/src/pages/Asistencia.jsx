import RhCrudPage from '../components/RhCrudPage'

const tipoOptions = [
  { value: 'retardo', label: 'Retardo' },
  { value: 'falta', label: 'Falta' },
  { value: 'horas_extra', label: 'Hora extra' }
]

export default function Asistencia({ empleados }) {
  return (
    <RhCrudPage
      subtitle="Registra retardos, faltas y horas extra del equipo"
      endpoint="/asistencia"
      empleados={empleados}
      searchPlaceholder="Buscar por empleado"
      formTitle="asistencia"
      deleteTitle="Eliminar asistencia"
      deleteLabel="Asistencia"
      filter={{
        field: 'type',
        options: tipoOptions
      }}

      summary={{
        field: 'type',
        items: [
          {
            value: 'falta',
            label: 'Faltas',
            dotClass: 'bg-red-400'
          },
          {
            value: 'retardo',
            label: 'Retardos',
            dotClass: 'bg-amber-400'
          },
          {
            value: 'horas_extra',
            label: 'Horas extra',
            dotClass: 'bg-[#7db8e8]'
          }
        ]
      }}
      fields={[
        {
          name: 'employeeId',
          label: 'Empleado',
          type: 'select',
          options: 'empleados',
          required: true
        },
        {
          name: 'date',
          label: 'Fecha',
          type: 'date',
          required: true
        },
        {
          name: 'type',
          label: 'Tipo',
          type: 'select',
          options: tipoOptions,
          required: true
        },
        {
          name: 'description',
          label: 'Descripción',
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
          key: 'date',
          label: 'Fecha'
        },
        {
          key: 'type',
          label: 'Tipo',
          badge: true
        },
        {
          key: 'description',
          label: 'Descripción'
        }
      ]}
      badgeConfig={{
        retardo: {
          label: 'Retardo',
          className: 'bg-amber-100 text-amber-700'
        },
        falta: {
          label: 'Falta',
          className: 'bg-red-100 text-red-700'
        },
        horas_extra: {
          label: 'Hora extra',
          className: 'bg-[#EAF4FC] text-[#164e87]'
        }
      }}
      mapBeforeSave={(form) => ({
        ...form,
        employeeId: Number(form.employeeId),
        hours: form.type === 'horas_extra' ? 1 : null
      })}
    />
  )
}
