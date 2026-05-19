export default function Empleados({
  empleados,
  fotosDemo,
  setEmpleadoSeleccionado,
  setEmpleadoAEliminar,
  setShowDeleteModal,
  setShowEmpleadoModal
}) {

  return (

    <div className="p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-medium text-[#001b70] font-['Cooper']">
            Empleados
          </h1>

          <p className="text-slate-500 mt-2">
            Gestiona la información de los colaboradores
          </p>

        </div>

        <button
          onClick={() => setShowEmpleadoModal(true)}
          className="bg-[#0b2447] hover:bg-[#16325c] text-white px-5 py-3 rounded-xl transition-all"
        >
          + Nuevo empleado
        </button>

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

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

              const fotoRandom =
  fotosDemo[empleado.id % fotosDemo.length]

                return (

                  <tr
                    key={empleado.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                  >

                    <td className="py-5">

                      <button
                        onClick={() =>
                          setEmpleadoSeleccionado({
                            ...empleado,
                           foto: fotoRandom
                          })
                        }
                        className="font-medium text-[#07355E] hover:underline hover:text-[#1B2A38] transition-all"
                      >
                        {empleado.nombre}
                      </button>

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