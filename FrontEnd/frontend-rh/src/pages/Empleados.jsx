import { useState } from 'react'
import { API_URL } from '../config/api'

function getEmpleadoFotoUrl(foto) {
  if (!foto) {
    return null
  }

  const fotoValue = String(foto)

  if (
    fotoValue.startsWith('blob:') ||
    fotoValue.startsWith('data:') ||
    fotoValue.startsWith('http')
  ) {
    return fotoValue
  }

  if (fotoValue.startsWith('/uploads')) {
    return `${API_URL}${fotoValue}`
  }

  if (fotoValue.startsWith('uploads/')) {
    return `${API_URL}/${fotoValue}`
  }

  return `${API_URL}/uploads/empleados/${fotoValue}`
}

function getEmpleadoIniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)

  return partes
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'SG'
}

function EmpleadoAvatar({ empleado }) {
  const [hasError, setHasError] = useState(false)
  const fotoUrl = getEmpleadoFotoUrl(empleado.foto)

  return (
    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#eaf6ff] shadow-sm">
      {fotoUrl && !hasError ? (
        <img
          src={fotoUrl}
          alt={empleado.nombre}
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            console.log('No cargó foto:', getEmpleadoFotoUrl(empleado.foto))
            e.currentTarget.style.display = 'none'
            setHasError(true)
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d8efff] via-white to-[#bfe0ff] text-sm font-bold text-[#07355E]">
          {getEmpleadoIniciales(empleado.nombre)}
        </div>
      )}
    </div>
  )
}

export default function Empleados({
  empleados,
  setEmpleadoSeleccionado,
  setEmpleadoAEliminar,
  setShowDeleteModal,
  setShowEmpleadoModal
}) {

  return (

    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">

      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        <div>

          <p className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2">
            PERSONAL
          </p>

          <h2 className="text-3xl md:text-4xl font-medium text-[#001b70] font-['Cooper']">
            Empleados
          </h2>

          <p className="text-slate-500 mt-2">
            Gestiona la información de los colaboradores
          </p>

        </div>

        <button
          onClick={() => setShowEmpleadoModal(true)}
          className="
            bg-[#0b2447]
            hover:bg-[#16325c]
            hover:-translate-y-0.5
            text-white
            px-5 py-3
            rounded-2xl
            shadow-sm
            transition-all
            duration-200
            w-full sm:w-auto
            font-medium
          "
        >
          + Nuevo empleado
        </button>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px]">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="text-left pb-4 text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
                  Nombre
                </th>

                <th className="text-left pb-4 text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
                  Correo
                </th>

                <th className="text-left pb-4 text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
                  Puesto
                </th>

                <th className="text-left pb-4 text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
                  Teléfono
                </th>

                <th className="text-left pb-4 text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody>

              {empleados.map((empleado) => {

                return (

                  <tr
                    key={empleado.id}
                    className="
                      border-b border-slate-100
                      last:border-b-0
                      hover:bg-[#f8fbfe]
                      transition-all
                    "
                  >

                    {/* NOMBRE */}
                    <td className="py-5">

                      <div className="flex items-center gap-4">

                        <EmpleadoAvatar empleado={empleado} />

                        <button
                          onClick={() => setEmpleadoSeleccionado(empleado)}
                          className="
                            font-semibold
                            text-[#07355E]
                            hover:text-[#164e87]
                            transition-all
                            text-left
                          "
                        >
                          {empleado.nombre}
                        </button>

                      </div>

                    </td>

                    {/* CORREO */}
                    <td className="py-5 text-slate-500 text-sm">
                      {empleado.email}
                    </td>

                    {/* PUESTO */}
                    <td className="py-5">

                      <span
                        className="
                          inline-flex
                          items-center
                          bg-[#EAF4FC]
                          text-[#164e87]
                          text-xs
                          font-semibold
                          px-3 py-1.5
                          rounded-full
                        "
                      >
                        {empleado.puesto}
                      </span>

                    </td>

                    {/* TELEFONO */}
                    <td className="py-5 text-slate-500 text-sm">
                      {empleado.telefono}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-5">

                      <div className="flex gap-2">

                        <button
                          onClick={() => {
                            setShowEmpleadoModal(false)
                            setEmpleadoSeleccionado(empleado)
                          }}
                          className="
                            border border-[#b8d6ee]
                            text-[#164e87]
                            hover:bg-[#EAF4FC]
                            px-4 py-2
                            rounded-xl
                            text-sm
                            font-medium
                            transition-all
                          "
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => {
                            setEmpleadoAEliminar(empleado)
                            setShowDeleteModal(true)
                          }}
                          className="
                            border border-red-200
                            text-red-500
                            hover:bg-red-50
                            px-4 py-2
                            rounded-xl
                            text-sm
                            font-medium
                            transition-all
                          "
                        >
                          Eliminar
                        </button>

                      </div>

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}