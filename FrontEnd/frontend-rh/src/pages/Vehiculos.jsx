import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, CalendarClock, CarFront, ShieldCheck } from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'
import FeedbackToast from '../components/FeedbackToast'
import RhModal from '../components/RhModal'
import { API_URL } from '../config/api'

const emptyVehicle = {
  fotoVehiculo: '',
  fotoVehiculoFile: null,
  fotoVehiculoPreview: '',
  numeroVehiculo: '',
  marca: '',
  modelo: '',
  anio: '',
  color: '',
  placas: '',
  numeroPoliza: '',
  aseguradora: '',
  numeroTarjetaCirculacion: '',
  vigenciaPoliza: '',
  vigenciaTarjeta: ''
}

function getTokenHeaders() {
  return {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

const getVehiculoFotoUrl = (fotoVehiculo) => {
  if (!fotoVehiculo) return null
  const fotoValue = String(fotoVehiculo)
  if (fotoValue.startsWith('blob:') || fotoValue.startsWith('data:')) return fotoValue
  if (fotoValue.startsWith('http')) return fotoValue
  if (fotoValue.startsWith('/uploads')) return `${API_URL}${fotoValue}`
  return `${API_URL}/uploads/vehiculos/${fotoValue}`
}

function getFechaInputValue(fecha) {
  if (
    !fecha ||
    fecha === 'Invalid date' ||
    fecha === 'undefined' ||
    fecha === 'null'
  ) {
    return ''
  }

  return String(fecha).slice(0, 10)
}

function isFechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(getFechaInputValue(fecha))
}

function buildVehiculoFormData(vehiculo) {
  const formData = new FormData()

  ;[
    'numeroVehiculo',
    'marca',
    'modelo',
    'anio',
    'color',
    'placas',
    'numeroPoliza',
    'aseguradora',
    'numeroTarjetaCirculacion'
  ].forEach((field) => {
    formData.append(field, vehiculo[field] || '')
  })

  ;['vigenciaPoliza', 'vigenciaTarjeta'].forEach((field) => {
    const fecha = getFechaInputValue(vehiculo[field])

    if (isFechaValida(fecha)) {
      formData.append(field, fecha)
    }
  })

  if (vehiculo.fotoVehiculoFile) {
    formData.append('fotoVehiculo', vehiculo.fotoVehiculoFile)
  }

  return formData
}

function daysUntil(dateValue) {
  if (!dateValue) {
    return null
  }

  const today = new Date()
  const target = new Date(`${dateValue}T00:00:00`)
  today.setHours(0, 0, 0, 0)

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

function getExpiryState(dateValue) {
  const days = daysUntil(dateValue)

  if (days === null) {
    return {
      label: 'Sin fecha',
      className: 'bg-slate-100 text-slate-500',
      alert: false
    }
  }

  if (days < 0) {
    return {
      label: 'Vencida',
      className: 'bg-red-100 text-red-700',
      alert: true
    }
  }

  if (days <= 30) {
    return {
      label: `${days} días`,
      className: 'bg-amber-100 text-amber-700',
      alert: true
    }
  }

  return {
    label: 'Vigente',
    className: 'bg-emerald-100 text-emerald-700',
    alert: false
  }
}

export default function Vehiculos({
  vehiculos = [],
  setVehiculos
}) {

  const [selectedId, setSelectedId] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const [form, setForm] = useState(emptyVehicle)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type })

    setTimeout(() => {
      setFeedback(null)
    }, 2200)
  }, [])

  const loadVehiculos = useCallback(async () => {
    try {
   const response = await axios.get(`${API_URL}/vehiculos`, {
  headers: getTokenHeaders()
})

console.log(response.data)
console.log(Array.isArray(response.data))

      setVehiculos(response.data)

setSelectedId(
  (currentId) =>
    currentId || response.data[0]?.id || null
)
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudieron cargar los vehículos', 'error')
    }
  }, [showFeedback, setVehiculos])

  useEffect(() => {
    loadVehiculos()
  }, [loadVehiculos])

