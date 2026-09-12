import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Activity,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Trash2
} from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'
import FeedbackToast from '../components/FeedbackToast'
import RhModal from '../components/RhModal'
import { API_URL } from '../config/api'

const tabConfig = [
  {
    key: 'salud',
    label: 'Salud',
    icon: HeartPulse
  },
  {
    key: 'citas',
    label: 'Citas Médicas',
    icon: CalendarDays
  },
  {
    key: 'incapacidades',
    label: 'Incapacidades',
    icon: ClipboardList
  },
  {
    key: 'presiones',
    label: 'Presión',
    icon: Activity
  }
]

const emptySalud = {
  nss: '',
  clinica: '',
  padecimientos: '',
  tipo_sangre: '',
  contacto_emergencia: '',
  telefono_emergencia: ''
}

const emptyForms = {
  citas: {
    fecha: '',
    hora: '',
    especialidad: '',
    comentarios: ''
  },
  incapacidades: {
    fecha_inicio: '',
    fecha_fin: '',
    motivo: ''
  },
  presiones: {
    fecha: '',
    presion: '',
    observaciones: ''
  }
}

const recordConfig = {
  citas: {
    endpoint: '/citas',
    singular: 'cita',
    historyTitle: 'Historial de citas',
    viewButton: 'Ver citas',
    emptyText: 'No hay citas registradas',
    dateKey: 'fecha',
    fields: [
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'hora', label: 'Hora', type: 'time' },
      { name: 'especialidad', label: 'Especialidad', required: true },
      { name: 'comentarios', label: 'Motivo', type: 'textarea' }
    ],
    display: [
      { key: 'fecha', label: 'Fecha:' },
      { key: 'hora', label: 'Hora:' },
      { key: 'especialidad', label: 'Especialidad:' },
      { key: 'comentarios', label: 'Motivo:' }
    ]
  },
  incapacidades: {
    endpoint: '/incapacidades',
    singular: 'incapacidad',
    historyTitle: 'Historial de incapacidades',
    viewButton: 'Ver incapacidades',
    emptyText: 'No hay incapacidades registradas',
    dateKey: 'fecha_inicio',
    fields: [
      { name: 'fecha_inicio', label: 'Fecha de inicio', type: 'date', required: true },
      { name: 'fecha_fin', label: 'Fecha de terminación', type: 'date', required: true },
      { name: 'motivo', label: 'Motivo', type: 'textarea', required: true }
    ],
    display: [
      { key: 'fecha_inicio', label: 'Fecha de Inicio:' },
      { key: 'fecha_fin', label: 'Fecha de terminación:' },
      { key: 'dias', label: 'Días:' },
      { key: 'motivo', label: 'Motivo:' }
    ]
  },
  presiones: {
    endpoint: '/presiones',
    singular: 'presión',
    historyTitle: 'Historial de presiones',
    viewButton: 'Ver presiones',
    emptyText: 'No hay tomas de presión registradas',
    dateKey: 'fecha',
    fields: [
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'presion', label: 'Presión', placeholder: '120/80', required: true },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea' }
    ],
    display: [
      { key: 'fecha', label: 'Fecha' },
      { key: 'presion', label: 'Presión:' },
      { key: 'observaciones', label: 'Observaciones:' }
    ]
  }
}

