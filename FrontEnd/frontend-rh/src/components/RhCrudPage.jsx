import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ConfirmModal from './ConfirmModal'
import FeedbackToast from './FeedbackToast'
import RhModal from './RhModal'

const API_URL = 'http://localhost:3000'

function emptyForm(fields) {
  return fields.reduce((form, field) => ({
    ...form,
    [field.name]: field.defaultValue || ''
  }), {})
}

function getTokenHeaders() {
  return {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

function getNestedValue(item, path) {
  return path.split('.').reduce((value, key) => value?.[key], item)
}

export default function RhCrudPage({
  title,
  subtitle,
  endpoint,
  empleados,
  fields,
  columns,
  filter,
  searchPlaceholder,
  badgeConfig,
  formTitle,
  deleteTitle,
  deleteLabel,
  mapBeforeSave = (form) => form,
  normalizeItem = (item) => item
}) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm(fields))
  const [editingItem, setEditingItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterValue, setFilterValue] = useState('Todos')
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState('')

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type })

    setTimeout(() => {
      setFeedback(null)
    }, 2200)
  }, [])

  const loadItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: getTokenHeaders()
      })

      setItems(response.data)
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudo cargar la información', 'error')
    }
  }, [endpoint, showFeedback])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const openCreateModal = () => {
    setError('')
    setEditingItem(null)
    setForm(emptyForm(fields))
    setShowFormModal(true)
  }

  const openEditModal = (item) => {
    setError('')
    const normalized = normalizeItem(item)
    setEditingItem(item)
    setForm({
      ...emptyForm(fields),
      ...normalized
    })
    setShowFormModal(true)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
    setError('')
  }

  const validateForm = () => {
    const missingField = fields.find((field) => field.required && !String(form[field.name] || '').trim())

    if (missingField) {
      setError(`${missingField.label} es obligatorio`)
      return false
    }

    return true
  }

  const saveItem = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const payload = mapBeforeSave(form)

      if (editingItem) {
        await axios.put(`${API_URL}${endpoint}/${editingItem.id}`, payload, {
          headers: getTokenHeaders()
        })

        showFeedback(`${deleteLabel} actualizado correctamente`)
      } else {
        await axios.post(`${API_URL}${endpoint}`, payload, {
          headers: getTokenHeaders()
        })

        showFeedback(`${deleteLabel} registrado correctamente`)
      }

      await loadItems()
      closeFormModal()
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || 'No se pudo guardar el registro')
    }
  }

  const deleteItem = async () => {
    try {
      await axios.delete(`${API_URL}${endpoint}/${itemToDelete.id}`, {
        headers: getTokenHeaders()
      })

      setItems(items.filter((item) => item.id !== itemToDelete.id))
      setItemToDelete(null)
      showFeedback(`${deleteLabel} eliminado correctamente`)
    } catch (requestError) {
      console.error(requestError)
      showFeedback('No se pudo eliminar el registro', 'error')
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const employeeName = item.Empleado?.nombre || item.empleado?.nombre || ''
      const matchesSearch = employeeName.toLowerCase().includes(search.toLowerCase())
      const currentFilterValue = filter ? getNestedValue(item, filter.field) : ''
      const matchesFilter = !filter || filterValue === 'Todos' || currentFilterValue === filterValue

      return matchesSearch && matchesFilter
    })
  }, [items, search, filter, filterValue])

  const renderBadge = (value) => {
    const config = badgeConfig?.[value] || {
      label: value,
      className: 'bg-slate-100 text-slate-600'
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const renderField = (field) => {
    const baseClass = 'border border-slate-300 rounded-2xl px-5 py-4 w-full outline-none focus:ring-2 focus:ring-[#BFE0FF] bg-white'

    if (field.type === 'select') {
      const options = field.options === 'empleados'
        ? empleados.map((empleado) => ({
          value: empleado.id,
          label: empleado.nombre
        }))
        : field.options

      return (
        <select
          value={form[field.name]}
          onChange={(event) => setForm({
            ...form,
            [field.name]: event.target.value
          })}
          className={baseClass}
        >
          <option value="">Seleccionar</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={form[field.name]}
          onChange={(event) => setForm({
            ...form,
            [field.name]: event.target.value
          })}
          className={`${baseClass} min-h-28 resize-none`}
          placeholder={field.placeholder || field.label}
        />
      )
    }

    return (
      <input
        type={field.type || 'text'}
        value={form[field.name]}
        onChange={(event) => setForm({
          ...form,
          [field.name]: event.target.value
        })}
        className={baseClass}
        placeholder={field.placeholder || field.label}
      />
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium text-[#001b70] font-['Cooper']">
            {title}
          </h1>

          <p className="text-slate-500 mt-2">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#0b2447] hover:bg-[#16325c] text-white px-5 py-3 rounded-xl transition-all shadow-md hover:-translate-y-1 w-full sm:w-auto"
        >
          + Nuevo registro
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-7">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border border-slate-200 bg-[#f8fbff] rounded-2xl px-5 py-3 w-full md:max-w-sm outline-none focus:ring-2 focus:ring-[#BFE0FF]"
          />

          {filter && (
            <select
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="border border-slate-200 bg-[#f8fbff] rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#BFE0FF]"
            >
              <option value="Todos">Todos</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {columns.map((column) => (
                  <th key={column.key} className="text-left pb-4 whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
                <th className="text-left pb-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                >
                  {columns.map((column) => {
                    const value = column.render
                      ? column.render(item)
                      : getNestedValue(item, column.key)

                    return (
                      <td key={column.key} className="py-5 text-slate-600 min-w-36">
                        {column.badge ? renderBadge(value) : value}
                      </td>
                    )
                  })}

                  <td className="py-5">
                    <div className="flex gap-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="bg-[#07355E] hover:bg-[#1B2A38] hover:-translate-y-1 shadow-md text-white px-4 py-2 rounded-xl transition-all duration-300"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="bg-red-500 hover:bg-red-600 hover:-translate-y-1 shadow-md text-white px-4 py-2 rounded-xl transition-all duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    No hay registros para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFormModal && (
        <RhModal
          title={editingItem ? `Editar ${formTitle}` : `Registrar ${formTitle}`}
          onClose={closeFormModal}
          footer={(
            <button
              type="button"
              onClick={saveItem}
              className="w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              Guardar
            </button>
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <label
                key={field.name}
                className={field.full ? 'md:col-span-2' : ''}
              >
                <span className="block text-sm text-slate-500 mb-2">
                  {field.label}
                </span>
                {renderField(field)}
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

      {itemToDelete && (
        <ConfirmModal
          title={deleteTitle}
          message="Deseas eliminar"
          highlight={itemToDelete.Empleado?.nombre || itemToDelete.empleado?.nombre || itemToDelete.tipo || itemToDelete.id}
          onConfirm={deleteItem}
          onCancel={() => setItemToDelete(null)}
        />
      )}

      <FeedbackToast message={feedback?.message} type={feedback?.type} />
    </div>
  )
}
