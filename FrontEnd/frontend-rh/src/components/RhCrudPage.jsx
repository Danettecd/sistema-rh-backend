import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ConfirmModal from './ConfirmModal'
import FeedbackToast from './FeedbackToast'
import RhModal from './RhModal'
import { API_URL } from '../config/api'

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

function formatDisplayName(name = '') {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
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
  summary,
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
  const summaryData = useMemo(() => {
    if (!summary) return []

    return summary.items.map((summaryItem) => ({
      ...summaryItem,
      count: items.filter(
        (item) =>
          getNestedValue(item, summary.field) === summaryItem.value
      ).length
    }))
  }, [items, summary])

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

      {/* ENCABEZADO */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

        <div>

          <p className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2">
            GESTIÓN
          </p>

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
          className="
          bg-[#0b2447]
          hover:bg-[#16325c]
          hover:-translate-y-0.5
          text-white
          px-5 py-3
          rounded-2xl
          transition-all
          duration-200
          shadow-sm
          w-full sm:w-auto
          font-medium
        "
        >
          + Nuevo registro
        </button>

      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100">

        {/* BUSCADOR Y FILTRO */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-7">

          <div className="w-full md:max-w-md">

            <p className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold mb-2">
              Buscar
            </p>

            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="
              border border-slate-200
              bg-[#f8fbff]
              rounded-2xl
              px-5 py-3
              w-full
              outline-none
              focus:ring-2
              focus:ring-[#BFE0FF]
              focus:border-[#a9cbea]
              transition-all
            "
            />

          </div>

          {filter && (

            <div className="w-full md:w-auto">

              <p className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold mb-2">
                Filtrar
              </p>

              <select
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="
                border border-slate-200
                bg-[#f8fbff]
                rounded-2xl
                px-5 py-3
                outline-none
                focus:ring-2
                focus:ring-[#BFE0FF]
                focus:border-[#a9cbea]
                transition-all
                w-full md:min-w-[180px]
              "
              >
                <option value="Todos">
                  Todos
                </option>

                {filter.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}

              </select>

            </div>

          )}

      </div>

      {/* RESUMEN */}
      {summary && (
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
            mb-7
            pb-6
            border-b border-slate-100
          "
        >
          <div
            className="
              px-4 py-2.5
              rounded-xl
              bg-[#f8fbfe]
              border border-slate-100
              text-sm
            "
          >
            <span className="font-bold text-[#082b59]">
              {items.length}
            </span>

            <span className="text-slate-400 ml-2">
              registros
            </span>
          </div>

          {summaryData.map((summaryItem) => (
            <div
              key={summaryItem.value}
              className="
                px-4 py-2.5
                rounded-xl
                bg-white
                border border-slate-100
                text-sm
                flex items-center
                gap-2
              "
            >
              <span
                className={`
                  w-2.5 h-2.5
                  rounded-full
                  ${summaryItem.dotClass}
                `}
              />

              <span className="font-bold text-[#082b59]">
                {summaryItem.count}
              </span>

              <span className="text-slate-400">
                {summaryItem.label}
              </span>
            </div>
          ))}
        </div>
      )}

        {/* TABLA */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px]">

            <thead>

              <tr className="border-b border-slate-200">

                {columns.map((column) => (

                  <th
                    key={column.key}
                    className="
                    text-left
                    pb-4
                    whitespace-nowrap
                    text-xs
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                    font-semibold
                  "
                  >
                    {column.label}
                  </th>

                ))}

                <th
                  className="
                  text-left
                  pb-4
                  text-xs
                  uppercase
                  tracking-[0.14em]
                  text-slate-400
                  font-semibold
                "
                >
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredItems.map((item) => (

                <tr
                  key={item.id}
                  className="
                  border-b border-slate-100
                  last:border-b-0
                  hover:bg-[#f8fbfe]
                  transition-all
                "
                >

                  {columns.map((column) => {

                    const value = column.render
                      ? column.render(item)
                      : getNestedValue(item, column.key)

                    return (

                      <td
                        key={column.key}
                        className="py-5 text-slate-600 min-w-36 text-sm"
                      >
                        {column.badge
                          ? renderBadge(value)
                          : value
                        }
                      </td>

                    )

                  })}

                  {/* ACCIONES */}
                  <td className="py-5">

                    <div className="flex gap-2 whitespace-nowrap">

                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
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
                        onClick={() => setItemToDelete(item)}
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

              ))}

              {filteredItems.length === 0 && (

                <tr>

                  <td
                    colSpan={columns.length + 1}
                    className="py-14 text-center"
                  >

                    <div className="text-slate-400">

                      <p className="font-medium text-slate-500 mb-1">
                        No hay registros
                      </p>

                      <p className="text-sm">
                        No hay información para mostrar con los filtros actuales
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL CREAR / EDITAR */}
      {showFormModal && (

        <RhModal
          title={
            editingItem
              ? `Editar ${formTitle}`
              : `Registrar ${formTitle}`
          }
          onClose={closeFormModal}
          footer={(

            <button
              type="button"
              onClick={saveItem}
              className="
              w-full
              bg-[#0b2447]
              hover:bg-[#16325c]
              text-white
              px-8 py-4
              rounded-2xl
              transition-all
              shadow-sm
              font-medium
            "
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

                <span className="block text-sm text-slate-500 mb-2 font-medium">
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

      {/* MODAL ELIMINAR */}
      {itemToDelete && (

        <ConfirmModal
          title={deleteTitle}
          message="Deseas eliminar"
          highlight={
            itemToDelete.Empleado?.nombre ||
            itemToDelete.empleado?.nombre ||
            itemToDelete.tipo ||
            itemToDelete.id
          }
          onConfirm={deleteItem}
          onCancel={() => setItemToDelete(null)}
        />

      )}

      <FeedbackToast
        message={feedback?.message}
        type={feedback?.type}
      />

    </div>

  )
}