function getTokenHeaders() {
  return {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

function sortByLatest(records, dateKey) {
  return [...records].sort((first, second) => {
    const firstDate = first[dateKey] || ''
    const secondDate = second[dateKey] || ''

    if (firstDate === secondDate) {
      return (second.id || 0) - (first.id || 0)
    }

    return secondDate.localeCompare(firstDate)
  })
}

function calculateDays(start, end) {
  if (!start || !end) {
    return ''
  }

  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
    return ''
  }

  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  return value
}

function formatName(name = '') {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function Salud({ empleados = [] }) {
  const [activeTab, setActiveTab] = useState('salud')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [saludRecords, setSaludRecords] = useState([])
  const [records, setRecords] = useState({
    citas: [],
    incapacidades: [],
    presiones: []
  })
  const [showSaludModal, setShowSaludModal] = useState(false)
  const [saludForm, setSaludForm] = useState(emptySalud)
  const [editingSalud, setEditingSalud] = useState(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [recordForm, setRecordForm] = useState(emptyForms.citas)
  const [editingRecord, setEditingRecord] = useState(null)
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type })

    setTimeout(() => {
      setFeedback(null)
    }, 2200)
  }, [])

  const loadHealthData = useCallback(async () => {
    try {
      const [saludResponse, citasResponse, incapacidadesResponse, presionesResponse] = await Promise.all([
        axios.get(`${API_URL}/salud`, { headers: getTokenHeaders() }),
        axios.get(`${API_URL}/citas`, { headers: getTokenHeaders() }),
        axios.get(`${API_URL}/incapacidades`, { headers: getTokenHeaders() }),
        axios.get(`${API_URL}/presiones`, { headers: getTokenHeaders() })
      ])

      setSaludRecords(saludResponse.data)
      setRecords({
        citas: citasResponse.data,
        incapacidades: incapacidadesResponse.data,
        presiones: presionesResponse.data
      })
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudo cargar el módulo de salud', 'error')
    }
  }, [showFeedback])

  useEffect(() => {
    loadHealthData()
  }, [loadHealthData])

  const selectedEmployee = useMemo(() => {
    return empleados.find((empleado) => String(empleado.id) === String(selectedEmployeeId))
  }, [empleados, selectedEmployeeId])

  const currentSalud = useMemo(() => {
    return saludRecords.find((item) => String(item.empleado_id) === String(selectedEmployeeId))
  }, [saludRecords, selectedEmployeeId])

  const employeeRecords = useMemo(() => {
    return {
      citas: sortByLatest(
        records.citas.filter((item) => String(item.empleado_id) === String(selectedEmployeeId)),
        recordConfig.citas.dateKey
      ),
      incapacidades: sortByLatest(
        records.incapacidades.filter((item) => String(item.empleado_id) === String(selectedEmployeeId)),
        recordConfig.incapacidades.dateKey
      ),
      presiones: sortByLatest(
        records.presiones.filter((item) => String(item.empleado_id) === String(selectedEmployeeId)),
        recordConfig.presiones.dateKey
      )
    }
  }, [records, selectedEmployeeId])

  const filteredEmployees = useMemo(() => {
    const text = employeeSearch.trim().toLowerCase()

    return empleados.filter((empleado) =>
      empleado.nombre.toLowerCase().includes(text)
    )
  }, [empleados, employeeSearch])

  const activeRecordConfig = recordConfig[activeTab]
  const activeRecordList = activeTab === 'salud' ? [] : employeeRecords[activeTab]
  const latestRecord = activeRecordList[0]
  const hasSelectedEmployee = Boolean(selectedEmployee)

  const selectEmployee = (empleado) => {
    setSelectedEmployeeId(empleado.id)
    setEmployeeSearch('')
    setShowEmployeeList(false)
  }

  const openSaludModal = () => {
    if (!selectedEmployeeId) {
      setError('Selecciona un empleado')
      return
    }

    setError('')

    setEditingSalud(currentSalud || null)

    setSaludForm({
      ...emptySalud,
      ...(currentSalud || {})
    })

    setShowSaludModal(true)
  }
