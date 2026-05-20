import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Activity,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Plus,
  Trash2
} from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'
import FeedbackToast from '../components/FeedbackToast'
import RhModal from '../components/RhModal'

const API_URL = 'http://localhost:3000'

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

export default function Salud({ empleados = [] }) {
  const [activeTab, setActiveTab] = useState('salud')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [filterValue, setFilterValue] = useState('Todos')
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

  useEffect(() => {
    if (!selectedEmployeeId && empleados.length > 0) {
      setSelectedEmployeeId(empleados[0].id)
      setEmployeeSearch(empleados[0].nombre)
    }
  }, [empleados, selectedEmployeeId])

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
    const text = employeeSearch.toLowerCase()

    return empleados
      .filter((empleado) => empleado.nombre.toLowerCase().includes(text))
      .slice(0, 6)
  }, [empleados, employeeSearch])

  const activeRecordConfig = recordConfig[activeTab]
  const activeRecordList = activeTab === 'salud' ? [] : employeeRecords[activeTab]
  const latestRecord = activeRecordList[0]

  const selectEmployee = (empleado) => {
    setSelectedEmployeeId(empleado.id)
    setEmployeeSearch(empleado.nombre)
    setShowEmployeeList(false)
  }

  const openSaludModal = () => {
    setError('')
    setEditingSalud(currentSalud || null)
    setSaludForm({
      ...emptySalud,
      ...(currentSalud || {})
    })
    setShowSaludModal(true)
  }

  const openCreateRecordModal = () => {
    if (activeTab === 'salud') {
      openSaludModal()
      return
    }

    setError('')
    setEditingRecord(null)
    setRecordForm(emptyForms[activeTab])
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
    <div className="p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          

          <p className="text-slate-500 mt-2">
            Seguimiento a estado de salud de empleados, citas, incapacidades y monitoreo de presión
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateRecordModal}
          className="inline-flex items-center justify-center gap-2 bg-[#0b2447] hover:bg-[#16325c] text-white px-5 py-3 rounded-xl transition-all shadow-md hover:-translate-y-1"
        >
          <Plus size={17} />
          Nuevo registro
        </button>
      </div>

      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-7">
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              placeholder="Buscar por empleado"
              value={employeeSearch}
              onFocus={() => setShowEmployeeList(true)}
              onChange={(event) => {
                setEmployeeSearch(event.target.value)
                setShowEmployeeList(true)
              }}
              className="border border-slate-200 bg-[#f8fbff] rounded-2xl px-5 py-3 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF]"
            />

            {showEmployeeList && filteredEmployees.length > 0 && (
              <div className="absolute left-0 right-0 top-[54px] bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-20">
                {filteredEmployees.map((empleado) => (
                  <button
                    type="button"
                    key={empleado.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectEmployee(empleado)}
                    className="w-full text-left px-5 py-3 hover:bg-[#f8fbff] text-[#07355E] transition-all"
                  >
                    {empleado.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="border border-slate-200 bg-[#f8fbff] rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#BFE0FF]"
          >
            <option value="Todos">Todos</option>
            <option value="Con registros">Con registros</option>
            <option value="Sin registros">Sin registros</option>
          </select>
        </div>

        <div className="w-full max-w-[690px] mx-auto pt-1">
          <div className="flex items-end gap-1">
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
                  className={`w-[118px] h-[92px] rounded-t-[14px] flex flex-col items-center justify-center gap-1 border border-[#00598f] transition-all ${
                    active
                      ? 'bg-[#cff4fb] text-[#00578b] shadow-sm'
                      : 'bg-[#00578b] text-white hover:bg-[#064b7a]'
                  }`}
                >
                  <Icon size={34} strokeWidth={1.8} />
                  <span className="text-[12px] leading-tight font-bold underline underline-offset-2">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="min-h-[230px] border-[7px] border-[#cff4fb] rounded-b-[14px] rounded-tr-[14px] bg-white p-5 md:p-7 relative shadow-sm">
            {activeTab === 'salud' ? (
              <SaludPanel
                empleado={selectedEmployee}
                record={currentSalud}
                onEdit={openSaludModal}
              />
            ) : (
              <RecordPanel
                config={activeRecordConfig}
                record={latestRecord}
                onEdit={() => openEditRecordModal(latestRecord)}
                onHistory={() => setShowHistoryModal(true)}
              />
            )}
          </div>
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
            <TextField label="Nombre" value={selectedEmployee?.nombre || ''} disabled />
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
                className="border border-slate-300 rounded-2xl px-5 py-4 w-full min-h-28 resize-none outline-none focus:ring-2 focus:ring-[#BFE0FF]"
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
                    className="bg-[#8b8e93] hover:bg-[#74777c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecordToDelete({
                      tab: activeTab,
                      record
                    })}
                    className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all"
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

function SaludPanel({ empleado, record, onEdit }) {
  const rows = [
    { label: 'Nombre:', value: empleado?.nombre || record?.Empleado?.nombre || '' },
    { label: 'NSS:', value: record?.nss || empleado?.nss || '' },
    { label: 'Clínica:', value: record?.clinica },
    { label: 'Padecimientos:', value: record?.padecimientos || 'Ninguno' },
    { label: 'Tipo de Sangre:', value: record?.tipo_sangre },
    { label: 'Contacto de Emergencia:', value: record?.contacto_emergencia },
    { label: 'Teléfono de Emergencia:', value: record?.telefono_emergencia }
  ]

  return (
    <div className="h-full pb-10">
      <InfoRows rows={rows} />

      <div className="absolute bottom-3 right-4">
        <GrayButton onClick={onEdit}>
          Editar
        </GrayButton>
      </div>
    </div>
  )
}

function RecordPanel({ config, record, onEdit, onHistory }) {
  return (
    <div className="h-full pb-10">
      <InfoRows rows={config.display.map((item) => ({
        label: item.label,
        value: formatValue(record?.[item.key])
      }))} />

      <div className="absolute bottom-3 right-4 flex gap-2">
        <GrayButton onClick={onEdit}>
          Editar
        </GrayButton>

        <GrayButton onClick={onHistory}>
          {config.viewButton}
        </GrayButton>
      </div>
    </div>
  )
}

function InfoRows({ rows }) {
  return (
    <div className="space-y-4 text-[13px] leading-tight">
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
      className="min-w-[90px] bg-[#8b8e93] hover:bg-[#74777c] text-white px-4 py-2 rounded-lg text-[13px] leading-tight font-bold transition-all"
    >
      {children}
    </button>
  )
}

function TextField({ label, value, onChange, disabled }) {
  return (
    <label>
      <span className="block text-sm text-slate-500 mb-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="border border-slate-300 rounded-2xl px-5 py-4 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF] disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  )
}

function RecordField({ field, value, onChange }) {
  const baseClass = 'border border-slate-300 rounded-2xl px-5 py-4 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF]'

  return (
    <label className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
      <span className="block text-sm text-slate-500 mb-2">
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
