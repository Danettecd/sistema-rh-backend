import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        <div>

          <p className="text-slate-500 mt-2">
            Gestiona la información de los colaboradores
          </p>

        </div>

        <button
          onClick={() => setShowEmpleadoModal(true)}
          className="bg-[#0b2447] hover:bg-[#16325c] text-white px-5 py-3 rounded-xl transition-all w-full sm:w-auto"
        >
          + Nuevo empleado
        </button>

      </div>

      <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px]">

            <thead>

              <tr className="border-b border-slate-200 text-slate-500">

                <th className="text-left pb-4">Nombre</th>
                <th className="text-left pb-4">Correo</th>
                <th className="text-left pb-4">Puesto</th>
                <th className="text-left pb-4">Teléfono</th>
                <th className="text-left pb-4">Acciones</th>

              </tr>

            </thead>

            <tbody>

              {empleados.map((empleado) => {

                return (

                  <tr
                    key={empleado.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-4">
                        <EmpleadoAvatar empleado={empleado} />

                        <button
                          onClick={() => setEmpleadoSeleccionado(empleado)}
                          className="font-medium text-[#07355E] hover:underline hover:text-[#1B2A38] transition-all"
                        >
                          {empleado.nombre}
                        </button>
                      </div>

                    </td>

                    <td className="py-5 text-slate-500">
                      {empleado.email}
                    </td>

                    <td className="py-5 text-slate-500">
                      {empleado.puesto}
                    </td>

                    <td className="py-5 text-slate-500">
                      {empleado.telefono}
                    </td>

                    <td className="py-5">

                      <div className="flex gap-3">

                        <button
                          onClick={() => {
                            setShowEmpleadoModal(false)
                            setEmpleadoSeleccionado(empleado)
                          }}
                          className="bg-[#07355E] hover:bg-[#1B2A38] hover:-translate-y-1 shadow-md text-white px-4 py-2 rounded-xl transition-all duration-300"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => {
                            setEmpleadoAEliminar(empleado)
                            setShowDeleteModal(true)
                          }}
                          className="bg-red-500 hover:bg-red-600 hover:-translate-y-1 shadow-md text-white px-4 py-2 rounded-xl transition-all duration-300"
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