const openCreateRecordModal = () => {
  if (!selectedEmployeeId) {
    setError('Selecciona un empleado')
    return
  }

  if (activeTab === 'salud') {
    openSaludModal()
    return
  }

  setError('')
  setEditingRecord(null)
  setRecordForm(emptyForms[activeTab])

  setShowHistoryModal(false)
  setShowRecordModal(true)
}

 const openEditRecordModal = (record = latestRecord) => {
  if (!record) {
    openCreateRecordModal()
    return
  }

  setError('')
  setEditingRecord(record)

  setRecordForm({
    ...emptyForms[activeTab],
    ...record
  })

  setShowHistoryModal(false)
  setShowRecordModal(true)
}

  const closeRecordModal = () => {
    setShowRecordModal(false)
    setEditingRecord(null)
    setError('')
  }

  const saveSalud = async () => {
    if (!selectedEmployeeId) {
      setError('Selecciona un empleado')
      return
    }

    if (!saludForm.nss.trim()) {
      setError('NSS es obligatorio')
      return
    }

    const payload = {
      empleado_id: Number(selectedEmployeeId),
      nss: saludForm.nss,
      clinica: saludForm.clinica,
      padecimientos: saludForm.padecimientos,
      tipo_sangre: saludForm.tipo_sangre,
      contacto_emergencia: saludForm.contacto_emergencia,
      telefono_emergencia: saludForm.telefono_emergencia
    }

    try {
      if (editingSalud) {
        await axios.put(`${API_URL}/salud/${editingSalud.id}`, payload, {
          headers: getTokenHeaders()
        })
      } else {
        await axios.post(`${API_URL}/salud`, payload, {
          headers: getTokenHeaders()
        })
      }

      await loadHealthData()
      setShowSaludModal(false)
      setEditingSalud(null)
      showFeedback('Información médica guardada correctamente')
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || 'No se pudo guardar la información médica')
    }
  }

  const validateRecordForm = () => {
    const requiredField = activeRecordConfig.fields.find((field) => {
      return field.required && !String(recordForm[field.name] || '').trim()
    })

    if (requiredField) {
      setError(`${requiredField.label} es obligatorio`)
      return false
    }

    if (activeTab === 'incapacidades' && recordForm.fecha_inicio && recordForm.fecha_fin) {
      const days = calculateDays(recordForm.fecha_inicio, recordForm.fecha_fin)

      if (!days) {
        setError('La fecha de terminación no puede ser menor a la fecha de inicio')
        return false
      }
    }

    return true
  }

  const saveRecord = async () => {
    if (!selectedEmployeeId) {
      setError('Selecciona un empleado')
      return
    }

    if (!validateRecordForm()) {
      return
    }

    const payload = {
      ...recordForm,
      empleado_id: Number(selectedEmployeeId)
    }

    try {
      if (editingRecord) {
        await axios.put(`${API_URL}${activeRecordConfig.endpoint}/${editingRecord.id}`, payload, {
          headers: getTokenHeaders()
        })
      } else {
        await axios.post(`${API_URL}${activeRecordConfig.endpoint}`, payload, {
          headers: getTokenHeaders()
        })
      }

      await loadHealthData()
      closeRecordModal()
      showFeedback(`${activeRecordConfig.singular} guardada correctamente`)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || 'No se pudo guardar el registro')
    }
  }

  const deleteRecord = async () => {
    const config = recordConfig[recordToDelete.tab]

    try {
      await axios.delete(`${API_URL}${config.endpoint}/${recordToDelete.record.id}`, {
        headers: getTokenHeaders()
      })

      await loadHealthData()
      setRecordToDelete(null)
      showFeedback(`${config.singular} eliminada correctamente`)
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudo eliminar el registro', 'error')
    }
  }

  return (
    <div
      className="
    p-4 md:p-6 lg:p-8
    max-w-full
    overflow-x-hidden
    min-h-[calc(100vh-96px)]
    bg-[#f4f8fc]
  "
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>


          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#7394b5] font-semibold mb-2">
              SALUD OCUPACIONAL
            </p>

            <p className="text-slate-500 text-sm">
              Consulta y registra información médica de los empleados
            </p>
          </div>
        </div>

      </div>

      <section>
        <div
          className="
      grid
      grid-cols-1
      xl:grid-cols-[320px_minmax(0,1fr)]
      gap-5
      items-stretch
    "
        >

          {/* =========================
        LISTA DE EMPLEADOS
    ========================== */}
          <aside
            className="
        bg-white
        rounded-[26px]
        border border-slate-100
        shadow-[0_8px_30px_rgba(8,43,89,0.06)]
        p-4
        min-w-0
      "
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2">
                Empleados
              </p>

              <p className="text-sm text-slate-500">
                Selecciona un empleado
              </p>
            </div>

            {/* BUSCADOR */}
            <div className="relative mb-4">
              <input
                type="text"
                value={employeeSearch}
                onChange={(event) => {
                  setEmployeeSearch(event.target.value)
                  setError('')
                }}
                placeholder="Buscar empleado"
                className="
            w-full
            rounded-xl
            border border-[#d7e6f2]
            bg-[#f8fbfe]
            px-4 py-3
            text-sm
            text-slate-700
            outline-none
            placeholder:text-slate-400
            focus:border-[#9bc8e8]
            focus:ring-2
            focus:ring-[#EAF4FC]
          "
              />
            </div>

            {/* LISTA PERMANENTE */}
            <div className="space-y-2 max-h-[530px] overflow-y-auto pr-1">

              {filteredEmployees.map((empleado) => {
                const active =
                  String(selectedEmployeeId) === String(empleado.id)

                const initials = empleado.nombre
                  ?.split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('')
                  .toUpperCase()

                return (
                  <button
                    type="button"
                    key={empleado.id}
                    onClick={() => selectEmployee(empleado)}
                    className={`
                w-full
                flex items-center
                gap-3
                text-left
                rounded-2xl
                border
                px-3 py-3
                transition-all

                ${active
                        ? 'border-[#9ecdf0] bg-[#edf7ff] shadow-sm'
                        : 'border-slate-100 bg-white hover:bg-[#f7fbfe] hover:border-[#d7e6f2]'
                      }
              `}
                  >
                    <div
                      className={`
                  w-11 h-11
                  rounded-full
                  flex items-center justify-center
                  text-sm
                  font-bold
                  flex-shrink-0

                  ${active
                          ? 'bg-white text-[#164e87]'
                          : 'bg-[#EAF4FC] text-[#164e87]'
                        }
                `}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                    text-sm
                    font-semibold
                    text-[#082b59]
                    truncate
                  "
                      >
                        {formatName(empleado.nombre)}
                      </p>

                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {empleado.puesto || 'Empleado'}
                      </p>
                    </div>

                    <span
                      className={`
                  text-lg
                  ${active
                          ? 'text-[#164e87]'
                          : 'text-slate-300'
                        }
                `}
                    >
                      ›
                    </span>
                  </button>
                )
              })}

              {filteredEmployees.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-400">
                  No se encontraron empleados
                </div>
              )}

            </div>
          </aside>


          {/* =========================
        EXPEDIENTE
    ========================== */}
          <section
            className="
        bg-white
        rounded-[26px]
        border border-slate-100
        shadow-[0_8px_30px_rgba(8,43,89,0.06)]
        p-5 md:p-7
        min-w-0
        min-h-[620px]
      "
          >

            {!hasSelectedEmployee ? (

              <InitialHealthPanel />

            ) : (

              <>
                {/* ENCABEZADO EMPLEADO */}
                <div
                  className="
              flex
              flex-col
              md:flex-row
              md:items-center
              justify-between
              gap-5
              mb-6
            "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                  w-16 h-16
                  rounded-full
                  bg-[#EAF4FC]
                  text-[#164e87]
                  flex items-center justify-center
                  text-xl
                  font-bold
                  flex-shrink-0
                "
                    >
                      {selectedEmployee.nombre
                        ?.split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join('')
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1">
                        Expediente médico
                      </p>

                      <h2
                        className="
                    font-['Cooper']
                    text-2xl md:text-3xl
                    text-[#082b59]
                    leading-tight
                  "
                      >
                        {formatName(selectedEmployee.nombre)}
                      </h2>

                      <p className="text-sm text-slate-400 mt-1">
                        {selectedEmployee.puesto || 'Empleado'}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={openSaludModal}
                    className="
                border border-[#b8d6ee]
                text-[#164e87]
                hover:bg-[#EAF4FC]
                px-5 py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                w-full md:w-auto
              "
                  >
                    Editar información
                  </button>

                </div>


                {/* PESTAÑAS */}
                <div
                  className="
              flex
              items-center
              gap-2 md:gap-6
              overflow-x-auto
              border-b border-slate-200
              mb-6
            "
                >
                  {tabConfig.map((tab) => {
                    const Icon = tab.icon
                    const active = activeTab === tab.key

                    return (
                      <button
                        type="button"
                        key={tab.key}
                        onClick={() => {
                          setActiveTab(tab.key)
                          setError('')
                        }}
                        className={`
                    relative
                    flex
                    items-center
                    gap-2
                    px-3
                    py-4
                    flex-shrink-0
                    text-sm
                    font-medium
                    transition-all

                    ${active
                            ? 'text-[#164e87]'
                            : 'text-slate-500 hover:text-[#164e87]'
                          }
                  `}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.8}
                        />

                        <span>{tab.label}</span>

                        {active && (
                          <span
                            className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[3px]
                        bg-[#164e87]
                        rounded-t-full
                      "
                          />
                        )}
                      </button>
                    )
                  })}
                </div>


                {/* CONTENIDO DE LA PESTAÑA */}
                {activeTab === 'salud' ? (

                  <SaludPanel
                    empleado={selectedEmployee}
                    record={currentSalud}
                    counts={{
                      citas: employeeRecords.citas.length,
                      incapacidades: employeeRecords.incapacidades.length,
                      presiones: employeeRecords.presiones.length
                    }}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />

                ) : (

                  <RecordPanel
                    config={activeRecordConfig}
                    record={latestRecord}
                    onEdit={() => openEditRecordModal(latestRecord)}
                    onHistory={() => setShowHistoryModal(true)}
                  />

                )}

              </>
            )}

          </section>

        </div>
      </section>

      {showSaludModal && (
        <RhModal
          title="Editar salud"
          onClose={() => {
            setShowSaludModal(false)
            setEditingSalud(null)
          }}
          footer={(
            <button
              type="button"
              onClick={saveSalud}
              className="w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              Guardar cambios
            </button>
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[
              { name: 'nss', label: 'NSS' },
              { name: 'clinica', label: 'Clínica' },
              { name: 'tipo_sangre', label: 'Tipo de sangre' },
              { name: 'contacto_emergencia', label: 'Contacto de emergencia' },
              { name: 'telefono_emergencia', label: 'Teléfono de emergencia' }
            ].map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                value={saludForm[field.name] || ''}
                onChange={(value) => setSaludForm({
                  ...saludForm,
                  [field.name]: value
                })}
              />
            ))}

            <label className="md:col-span-2">
              <span className="block text-sm text-slate-500 mb-2">
                Padecimientos
              </span>
              <textarea
                value={saludForm.padecimientos || ''}
                onChange={(event) => setSaludForm({
                  ...saludForm,
                  padecimientos: event.target.value
                })}
                className="border border-slate-300 rounded-2xl px-5 py-4 w-full min-h-28 resize-none text-[15px] outline-none focus:ring-2 focus:ring-[#BFE0FF]"
              />
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-5 text-center">
              {error}
            </p>
          )}
        </RhModal>
      )}

      {showRecordModal && activeRecordConfig && (
        <RhModal
          title={editingRecord ? `Editar ${activeRecordConfig.singular}` : `Registrar ${activeRecordConfig.singular}`}
          onClose={closeRecordModal}
          footer={(
            <button
              type="button"
              onClick={saveRecord}
              className="w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              Guardar
            </button>
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Empleado" value={selectedEmployee?.nombre || ''} disabled />
            {activeRecordConfig.fields.map((field) => (
              <RecordField
                key={field.name}
                field={field}
                value={recordForm[field.name] || ''}
                onChange={(value) => setRecordForm((currentForm) => ({
                  ...currentForm,
                  [field.name]: value
                }))}
              />
            ))}

            {activeTab === 'incapacidades' && (
              <TextField
                label="Días totales"
                value={calculateDays(recordForm.fecha_inicio, recordForm.fecha_fin)}
                disabled
              />
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-5 text-center">
              {error}
            </p>
          )}
        </RhModal>
      )}

      {showHistoryModal && activeRecordConfig && (
        <RhModal
          title={activeRecordConfig.historyTitle}
          onClose={() => setShowHistoryModal(false)}
          footer={(
            <button
              type="button"
              onClick={openCreateRecordModal}
              className="w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              Nuevo registro
            </button>
          )}
        >
          <div className="space-y-3">
            {activeRecordList.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-1 text-sm flex-1">
                  {activeRecordConfig.display.map((item) => (
                    <p key={item.key} className="text-slate-600">
                      <span className="font-bold text-[#00578b]">
                        {item.label}
                      </span>{' '}
                      {formatValue(record[item.key])}
                    </p>
                  ))}
                </div>
<div className="flex gap-2">
  <button
    type="button"
    onClick={() => openEditRecordModal(record)}
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
    type="button"
    onClick={() => setRecordToDelete({
      tab: activeTab,
      record
    })}
    className="
      border border-red-200
      text-red-500
      hover:bg-red-50
      w-10 h-10
      rounded-xl
      flex items-center justify-center
      transition-all
    "
    aria-label="Eliminar registro"
  >
    <Trash2 size={16} />
  </button>
</div>


              </div>
            ))}

            {activeRecordList.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                {activeRecordConfig.emptyText}
              </div>
            )}
          </div>
        </RhModal>
      )}

      {recordToDelete && (
        <ConfirmModal
          title="Eliminar registro"
          message="Deseas eliminar"
          highlight={recordConfig[recordToDelete.tab].singular}
          onConfirm={deleteRecord}
          onCancel={() => setRecordToDelete(null)}
        />
      )}

      <FeedbackToast message={feedback?.message} type={feedback?.type} />
    </div>
  )
}

function InitialHealthPanel() {
  return (
    <div
      className="
        relative
        min-h-[560px]
        overflow-hidden
        rounded-[24px]
        bg-gradient-to-br
        from-white
        via-[#f8fbfe]
        to-[#eaf4fc]
        p-7 md:p-10 lg:p-12
      "
    >
      {/* DECORACIÓN SUAVE */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#dceefb]/60" />
      <div className="absolute right-20 bottom-[-110px] w-72 h-72 rounded-full bg-white/70" />

      <div className="relative z-10 h-full">

        {/* ENCABEZADO */}
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[1.4fr_0.6fr]
            gap-8
            items-start
          "
        >
          <div>
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.28em]
                text-[#7394b5]
                font-semibold
                mb-4
              "
            >
              Salud ocupacional
            </p>

            <h2
              className="
                font-['Cooper']
                text-4xl
                md:text-5xl
                text-[#082b59]
                leading-tight
              "
            >
              Seguimiento médico
            </h2>

            <p
              className="
                text-xl
                md:text-2xl
                text-slate-500
                mt-3
                font-medium
              "
            >
              Personas saludables, equipos más fuertes
            </p>

            <div className="w-16 h-1 bg-[#9ecdf0] rounded-full mt-5 mb-6" />

            <p
              className="
                max-w-[720px]
                text-sm
                md:text-base
                text-slate-500
                leading-relaxed
              "
            >
              Consulta y registra información médica, citas,
              incapacidades y control de presión para mantener
              actualizado el seguimiento de nuestros colaboradores.
            </p>
          </div>

          {/* FRASE DESTACADA */}
          <div
            className="
              hidden
              xl:flex
              justify-end
              pt-8
            "
          >
            <div
              className="
                max-w-[290px]
                rounded-3xl
                border border-[#dceaf5]
                bg-white/80
                px-6 py-7
                shadow-[0_8px_24px_rgba(8,43,89,0.05)]
              "
            >
              <div
                className="
                  w-11 h-11
                  rounded-full
                  bg-[#EAF4FC]
                  text-[#164e87]
                  flex items-center justify-center
                  mb-4
                "
              >
                <HeartPulse size={20} />
              </div>

              <p
                className="
                  font-['Dancing_Script']
                  text-2xl
                  text-[#164e87]
                  leading-relaxed
                "
              >
                Cuidar a nuestra gente también construye el futuro.
              </p>
            </div>
          </div>
        </div>

        {/* TARJETAS */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
            mt-10
          "
        >
          <WelcomeHealthCard
            icon={<HeartPulse size={24} />}
            title="Registro de salud"
            text="Información médica general"
          />

          <WelcomeHealthCard
            icon={<CalendarDays size={24} />}
            title="Citas médicas"
            text="Agenda y seguimiento de citas"
          />

          <WelcomeHealthCard
            icon={<ClipboardList size={24} />}
            title="Incapacidades"
            text="Control de periodos de incapacidad"
          />

          <WelcomeHealthCard
            icon={<Activity size={24} />}
            title="Presión arterial"
            text="Registro y monitoreo de presión"
          />
        </div>

        {/* FRASE MOBILE/TABLET */}
        <div
          className="
            xl:hidden
            mt-8
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10 h-10
              rounded-full
              bg-white
              shadow-sm
              flex items-center justify-center
              text-[#164e87]
            "
          >
            <HeartPulse size={19} />
          </div>

          <p
            className="
              font-['Dancing_Script']
              text-xl
              md:text-2xl
              text-[#164e87]
            "
          >
            Cuidar a nuestra gente también construye el futuro.
          </p>
        </div>

      </div>
    </div>
  )
}

function WelcomeHealthCard({ icon, title, text }) {
  return (
    <div
      className="
        bg-white/90
        border border-[#e1edf6]
        rounded-2xl
        p-5
        min-h-[165px]
        shadow-[0_6px_20px_rgba(8,43,89,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div
        className="
          w-12 h-12
          rounded-full
          bg-[#EAF4FC]
          text-[#164e87]
          flex items-center justify-center
          mb-4
        "
      >
        {icon}
      </div>

      <p className="font-semibold text-[#082b59] text-sm">
        {title}
      </p>

      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
        {text}
      </p>
    </div>
  )
}

function SaludPanel({
  empleado,
  record,
  counts = {
    citas: 0,
    incapacidades: 0,
    presiones: 0
  },
  onNavigate = () => {}
}) {

  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]
        gap-5
      "
    >

      {/* INFORMACIÓN MÉDICA */}
      <div
        className="
          rounded-2xl
          border border-[#e1edf6]
          bg-[#fbfdff]
          p-5
        "
      >

        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              w-10 h-10
              rounded-xl
              bg-[#EAF4FC]
              text-[#164e87]
              flex items-center justify-center
            "
          >
            <HeartPulse size={20} />
          </div>

          <div>
            <p className="font-semibold text-[#082b59]">
              Información médica
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Datos generales del expediente
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

          <MedicalInfoCard
            label="NSS"
            value={record?.nss || empleado?.nss}
          />

          <MedicalInfoCard
            label="Clínica"
            value={record?.clinica}
          />

          <MedicalInfoCard
            label="Tipo de sangre"
            value={record?.tipo_sangre}
          />

          <MedicalInfoCard
            label="Padecimientos"
            value={record?.padecimientos || 'Ninguno'}
          />

          <MedicalInfoCard
            label="Contacto de emergencia"
            value={record?.contacto_emergencia}
          />

          <MedicalInfoCard
            label="Teléfono de emergencia"
            value={record?.telefono_emergencia}
          />

        </div>


        {/* AVISO */}
        <div
          className="
            mt-5
            rounded-2xl
            border border-[#d9eaf7]
            bg-[#eef7fd]
            p-4
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              w-9 h-9
              rounded-xl
              bg-white
              text-[#164e87]
              flex items-center justify-center
              flex-shrink-0
            "
          >
            <HeartPulse size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#164e87]">
              Información importante
            </p>

            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Mantén actualizados los datos médicos del empleado para
              contar con información disponible en caso de emergencia.
            </p>
          </div>
        </div>

      </div>


      {/* RESÚMENES */}
      <div className="space-y-3">

        <HealthSummaryCard
          icon={<CalendarDays size={21} />}
          title="Citas médicas"
          subtitle="Historial de citas registradas"
          count={counts.citas}
          button="Ver citas"
          onClick={() => onNavigate('citas')}
        />

        <HealthSummaryCard
          icon={<ClipboardList size={21} />}
          title="Incapacidades"
          subtitle="Historial de incapacidades"
          count={counts.incapacidades}
          button="Ver incapacidades"
          onClick={() => onNavigate('incapacidades')}
        />

        <HealthSummaryCard
          icon={<Activity size={21} />}
          title="Registro de presión"
          subtitle="Historial de tomas de presión"
          count={counts.presiones}
          button="Ver presiones"
          onClick={() => onNavigate('presiones')}
        />

      </div>

    </div>
  )
}

function MedicalInfoCard({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#e1edf6]
        bg-gradient-to-br
        from-white
        to-[#f7fbff]
        p-4
        min-h-[92px]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-sm
      "
    >
      <p className="text-xs text-slate-400 font-medium mb-2">
        {label}
      </p>

      <p className="text-[15px] font-semibold text-[#082b59]">
        {value || 'Sin información'}
      </p>
    </div>
  )
}

function RecordPanel({ config, record, onEdit, onHistory }) {
  return (
    <div className="space-y-6">

      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-1">
            Seguimiento
          </p>

          <h2 className="font-['Cooper'] text-2xl md:text-3xl text-[#082b59]">
            {config.historyTitle.replace('Historial de ', '')}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Último registro del empleado
          </p>
        </div>

        <button
          type="button"
          onClick={onHistory}
          className="
            border border-[#b8d6ee]
            text-[#164e87]
            hover:bg-[#EAF4FC]
            px-5 py-2.5
            rounded-xl
            text-sm
            font-medium
            transition-all
            w-full md:w-auto
          "
        >
          {config.viewButton}
        </button>

      </div>

      {/* ÚLTIMO REGISTRO */}
      {record ? (
        <div
          className="
            rounded-3xl
            border border-[#e1edf6]
            bg-white
            p-5 md:p-6
          "
        >
          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-11 h-11
                rounded-2xl
                bg-[#EAF4FC]
                text-[#164e87]
                flex items-center justify-center
              "
            >
              <ClipboardList size={21} />
            </div>

            <div>
              <p className="font-semibold text-[#082b59]">
                Último registro
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Información más reciente
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {config.display.map((item) => (
              <MedicalInfoCard
                key={item.key}
                label={item.label.replace(':', '')}
                value={formatValue(record[item.key])}
              />
            ))}

          </div>

          <div className="flex justify-end mt-5">

            <button
              type="button"
              onClick={onEdit}
              className="
                border border-[#b8d6ee]
                text-[#164e87]
                hover:bg-[#EAF4FC]
                px-5 py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                w-full sm:w-auto
              "
            >
              Editar registro
            </button>

          </div>
        </div>
      ) : (

        <div
          className="
            rounded-3xl
            border border-dashed border-[#cbddeb]
            bg-[#f8fbfe]
            py-14 px-6
            text-center
          "
        >
          <div
            className="
              w-12 h-12
              mx-auto
              rounded-2xl
              bg-[#EAF4FC]
              text-[#164e87]
              flex items-center justify-center
              mb-4
            "
          >
            <ClipboardList size={22} />
          </div>

          <p className="font-semibold text-[#082b59]">
            Sin registros
          </p>

          <p className="text-sm text-slate-400 mt-1">
            {config.emptyText}
          </p>

          <button
            type="button"
            onClick={onEdit}
            className="
              mt-5
              bg-[#082b59]
              hover:bg-[#164e87]
              text-white
              px-5 py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
            "
          >
            + Registrar
          </button>

        </div>

      )}

    </div>
  )
}
function HealthSummaryCard({
  icon,
  title,
  subtitle,
  count,
  button,
  onClick
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#e1edf6]
        bg-white
        p-4
        flex
        items-center
        gap-3
        min-h-[112px]
      "
    >
      <div
        className="
          w-11 h-11
          rounded-full
          bg-[#EAF4FC]
          text-[#164e87]
          flex items-center justify-center
          flex-shrink-0
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#082b59]">
          {title}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div
        className="
          w-9 h-9
          rounded-full
          bg-[#EAF4FC]
          text-[#164e87]
          flex items-center justify-center
          text-sm
          font-bold
          flex-shrink-0
        "
      >
        {count || 0}
      </div>

      <button
        type="button"
        onClick={onClick}
        className="
          border border-[#b8d6ee]
          text-[#164e87]
          hover:bg-[#EAF4FC]
          px-3 py-2
          rounded-xl
          text-xs
          font-medium
          transition-all
          whitespace-nowrap
        "
      >
        {button}
      </button>
    </div>
  )
}

function InfoRows({ rows }) {
  return (
    <div className="space-y-4 text-[14px] leading-tight">
      {rows.map((row) => (
        <p key={row.label} className="text-[#00578b]">
          <span className="font-bold">
            {row.label}
          </span>{' '}
          <span className="text-slate-500">
            {formatValue(row.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

function GrayButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full sm:w-auto
        min-w-[100px]
        border border-[#b8d6ee]
        text-[#164e87]
        hover:bg-[#EAF4FC]
        px-5 py-2.5
        rounded-xl
        text-sm
        font-medium
        transition-all
      "
    >
      {children}
    </button>
  )
}

function TextField({ label, value, onChange, readOnly, disabled }) {
  return (
    <label>
      <span className="block text-[15px] text-slate-500 mb-2">
        {label}
      </span>

      <input
        type="text"
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="border border-slate-300 rounded-2xl px-5 py-4 w-full text-[15px] outline-none focus:ring-2 focus:ring-[#BFE0FF] read-only:bg-slate-100 read-only:text-slate-500 disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  )
}

function RecordField({ field, value, onChange }) {
  const baseClass = 'border border-slate-300 rounded-2xl px-5 py-4 w-full text-[15px] outline-none focus:ring-2 focus:ring-[#BFE0FF]'

  return (
    <label className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
      <span className="block text-[15px] text-slate-500 mb-2">
        {field.label}
      </span>

      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${baseClass} min-h-28 resize-none`}
          placeholder={field.placeholder || field.label}
        />
      ) : (
        <input
          type={field.type || 'text'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={baseClass}
          placeholder={field.placeholder || field.label}
        />
      )}
    </label>
  )
}
