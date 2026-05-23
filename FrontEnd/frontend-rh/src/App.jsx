import DashboardCard from './components/DashboardCard'
import Empleados from './pages/Empleados';
import Asistencia from './pages/Asistencia'
import Incidencias from './pages/Incidencias'
import Uniformes from './pages/Uniformes'
import Vehiculos from './pages/Vehiculos'
import Salud from './pages/Salud'
import FeedbackToast from './components/FeedbackToast'
import { API_URL } from './config/api'


import adminFoto from './assets/fotos/danettecd.jpg'
import { useState, useEffect } from 'react'
import axios from 'axios'

import {
  FaUsers,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaTshirt,
  FaTruck,
  FaHeartbeat,
  FaChartPie,
  FaBell,
  FaBars,
  FaBirthdayCake,
  FaClipboardCheck
} from 'react-icons/fa'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

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

function EmpleadoAvatarPlaceholder({ nombre, className = '' }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d8efff] via-white to-[#bfe0ff] text-[#07355E] font-bold ${className}`}>
      {getEmpleadoIniciales(nombre)}
    </div>
  )
}

function EmpleadoFoto({ foto, nombre, className = '' }) {
  const [hasError, setHasError] = useState(false)
  const fotoUrl = getEmpleadoFotoUrl(foto)

  if (!fotoUrl || hasError) {
    return <EmpleadoAvatarPlaceholder nombre={nombre} className={className} />
  }

  return (
    <img
      src={fotoUrl}
      alt={nombre || 'Empleado'}
      className={`h-full w-full rounded-full object-cover ${className}`}
      onError={(e) => {
        console.log('No cargó foto:', getEmpleadoFotoUrl(foto))
        e.currentTarget.style.display = 'none'
        setHasError(true)
      }}
    />
  )
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

function buildEmpleadoFormData(empleado) {
  const formData = new FormData()

  ;[
    'nombre',
    'puesto',
    'telefono',
    'direccion',
    'email',
    'rfc',
    'curp',
    'nss'
  ].forEach((field) => {
    formData.append(field, empleado[field] || '')
  })

  ;['fechaIngreso', 'fechaNacimiento'].forEach((field) => {
    const fecha = getFechaInputValue(empleado[field])

    if (isFechaValida(fecha)) {
      formData.append(field, fecha)
    }
  })

  if (empleado.fotoFile) {
    formData.append('foto', empleado.fotoFile)
  }

  return formData
}

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [empleados, setEmpleados] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [incidencias, setIncidencias] = useState([])
  const [asistencias, setAsistencias] = useState([])

  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    puesto: '',
    telefono: '',
    direccion: '',
    email: '',
    rfc: '',
    curp: '',
    nss: '',
    fechaIngreso: '',
    fechaNacimiento: '',
    foto: '',
    fotoFile: null
  })

      const coloresBarras = [
      '#93C5FD',
      '#C4B5FD',
      '#86EFAC',
      '#FDE68A',
      '#FCA5A5',
      '#67E8F9',
      '#FDBA74',
      '#A5B4FC',
      '#F9A8D4',
      '#5EEAD4'
    ]
    
  const empleadosPorPuesto = empleados.reduce((acc, empleado) => {
    const puesto = empleado.puesto || "Sin puesto";

    const existente = acc.find(item => item.puesto === puesto);

    if (existente) {
      existente.total += 1;
    } else {
      acc.push({
        puesto,
        total: 1,
      });
    }

    return acc;
  }, []);


  useEffect(() => {

    const token = localStorage.getItem('token')

    if (token) {
      setIsLogged(true)
    }

  }, [])

  useEffect(() => {

    if (isLogged) {
      obtenerEmpleados()
      obtenerVehiculos()
      obtenerIncidencias()
      obtenerAsistencias()
    }

  }, [isLogged])

  const handleLogin = async () => {

    try {

      setError('')
      const response = await axios.post(
        `${API_URL}/api/login`,
        {
          email,
          password
        }
      )

      localStorage.setItem(
        'token',
        response.data.token
      )

      setIsLogged(true)

    } catch (error) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        'Error al iniciar sesión'
      )

    }

  }

  const obtenerEmpleados = async () => {

    try {

      const token = localStorage.getItem('token')

      console.log('TOKEN:', token)

      const response = await axios.get(
        `${API_URL}/empleados`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )

      setEmpleados(response.data)

      console.log(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  const obtenerVehiculos = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await axios.get(
        `${API_URL}/vehiculos`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )

      setVehiculos(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  const obtenerIncidencias = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await axios.get(
        `${API_URL}/incidencias`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )

      setIncidencias(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  const obtenerAsistencias = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await axios.get(
        `${API_URL}/asistencia`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )

      console.log(response.data)

      setAsistencias(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  const crearEmpleado = async () => {
    console.log('CLICK CREAR EMPLEADO')
    try {

      const token = localStorage.getItem('token')

      await axios.post(
        `${API_URL}/empleados`,
        buildEmpleadoFormData(nuevoEmpleado),
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )

      obtenerEmpleados()

      setShowEmpleadoModal(false)
      showFeedback('Empleado registrado correctamente')

      setNuevoEmpleado({
        nombre: '',
        puesto: '',
        telefono: '',
        direccion: '',
        email: '',
        rfc: '',
        curp: '',
        nss: '',
        fechaIngreso: '',
        fechaNacimiento: '',
        foto: '',
        fotoFile: null
      })

    } catch (error) {

      console.error(error.response?.data || error)

    }

  }

  const editarEmpleado = async (id, empleadoEditado) => {

    try {

      const token = localStorage.getItem('token')

      await axios.put(
        `${API_URL}/empleados/${id}`,
        buildEmpleadoFormData(empleadoEditado),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      obtenerEmpleados()
      showFeedback('Empleado actualizado correctamente')

    } catch (error) {
      console.log(error)
      showFeedback('Error al actualizar empleado', 'error')
    }
  }

  const eliminarEmpleado = async () => {

    try {

      const token = localStorage.getItem('token')

      await axios.delete(
        `${API_URL}/empleados/${empleadoAEliminar.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setEmpleados(
        empleados.filter(
          empleado => empleado.id !== empleadoAEliminar.id
        )
      )

      setShowDeleteModal(false)

      setEmpleadoAEliminar(null)

      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)

    } catch (error) {

      console.log(error)

      showFeedback('Error al eliminar empleado', 'error')

    }

  }
  const showFeedback = (message, type = 'success') => {

    setFeedback({
      message,
      type
    })

    setTimeout(() => {
      setFeedback(null)
    }, 2200)

  }
  const logout = () => {

    localStorage.removeItem('token')

    setIsLogged(false)

  }

  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <FaChartPie />
    },
    {
      key: 'empleados',
      title: 'Empleados',
      icon: <FaUsers />
    },
    {
      key: 'asistencia',
      title: 'Asistencia',
      icon: <FaCalendarCheck />
    },
    {
      key: 'incidencias',
      title: 'Incidencias',
      icon: <FaExclamationTriangle />
    },
    {
      key: 'uniformes',
      title: 'Uniformes',
      icon: <FaTshirt />
    },
    {
      key: 'vehiculos',
      title: 'Vehículos',
      icon: <FaTruck />
    },
    {
      key: 'salud',
      title: 'Salud',
      icon: <FaHeartbeat />
    }
  ]

  const activeTitle = menuItems.find(
    item => item.key === activeSection
  )?.title || 'Dashboard'

  const currentMonth = new Date().getMonth()

  const birthdays = empleados.filter((empleado) => {

    if (!empleado.fechaNacimiento) {
      return false
    }

    const birthMonth = new Date(
      empleado.fechaNacimiento
    ).getMonth()

    return birthMonth === currentMonth

  })

  const totalFaltas = asistencias.filter(
    (asistencia) =>
      asistencia.type?.toLowerCase().trim() === 'falta'
  ).length

  if (isLogged) {

    const puestosData = [
      {
        puesto: 'Ing. Civil',
        empleados: 8
      },
      {
        puesto: 'Supervisor',
        empleados: 5
      },
      {
        puesto: 'RH',
        empleados: 2
      },
      {
        puesto: 'Eléctrico',
        empleados: 6
      }
    ]

    const COLORS = [
      '#93C5FD',
      '#fdee6c',
      '#fcb94d',
      '#83fbaf'
    ]

    const incidenciasData = [
      {
        name: 'Retardos',
        value: 10
      },
      {
        name: 'Faltas',
        value: 4
      },
      {
        name: 'Permisos',
        value: 2
      },
      {
        name: 'Accidentes',
        value: 1
      }
    ]

    return (
      <div className="min-h-screen bg-[#f4f7fb] flex flex-col lg:flex-row overflow-x-hidden">

        <header className="lg:hidden sticky top-0 z-30 bg-[#071a36] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <h1 className="text-2xl font-bold font-['Cooper']">
            SIGPA
          </h1>

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="text-3xl leading-none"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </header>

        {menuAbierto && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMenuAbierto(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#081225] to-[#102544] text-white z-50 transform transition-transform duration-300 lg:hidden ${
            menuAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h1 className="text-3xl font-bold font-['Cooper']">
              SIGPA
            </h1>

            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              className="text-3xl leading-none"
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setActiveSection(item.key)
                  setMenuAbierto(false)
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent ${
                  activeSection === item.key
                    ? 'bg-[#BFE0FF] text-[#0b2447] shadow-sm'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <span className="text-lg mr-3">
                  {item.icon}
                </span>

                <span className="text-lg">
                  {item.title}
                </span>
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <button
              className="w-full bg-[#07355E] hover:bg-[#1B2A38] text-white py-3 px-5 rounded-2xl cursor-pointer transition-all duration-300 font-semibold shadow-md"
              onClick={() => {
                setMenuAbierto(false)
                logout()
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* SIDEBAR */}
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'lg:w-[250px]' : 'lg:w-[18px] lg:overflow-x-hidden'} hidden lg:flex lg:min-h-screen relative bg-gradient-to-b from-[#081225] to-[#102544] text-white flex-col justify-between py-8 px-6 transition-all duration-300 whitespace-nowrap`}>

          <button
            onClick={() => setSidebarOpen(false)}
            className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full text-slate-700"
          >
            &lt;
          </button>

          <div>

            <h1 className={`${!sidebarOpen && 'lg:opacity-0'} text-4xl lg:text-5xl font-semibold text-white font-['Cooper'] mb-5 lg:mb-14 tracking-tight transition-all duration-200`}>

              SIGPA
            </h1>
            <div className="w-full">
              <nav className={`${!sidebarOpen && 'lg:opacity-0'} block space-y-3 transition-all duration-200`}>

                {menuItems.map((item) => (

                  <button
                    key={item.title}

                    onClick={() => setActiveSection(item.key)}

                    className={`w-full flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all border border-transparent

  ${activeSection === item.key
                        ? 'bg-[#BFE0FF] text-[#0b2447] shadow-sm'
                        : 'hover:bg-white/10 text-white'
                      }`}
                  >

                    <span className="text-lg mr-3">
                      {item.icon}
                    </span>

                    <span className="text-lg">
                      {item.title}
                    </span>

                  </button>

                ))}

              </nav>
            </div>
          </div>

          <button
            className="mt-4 lg:mt-0 bg-[#07355E] hover:bg-[#1B2A38] text-white py-3 px-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 font-semibold shadow-md"
            onClick={logout}
          >
            Cerrar sesión
          </button>

        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">

          {/* TOPBAR */}
          <header className="bg-white min-h-20 lg:h-24 hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-6 lg:px-10 py-4 border-b border-slate-200">

            <div className="flex items-center gap-6">

              {!sidebarOpen && (
                <FaBars
                  onClick={() => setSidebarOpen(true)}
                  className="text-2xl text-slate-700 cursor-pointer"
                />
              )}

              <h2 className="text-2xl md:text-[30px] font-medium tracking-tight text-[#001b70] font-['Cooper']">
                {activeTitle}
              </h2>

            </div>

            <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-end">

              <div className="relative">
                <FaBell className="text-2xl text-slate-700" />

                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </div>
              </div>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full overflow-hidden">

                  <img
                    src={adminFoto}
                    alt="Administrador"
                    className="w-full h-full object-cover"
                  />

                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Danette Centeno
                  </p>

                  <p className="text-slate-500 text-sm">
                    Administrador
                  </p>
                </div>

              </div>

            </div>

          </header>

          {/* CONTENT */}
          {
            activeSection === 'dashboard' && (
              <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">

                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-8">

                  <DashboardCard
                    title="Empleados"
                    value={empleados.length}
                    icon={<FaUsers size={50} />}
                  />

                  <DashboardCard
                    title="Cumpleaños del mes"
                    value={birthdays.length}
                    icon={<FaBirthdayCake size={50} />}
                  />

                  <DashboardCard
                    title="Vehículos"
                    value={vehiculos.length}
                    icon={<FaTruck size={50} />}
                  />

                  <DashboardCard
                    title="Incidencias"
                    value={incidencias.length}
                    icon={<FaExclamationTriangle size={50} />}
                  />

                  <DashboardCard
                    title="Faltas"
                    value={totalFaltas}
                    icon={<FaClipboardCheck size={50} />}
                  />

                </div>

                {/* BIRTHDAYS */}
                <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm mb-8">


                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                    <h3
                      className="
      text-3xl
      md:text-5xl
      font-black
      bg-gradient-to-r
      from-pink-400
      via-yellow-400
      to-blue-400
      text-transparent
      bg-clip-text
      tracking-wide
    "
                    >
                      HAPPY BIRTHDAY
                    </h3>

                    <div className="text-4xl md:text-5xl">
                      🎂🎈
                    </div>

                  </div>
                  <div className="flex justify-center gap-6 flex-wrap">
                    {birthdays.map((person) => (

                      <div
                        key={person.nombre}
                        className="border border-slate-200 rounded-3xl p-6 flex flex-col items-center bg-[#f8fbff] w-full sm:w-[260px]"
                      >

                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                          <EmpleadoFoto
                            foto={person.foto}
                            nombre={person.nombre}
                          />

                        </div>

                        <h4 className="text-center font-medium text-slate-700 text-lg">
                          {person.nombre}
                        </h4>

                        <p className="text-sm text-slate-400 mt-1">
                          {new Date(person.fechaNacimiento + 'T00:00:00')
                            .toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: 'long'
                            })}
                        </p>

                      </div>

                    ))}
                  </div>

                </div>

                {/* BOTTOM */}


                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">

                  <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm xl:col-span-2 min-w-0">

                    <h3 className="text-2xl font-medium text-slate-800 mb-6 font-['Cooper']">
                      Resumen de empleados por puesto
                    </h3>

                    <div className="w-full h-[300px] min-w-0">

                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={empleadosPorPuesto}
                        layout="vertical"
                        barSize={18}
                        margin={{
                          top: 20,
                          right: 40,
                          left: 40,
                          bottom: 20
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          type="number"
                          tick={{
                            fill: '#64748b'
                          }}
                        />

                        <YAxis
                          type="category"
                          dataKey="puesto"
                          width={140}
                          tick={{
                            fill: '#64748b',
                            fontSize: 15
                          }}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="total"
                          radius={[0, 10, 10, 0]}
                        >
                          {empleadosPorPuesto.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={coloresBarras[index % coloresBarras.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                      </ResponsiveContainer>

                    </div>

                  </div>

                  <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm min-w-0">

                    <h3 className="text-2xl font-medium text-slate-800 mb-6 font-['Cooper']">
                      Incidencias recientes
                    </h3>
                    {/*grafica de pastel*/}
                    <div className="w-full h-[300px] flex justify-center min-w-0">

                      <ResponsiveContainer width="100%" height="100%">
                      <PieChart>

                        <Pie
                          data={incidenciasData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius="75%"
                          label
                        >

                          {incidenciasData.map((entry, index) => (

                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />

                          ))}

                        </Pie>

                        <Tooltip />

                      </PieChart>
                      </ResponsiveContainer>

                    </div>
                    <div className="incidencias-legend">
                      {incidenciasData.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                          ></span>

                          <span className="legend-text">
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )
          }


          {
            activeSection === 'empleados' && (

              <Empleados
                empleados={empleados}
                setEmpleadoSeleccionado={setEmpleadoSeleccionado}
                setEmpleadoAEliminar={setEmpleadoAEliminar}
                setShowDeleteModal={setShowDeleteModal}
                setShowEmpleadoModal={setShowEmpleadoModal}
              />

            )
          }
          {
            activeSection === 'asistencia' && (
              <Asistencia empleados={empleados} />
            )
          }
          {
            activeSection === 'incidencias' && (
              <Incidencias empleados={empleados} />
            )
          }
          {
            activeSection === 'uniformes' && (
              <Uniformes empleados={empleados} />
            )
          }
          {
            activeSection === 'vehiculos' && (
              <Vehiculos
                vehiculos={vehiculos}
                setVehiculos={setVehiculos}
              />
            )
          }
          {
            activeSection === 'salud' && (
              <Salud empleados={empleados} />
            )
          }
          {
            showEmpleadoModal && (

              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                <div className="bg-white w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[28px] md:rounded-[35px] p-5 md:p-10 shadow-2xl">

                  <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl md:text-4xl font-medium text-[#001b70] font-['Cooper']">
                      Nuevo Empleado
                    </h2>

                    <button
                      onClick={() => setShowEmpleadoModal(false)}
                      className="text-3xl text-slate-400"
                    >
                      ×
                    </button>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    <div className="flex flex-col items-center mb-8">

                      <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4">
                        <EmpleadoFoto
                          foto={nuevoEmpleado.foto}
                          nombre={nuevoEmpleado.nombre}
                          className="text-3xl"
                        />

                      </div>

                      <input
                        type="file"
                        className="hidden"
                        id="foto"
                        accept="image/*"
                        onChange={(e) => {

                          const file = e.target.files[0]

                          if (file) {

                            const imageUrl = URL.createObjectURL(file)

                            setNuevoEmpleado({
                              ...nuevoEmpleado,
                              foto: imageUrl,
                              fotoFile: file
                            })

                          }

                        }}
                      />

                      <label
                        htmlFor="foto"
                        className="bg-[#07355E] hover:bg-[#1B2A38] text-white px-4 py-2 rounded-xl cursor-pointer transition-all"
                      >
                        Seleccionar foto
                      </label>

                    </div>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nuevoEmpleado.nombre}
                      onChange={(e) =>
                        setNuevoEmpleado({
                          ...nuevoEmpleado,
                          nombre: e.target.value
                        })
                      }
                      className="border border-slate-300 rounded-2xl px-5 py-4 w-full mb-4"
                    />

                    <input
                      type="text"
                      placeholder="Puesto"
                      value={nuevoEmpleado.puesto}
                      onChange={(e) =>
                        setNuevoEmpleado({
                          ...nuevoEmpleado,
                          puesto: e.target.value
                        })
                      }
                      className="border border-slate-300 rounded-2xl px-5 py-4 w-full mb-8"
                    />

                    <input
                      placeholder="Teléfono"
                      value={nuevoEmpleado.telefono}
                      onChange={(e) =>
                        setNuevoEmpleado({
                          ...nuevoEmpleado,
                          telefono: e.target.value
                        })
                      }
                      className="border border-slate-300 rounded-2xl px-5 py-4"
                    />

                    <input
                      placeholder="Correo"
                      value={nuevoEmpleado.email}
                      onChange={(e) =>
                        setNuevoEmpleado({
                          ...nuevoEmpleado,
                          email: e.target.value
                        })
                      }
                      className="border border-slate-300 rounded-2xl px-5 py-4"
                    />

                  </div>

                  <button
                    onClick={crearEmpleado}
                    className="mt-8 w-full bg-[#0b2447] hover:bg-[#16325c] text-white px-8 py-4 rounded-2xl transition-all"
                  >
                    Guardar empleado
                  </button>

                </div>

              </div>

            )
          }
          {
            empleadoSeleccionado && (

              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                <div className="bg-white w-full max-w-[650px] max-h-[90vh] overflow-y-auto rounded-[28px] md:rounded-[35px] p-5 md:p-10 shadow-2xl relative">

                  <button
                    onClick={() => {
                      setEmpleadoSeleccionado(null)
                      setShowEmpleadoModal(false)
                    }}
                  >
                    ×
                  </button>

                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">

                    {/* FOTO */}
                    <div className="flex w-full md:w-40 flex-shrink-0 flex-col items-center">
                      <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-300 shadow-sm">
                        <EmpleadoFoto
                          foto={empleadoSeleccionado.foto}
                          nombre={empleadoSeleccionado.nombre}
                          className="text-4xl"
                        />
                      </div>

                      <input
                        type="file"
                        className="hidden"
                        id="editar-foto-empleado"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]

                          if (file) {
                            setEmpleadoSeleccionado({
                              ...empleadoSeleccionado,
                              foto: URL.createObjectURL(file),
                              fotoFile: file
                            })
                          }
                        }}
                      />

                      <label
                        htmlFor="editar-foto-empleado"
                        className="mt-4 inline-flex cursor-pointer rounded-xl bg-[#07355E] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1B2A38]"
                      >
                        Cambiar foto
                      </label>
                    </div>

                    {/* INFO */}
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={empleadoSeleccionado.nombre}
                        onChange={(e) =>
                          setEmpleadoSeleccionado({
                            ...empleadoSeleccionado,
                            nombre: e.target.value
                          })
                        }
                        className="border border-slate-300 rounded-2xl px-5 py-4 w-full mb-4 text-lg"
                      />

                      <input
                        type="text"
                        value={empleadoSeleccionado.puesto}
                        onChange={(e) =>
                          setEmpleadoSeleccionado({
                            ...empleadoSeleccionado,
                            puesto: e.target.value
                          })
                        }
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-8"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* CORREO */}
                        <div>
                          <p className="text-slate-400 text-sm">
                            Correo
                          </p>

                          <input
                            type="email"
                            value={empleadoSeleccionado.email}
                            onChange={(e) =>
                              setEmpleadoSeleccionado({
                                ...empleadoSeleccionado,
                                email: e.target.value
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>

                        {/* TELEFONO */}
                        <div>
                          <p className="text-slate-400 text-sm">
                            Teléfono
                          </p>

                          <input
                            type="text"
                            value={empleadoSeleccionado.telefono}
                            onChange={(e) =>
                              setEmpleadoSeleccionado({
                                ...empleadoSeleccionado,
                                telefono: e.target.value
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>

                        {/* RFC */}
                        <div>
                          <p className="text-slate-400 text-sm">
                            RFC
                          </p>

                          <input
                            type="text"
                            value={empleadoSeleccionado.rfc || ''}
                            onChange={(e) =>
                              setEmpleadoSeleccionado({
                                ...empleadoSeleccionado,
                                rfc: e.target.value
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>

                      </div>

                      {/* CURP FULL WIDTH */}
                      <div className="mt-5">
                        <p className="text-slate-400 text-sm">
                          CURP
                        </p>

                        <input
                          type="text"
                          value={empleadoSeleccionado.curp || ''}
                          onChange={(e) =>
                            setEmpleadoSeleccionado({
                              ...empleadoSeleccionado,
                              curp: e.target.value
                            })
                          }
                          className="w-full border border-slate-300 rounded-xl px-3 py-2"
                        />
                      </div>

                      {/* FECHAS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                        <div>
                          <p className="text-slate-400 text-sm">
                            Fecha de nacimiento
                          </p>

                          <input
                            type="date"
                            value={getFechaInputValue(empleadoSeleccionado.fechaNacimiento)}
                            onChange={(e) =>
                              setEmpleadoSeleccionado({
                                ...empleadoSeleccionado,
                                fechaNacimiento: e.target.value
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>

                        <div>
                          <p className="text-slate-400 text-sm">
                            Fecha de ingreso
                          </p>

                          <input
                            type="date"
                            value={getFechaInputValue(empleadoSeleccionado.fechaIngreso)}
                            onChange={(e) =>
                              setEmpleadoSeleccionado({
                                ...empleadoSeleccionado,
                                fechaIngreso: e.target.value
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>

                      </div>


                      <button
                        onClick={() => {

                          editarEmpleado(
                            empleadoSeleccionado.id,
                            empleadoSeleccionado
                          )

                          setEmpleadoSeleccionado(null)

                          setShowEmpleadoModal(false)

                        }}
                        className="mt-8 w-full bg-[#07355E] hover:bg-[#1B2A38] text-white py-4 rounded-2xl transition-all"
                      >
                        Guardar cambios
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            )
          }

          {showDeleteModal && (

            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">

              <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-md border border-slate-100 animate-scaleIn">

                <div className="flex flex-col items-center text-center">

                  <h2 className="text-2xl font-bold text-[#07355E] mb-3">
                    Eliminar empleado
                  </h2>

                  <p className="text-slate-500 leading-relaxed mb-8">
                    ¿Deseas eliminar a
                    <span className="font-semibold text-[#07355E]">
                      {' '}{empleadoAEliminar?.nombre}
                    </span>?
                  </p>

                  <div className="flex gap-4 w-full">

                    <button
                      onClick={eliminarEmpleado}
                      className="flex-1 bg-[#07355E] hover:bg-[#1B2A38] text-white py-3 rounded-2xl font-medium shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      Eliminar
                    </button>

                    <button
                      onClick={() => {
                        setShowDeleteModal(false)
                        setEmpleadoAEliminar(null)
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-medium transition-all duration-300"
                    >
                      Cancelar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}
          {showSuccessModal && (

            <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn p-4">

              <div className="bg-gray-500 text-white px-6 md:px-10 py-5 md:py-6 rounded-3xl shadow-2xl animate-scaleIn text-center">

                <p className="font-medium text-xl">
                  Empleado eliminado correctamente
                </p>

              </div>

            </div>

          )}
          <FeedbackToast message={feedback?.message} type={feedback?.type} />
        </main>

      </div >
    )
  }

  return (
    <div className="min-h-screen bg-[#eef3ff] relative overflow-x-hidden">

      {/* TOPBAR */}
      <header className="min-h-20 md:h-24 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-12 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 self-center sm:self-auto text-center sm:text-left">

          <h1 className="text-3xl leading-none mb-1 font-semibold text-[#0a237a] font-['Cooper'] tracking-tight">
            SIGPA
          </h1>

          <p className="text-slate-600">
            Sistema Global de Personal y Activos
          </p>

        </div>

        <div className="flex items-center gap-8">
          <p className="text-slate-500 text-sm">
            Tampico, Tam. 18 Mayo 2026
          </p>

        </div>

      </header>

      {/* HERO */}
      <section className="flex flex-col items-center px-4 pt-12 md:pt-24">

        <h2 className="text-5xl md:text-[80px] font-medium tracking-tight text-[#001b70] font-['Cooper']">
          SIGPA
        </h2>

        <p className="text-xl md:text-3xl text-slate-600 mb-10 md:mb-16 text-center">
          Sistema Global de Personal y Activos
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 w-full max-w-7xl">

          {menuItems.map((item) => (

            <div
              key={item.title}
              className="bg-white w-full aspect-square min-h-[130px] max-h-[160px] rounded-3xl shadow-md flex flex-col items-center justify-center gap-4 md:gap-5 hover:shadow-xl transition-all"
            >

              <div className="text-[#0b2447] text-5xl">
                {item.icon}
              </div>

              <span className="text-slate-700 text-lg">
                {item.title}
              </span>

            </div>

          ))}

        </div>

        <button
          onClick={() => setShowLogin(true)}
          className="mt-14 bg-[#0b2447] hover:bg-[#16325c] hover:scale-105 text-white px-10 py-3 rounded-xl text-base tracking-wide shadow-md transition-all duration-300"
        >
          INICIAR SESIÓN
        </button>

      </section>

      {/* LOGIN MODAL */}
      {showLogin && (

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[28px] md:rounded-[35px] p-6 md:p-10 relative shadow-2xl">

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-6 right-8 text-3xl text-slate-400"
            >
              ×
            </button>

            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#001b70] mb-8 md:mb-10 font-['Cormorant_Garamond']">
              Iniciar Sesión
            </h2>

            <div className="space-y-6">

              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {
                error && (
                  <p className="text-red-500 text-sm text-center">
                    {error}
                  </p>
                )
              }
              <button
                onClick={handleLogin}
                className="bg-[#0b2447] hover:bg-[#16325c] hover:scale-105 text-white py-3 px-10 rounded-xl text-lg font-medium transition-all duration-300 mx-auto block mt-4"
              >
                INICIAR SESIÓN
              </button>

            </div>

          </div>

        </div>

      )}



    </div>
  )
}



function Incident({ title, employee }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <div>
        <p className="font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-slate-400">
          {employee}
        </p>
      </div>

      <p className="text-slate-400 text-sm">
        18 Mayo
      </p>

    </div>
  )
}