const filteredVehicles = useMemo(() => {
  return (vehiculos || []).filter((vehiculo) => {
      const text = [
        vehiculo.marca,
        vehiculo.modelo,
        vehiculo.placas,
        vehiculo.numeroVehiculo
      ].join(' ').toLowerCase()

      return text.includes(search.toLowerCase())
    })
  }, [vehiculos, search])

  const selectedVehicle = vehiculos.find((vehiculo) => vehiculo.id === selectedId) || filteredVehicles[0]
  console.log('VEHICULOS:', vehiculos)

  const openCreateModal = () => {
    setError('')
    setEditingVehicle(null)
    setForm(emptyVehicle)
    setShowFormModal(true)
  }

  const openEditModal = (vehiculo) => {
    setError('')
    setEditingVehicle(vehiculo)
    setForm({
      ...emptyVehicle,
      ...vehiculo
    })
    setShowFormModal(true)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingVehicle(null)
    setError('')
  }

  const saveVehicle = async () => {
    if (!form.numeroVehiculo || !form.marca || !form.modelo || !form.anio || !form.placas) {
      setError('Número interno, marca, modelo, año y placas son obligatorios')
      return
    }

    const payload = buildVehiculoFormData({
      ...form,
      anio: Number(form.anio)
    })

    try {
      if (editingVehicle) {
        await axios.put(`${API_URL}/vehiculos/${editingVehicle.id}`, payload, {
          headers: getTokenHeaders()
        })

        showFeedback('Vehículo actualizado correctamente')
      } else {
        const response = await axios.post(`${API_URL}/vehiculos`, payload, {
          headers: getTokenHeaders()
        })

        setSelectedId(response.data.vehiculo?.id || null)
        showFeedback('Vehículo registrado correctamente')
      }

      await loadVehiculos()
      closeFormModal()
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || 'No se pudo guardar el vehículo')
    }
  }

  const deleteVehicle = async () => {
    try {
      await axios.delete(`${API_URL}/vehiculos/${vehicleToDelete.id}`, {
        headers: getTokenHeaders()
      })

      const remainingVehicles = vehiculos.filter((vehiculo) => vehiculo.id !== vehicleToDelete.id)
      setVehiculos(remainingVehicles)
      setSelectedId(remainingVehicles[0]?.id || null)
      setVehicleToDelete(null)
      showFeedback('Vehículo eliminado correctamente')
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudo eliminar el vehículo', 'error')
    }
  }

  const formFields = [
    { name: 'numeroVehiculo', label: 'Número interno', required: true },
    { name: 'marca', label: 'Marca', required: true },
    { name: 'modelo', label: 'Modelo', required: true },
    { name: 'anio', label: 'Año', type: 'number', required: true },
    { name: 'color', label: 'Color' },
    { name: 'placas', label: 'Placas', required: true },
    { name: 'numeroPoliza', label: 'Número de póliza' },
    { name: 'aseguradora', label: 'Aseguradora' },
    { name: 'numeroTarjetaCirculacion', label: 'Tarjeta de circulación' },
    { name: 'vigenciaPoliza', label: 'Vigencia póliza', type: 'date' },
    { name: 'vigenciaTarjeta', label: 'Vigencia tarjeta circulación', type: 'date' }
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          
          <p className="text-slate-500 mt-2">
            Control de unidades, pólizas y tarjetas de circulación
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#0b2447] hover:bg-[#16325c] text-white px-5 py-3 rounded-xl transition-all shadow-md hover:-translate-y-1 w-full sm:w-auto"
        >
          + Nuevo vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <section className="bg-white rounded-3xl p-4 md:p-6 shadow-sm min-w-0">
          <input
            type="text"
            placeholder="Buscar por marca, modelo o placas"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border border-slate-200 bg-[#f8fbff] rounded-2xl px-5 py-3 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF] mb-5"
          />

          <div className="space-y-3 max-h-[420px] xl:max-h-[650px] overflow-y-auto pr-1">
            {filteredVehicles.map((vehiculo) => {
              const polizaState = getExpiryState(vehiculo.vigenciaPoliza)
              const tarjetaState = getExpiryState(vehiculo.vigenciaTarjeta)
              const hasAlert = polizaState.alert || tarjetaState.alert

              return (
                <button
                  type="button"
                  key={vehiculo.id}
                  onClick={() => setSelectedId(vehiculo.id)}
                  className={`w-full text-left rounded-2xl p-4 border transition-all ${
                    selectedVehicle?.id === vehiculo.id
                      ? 'border-[#BFE0FF] bg-[#f8fbff] shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#eaf4ff] text-[#07355E] flex items-center justify-center overflow-hidden">
                      {vehiculo.fotoVehiculo ? (
                        <img
                          src={getVehiculoFotoUrl(vehiculo.fotoVehiculo)}
                          alt={vehicleImageAlt(vehiculo)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CarFront size={26} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#07355E] truncate">
                        {vehicleTitle(vehiculo)}
                      </p>

                      <p className="text-sm text-slate-500">
                        {vehiculo.placas} · {vehiculo.anio}
                      </p>
                    </div>

                    {hasAlert && (
                      <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center">
                        <AlertTriangle size={17} />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}

            {filteredVehicles.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                No hay vehículos para mostrar
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-4 md:p-8 shadow-sm min-h-[420px] xl:min-h-[560px] min-w-0">
          {selectedVehicle ? (
            <VehicleDetail
              vehiculo={selectedVehicle}
              onEdit={() => openEditModal(selectedVehicle)}
              onDelete={() => setVehicleToDelete(selectedVehicle)}
            />
          ) : (
            <div className="h-full min-h-[300px] md:min-h-[420px] flex flex-col items-center justify-center text-center text-slate-400">
              <CarFront size={54} className="mb-4" />
              <p>Selecciona o registra un vehículo</p>
            </div>
          )}
        </section>
      </div>

      {showFormModal && (
        <RhModal
          title={editingVehicle ? 'Editar vehículo' : 'Registrar vehículo'}
          onClose={closeFormModal}
          footer={(
            <button
              type="button"
              onClick={saveVehicle}
              className="w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              Guardar vehículo
            </button>
          )}
        >
          <div className="flex flex-col items-center mb-5">
            <div className="w-40 h-32 rounded-3xl bg-[#eaf4ff] overflow-hidden flex items-center justify-center text-[#07355E]">
              {(form.fotoVehiculoPreview || form.fotoVehiculo) ? (
                <img
                  src={form.fotoVehiculoPreview || getVehiculoFotoUrl(form.fotoVehiculo)}
                  alt={form.numeroVehiculo || form.placas || 'Vehículo'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CarFront size={48} />
              )}
            </div>

            <input
              type="file"
              id="foto-vehiculo"
              className="hidden"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0]

                if (file) {
                  setForm({
                    ...form,
                    fotoVehiculoFile: file,
                    fotoVehiculoPreview: URL.createObjectURL(file)
                  })
                }
              }}
            />

            <label
              htmlFor="foto-vehiculo"
              className="mt-4 inline-flex cursor-pointer rounded-xl bg-[#07355E] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1B2A38]"
            >
              {form.fotoVehiculo ? 'Cambiar foto' : 'Seleccionar foto'}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formFields.map((field) => (
              <label key={field.name}>
                <span className="block text-sm text-slate-500 mb-2">
                  {field.label}
                </span>
                <input
                  type={field.type || 'text'}
                  value={field.type === 'date' ? getFechaInputValue(form[field.name]) : form[field.name] || ''}
                  onChange={(event) => setForm({
                    ...form,
                    [field.name]: event.target.value
                  })}
                  className="border border-slate-300 rounded-2xl px-5 py-4 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF] bg-white"
                  placeholder={field.label}
                />
              </label>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-5 text-center">
              {error}
            </p>
          )}
        </RhModal>
      )}

      {vehicleToDelete && (
        <ConfirmModal
          title="Eliminar vehículo"
          message="Deseas eliminar"
          highlight={vehicleTitle(vehicleToDelete)}
          onConfirm={deleteVehicle}
          onCancel={() => setVehicleToDelete(null)}
        />
      )}

      <FeedbackToast message={feedback?.message} type={feedback?.type} />
    </div>
  )
}
function vehicleTitle(vehiculo) {
  return `${vehiculo.marca} ${vehiculo.modelo}`
}
function vehicleImageAlt(vehiculo) {
  return vehiculo.numeroVehiculo || vehiculo.placas || 'Vehículo'
}
function VehicleDetail({ vehiculo, onEdit, onDelete }) {
  const polizaState = getExpiryState(vehiculo.vigenciaPoliza)
  const tarjetaState = getExpiryState(vehiculo.vigenciaTarjeta)

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 h-56 rounded-3xl bg-[#eaf4ff] overflow-hidden flex items-center justify-center text-[#07355E]">
          {vehiculo.fotoVehiculo ? (
            <img
              src={getVehiculoFotoUrl(vehiculo.fotoVehiculo)}
              alt={vehicleImageAlt(vehiculo)}
              className="w-full h-full object-cover"
            />
          ) : (
            <CarFront size={72} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div>
              <p className="text-slate-400 font-medium">
                Unidad {vehiculo.numeroVehiculo}
              </p>

              <h2 className="text-4xl font-medium text-[#001b70] font-['Cooper'] mt-1">
                {vehicleTitle(vehiculo)}
              </h2>

              <p className="text-slate-500 mt-2">
                {vehiculo.color || 'Color sin registrar'} · Placas {vehiculo.placas}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={onEdit}
                className="bg-[#07355E] hover:bg-[#1B2A38] text-white px-5 py-3 rounded-xl transition-all shadow-md"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition-all shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <InfoCard label="Año" value={vehiculo.anio} />
            <InfoCard label="Aseguradora" value={vehiculo.aseguradora || 'Sin registro'} />
            <InfoCard label="Póliza" value={vehiculo.numeroPoliza || 'Sin registro'} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        <ExpiryCard
          icon={<ShieldCheck size={24} />}
          title="Vigencia póliza"
          date={vehiculo.vigenciaPoliza}
          state={polizaState}
        />

        <ExpiryCard
          icon={<CalendarClock size={24} />}
          title="Tarjeta circulación"
          date={vehiculo.vigenciaTarjeta}
          state={tarjetaState}
          helper={vehiculo.numeroTarjetaCirculacion || 'Sin número de tarjeta'}
        />
      </div>

      {(polizaState.alert || tarjetaState.alert) && (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-4 text-amber-800">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p className="font-semibold">
              Atención de vigencias
            </p>

            <p className="text-sm mt-1">
              Revisa los documentos marcados como vencidos o próximos a vencer para mantener la unidad en regla.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#f8fbff] border border-slate-100 p-5">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="font-semibold text-[#07355E] mt-1">
        {value}
      </p>
    </div>
  )
}

function ExpiryCard({ icon, title, date, state, helper }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-[#f8fbff] p-6">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#07355E] flex items-center justify-center">
            {icon}
          </div>

          <div>
            <p className="font-semibold text-[#07355E]">
              {title}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {date || 'Sin fecha registrada'}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${state.className}`}>
          {state.label}
        </span>
      </div>

      {helper && (
        <p className="text-sm text-slate-500 mt-5">
          {helper}
        </p>
      )}
    </div>
  )
}
