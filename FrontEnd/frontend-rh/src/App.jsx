import { useState } from 'react'

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
  FaBirthdayCake
} from 'react-icons/fa'

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaChartPie />
    },
    {
      title: 'Empleados',
      icon: <FaUsers />
    },
    {
      title: 'Asistencia',
      icon: <FaCalendarCheck />
    },
    {
      title: 'Incidencias',
      icon: <FaExclamationTriangle />
    },
    {
      title: 'Uniformes',
      icon: <FaTshirt />
    },
    {
      title: 'Vehículos',
      icon: <FaTruck />
    },
    {
      title: 'Salud',
      icon: <FaHeartbeat />
    }
  ]

  const birthdays = [
    'María López',
    'José Ramírez',
    'Ana Martínez',
    'Carlos García',
    'Luis Hernández',
    'Sofía Pérez'
  ]

  if (isLogged) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex">

        {/* SIDEBAR */}
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-[250px]' : 'w-[18px] overflow-x-hidden'} relative bg-gradient-to-b from-[#081225] to-[#102544] text-white flex flex-col justify-between py-8 px-6 transition-all duration-300 whitespace-nowrap`}>

          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full text-slate-700"
          >
            &lt;
          </button>

          <div>

            <h1 className= {`${!sidebarOpen && 'opacity-0'} text-5xl font-semibold text-white font-['Cooper'] mb-14 tracking-tight transition-all duration-200`}>
            
              SIGPA
            </h1>
            <div className="w-full">
              <nav className={`${!sidebarOpen && 'opacity-0'} space-y-3 transition-all duration-200`}>

                {menuItems.map((item, index) => (

                  <div
                    key={item.title}
                    className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all border border-transparent

          ${index === 0
                        ? 'bg-[#BFE0FF] text-[#0b2447] shadow-sm'
                        : 'hover:bg-white/10 text-white'
                      }`}
                  >

                    <span className="text-lg">
                      {item.title}
                    </span>

                  </div>

                ))}

              </nav>
            </div>
          </div>

          <button className={`${!sidebarOpen && 'opacity-0'} flex items-center gap-3 text-lg transition-all duration-200`}>
            Cerrar sesión
          </button>

        </aside>

        {/* MAIN */}
        <main className="flex-1">

          {/* TOPBAR */}
          <header className="bg-white h-24 flex items-center justify-between px-10 border-b border-slate-200">

            <div className="flex items-center gap-6">

              {!sidebarOpen && (
                <FaBars
                  onClick={() => setSidebarOpen(true)}
                  className="text-2xl text-slate-700 cursor-pointer"
                />
              )}

              <h2 className="text-[30px] font-medium tracking-tight text-[#001b70] font-['Cooper']">
                Dashboard
              </h2>

            </div>

            <div className="flex items-center gap-8">

              <div className="relative">
                <FaBell className="text-2xl text-slate-700" />

                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </div>
              </div>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-slate-300"></div>

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
          <div className="p-8">

            {/* CARDS */}
            <div className="grid grid-cols-5 gap-6 mb-8">

              <DashboardCard
                title="Empleados"
                value="128"
                icon={<FaUsers />}
              />

              <DashboardCard
                title="Cumpleaños del mes"
                value="8"
                icon={<FaBirthdayCake />}
              />

              <DashboardCard
                title="Vehículos"
                value="24"
                icon={<FaTruck />}
              />

              <DashboardCard
                title="Incidencias"
                value="15"
                icon={<FaExclamationTriangle />}
              />

              <DashboardCard
                title="Faltas"
                value="27"
                icon={<FaCalendarCheck />}
              />

            </div>

            {/* BIRTHDAYS */}
            <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">

              <h3 className="text-2xl font-medium text-slate-800 mb-6 font-['Cooper']">
                Cumpleaños del mes
              </h3>

              <div className="grid grid-cols-6 gap-5">

                {birthdays.map((person) => (

                  <div
                    key={person}
                    className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center"
                  >

                    <div className="w-20 h-20 rounded-full bg-slate-300 mb-4"></div>

                    <h4 className="text-center font-medium text-slate-700">
                      {person}
                    </h4>

                    <p className="text-sm text-slate-400 mt-1">
                      03 Mayo
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-3 gap-6">

              <div className="bg-white rounded-3xl p-8 shadow-sm col-span-2">

                <h3 className="text-2xl font-medium text-slate-800 mb-6 font-['Cooper']">
                  Resumen del mes
                </h3>

                <div className="h-[250px] bg-slate-100 rounded-2xl"></div>

              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <h3 className="text-2xl font-medium text-slate-800 mb-6 font-['Cooper']">
                  Incidencias recientes
                </h3>

                <div className="space-y-6">

                  <Incident
                    title="Retraso"
                    employee="María López"
                  />

                  <Incident
                    title="Falta"
                    employee="José Ramírez"
                  />

                  <Incident
                    title="Salida anticipada"
                    employee="Ana Martínez"
                  />

                </div>

              </div>

            </div>

          </div>

        </main>

      </div >
    )
  }

  return (
    <div className="min-h-screen bg-[#eef3ff] relative overflow-hidden">

      {/* TOPBAR */}
      <header className="h-24 bg-white flex items-center justify-between px-12">
        <div className="flex items-center gap-8 self-center">

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
      <section className="flex flex-col items-center pt-24">

        <h2 className="text-[80px] font-medium tracking-tight text-[#001b70] font-['Cooper']">
          SIGPA
        </h2>

        <p className="text-3xl text-slate-600 mb-16">
          Sistema Global de Personal y Activos
        </p>

        <div className="grid grid-cols-7 gap-6">

          {menuItems.map((item) => (

            <div
              key={item.title}
              className="bg-white w-[160px] h-[160px] rounded-3xl shadow-md flex flex-col items-center justify-center gap-5 hover:shadow-xl transition-all"
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

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-[35px] p-10 relative shadow-2xl">

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-6 right-8 text-3xl text-slate-400"
            >
              ×
            </button>

            <h2 className="text-4xl font-bold text-center text-[#001b70] mb-10 font-['Cormorant_Garamond']">
              Iniciar Sesión
            </h2>

            <div className="space-y-6">

              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                className="w-full border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => setIsLogged(true)}
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

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">

      <div>

        <p className="text-slate-500 mb-3 font-['Cooper'] text-lg tracking-tight">
          {title}
        </p>

        <h3 className="text-5xl font-semibold text-[#0b2447] tracking-tight">
          {value}
        </h3>

      </div>

      <div className="text-4xl text-[#BFE0FF]">
        {icon}
      </div>

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