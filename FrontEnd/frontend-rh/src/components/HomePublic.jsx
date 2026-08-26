import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaQuoteLeft,
  FaUsers,
  FaCog,
  FaChartLine
} from 'react-icons/fa'

import logoDcci from '../assets/branding/logo-dcci.png'
import heroDcci from '../assets/branding/hero-dcci.png'

export default function HomePublic({
  menuItems,
  onLogin
}) {

  const fechaActual = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-[#082b59]">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200">

        <div className="
          max-w-[1600px]
          mx-auto
          min-h-[105px]
          px-6
          lg:px-14
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-5
        ">

          {/* MARCA */}
          <div className="flex items-center gap-5">

            <img
              src={logoDcci}
              alt="DCCI"
              className="h-[72px] w-auto object-contain"
            />

            <div className="h-14 w-px bg-slate-300 hidden sm:block" />

            <div>
              <h1 className="
                text-[34px]
                lg:text-[42px]
                leading-none
                font-semibold
                text-[#082b59]
                font-['Cooper']
              ">
                SIGPA
              </h1>

              <p className="
                text-[#31577f]
                text-sm
                lg:text-[17px]
                mt-1
              ">
                Sistema Global de Personal y Activos
              </p>
            </div>

          </div>


          {/* FECHA Y UBICACIÓN */}
          <div className="
            flex
            flex-wrap
            items-center
            justify-center
            md:justify-end
            gap-5
            lg:gap-7
            text-[#31577f]
          ">

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-lg" />

              <span className="capitalize text-sm lg:text-base">
                {fechaActual}
              </span>
            </div>

            <div className="hidden lg:block h-9 w-px bg-slate-300" />

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-lg" />

              <span className="text-sm lg:text-base">
                Tampico, Tamps.
              </span>
            </div>

          </div>

        </div>

      </header>


      {/* ================= HERO ================= */}
      <section className="
        relative
        h-[510px]
        lg:h-[535px]
        overflow-hidden
      ">

        {/* FOTO */}
        <img
          src={heroDcci}
          alt="DCCI proyectos industriales"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
          style={{
            objectPosition: 'center 40%'
          }}
        />

        {/* DEGRADADO PRINCIPAL */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#082b59]
          via-[#082b59]/75
          via-40%
          to-transparent
          to-72%
        " />

        {/* SOMBRA SUAVE GENERAL */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#061b32]/20
          via-transparent
          to-transparent
        " />


        {/* TEXTO HERO */}
        <div className="
          relative
          z-10
          max-w-[1600px]
          mx-auto
          h-full
          px-7
          md:px-12
          lg:px-20
          pt-14
          lg:pt-16
          text-white
        ">

          <div className="max-w-[570px]">

            <p className="
              tracking-[0.38em]
              text-sm
              lg:text-[18px]
              font-medium
              mb-3
            ">
              BIENVENIDO A
            </p>

            <h2 className="
              text-[74px]
              md:text-[92px]
              lg:text-[108px]
              leading-[0.9]
              font-['Cooper']
              font-medium
              tracking-tight
            ">
              SIGPA
            </h2>

            <p className="
              text-[28px]
              md:text-[34px]
              lg:text-[38px]
              leading-[1.1]
              mt-4
              font-light
            ">
              Sistema Global de
              <br />
              Personal y Activos
            </p>

            <div className="
              w-[65px]
              h-[3px]
              bg-white
              my-7
            " />

            <p className="
              text-[18px]
              md:text-[20px]
              lg:text-[22px]
              leading-[1.35]
              text-blue-50
            ">
              Personas, procesos y recursos
              <br />
              que impulsan grandes proyectos.
            </p>

          </div>

        </div>

      </section>


      {/* ================= MÓDULOS ================= */}
      <section className="
        relative
        z-20
        max-w-[1600px]
        mx-auto
        px-6
        lg:px-14
        -mt-[82px]
      ">

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-7
          gap-4
          lg:gap-5
        ">

          {menuItems.map((item) => (

            <div
              key={item.key}
              className="
                group
                bg-white
                min-h-[205px]
                lg:min-h-[220px]
                rounded-[26px]
                shadow-[0_8px_28px_rgba(15,45,75,0.12)]
                border
                border-slate-100
                flex
                flex-col
                items-center
                justify-center
                px-3
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_14px_35px_rgba(15,45,75,0.18)]
              "
            >

              <div className="
                w-[72px]
                h-[72px]
                rounded-full
                bg-[#edf5fc]
                flex
                items-center
                justify-center
                text-[#082b59]
                text-[32px]
                mb-4
              ">
                {item.icon}
              </div>

              <p className="
                text-[#082b59]
                text-[17px]
                lg:text-[19px]
                font-medium
                mb-4
              ">
                {item.title}
              </p>

              <div className="
                w-[37px]
                h-[37px]
                rounded-full
                border
                border-[#9abbd8]
                flex
                items-center
                justify-center
                text-[#082b59]
                text-sm
                transition-all
                duration-300
                group-hover:bg-[#082b59]
                group-hover:text-white
              ">
                <FaArrowRight />
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= FRANJA CORPORATIVA ================= */}
      <section className="
        max-w-[1600px]
        mx-auto
        px-6
        lg:px-14
        pt-10
      ">

        <div className="
          bg-gradient-to-r
          from-[#eaf3fb]
          via-[#edf5fc]
          to-[#eaf3fb]
          rounded-[25px]
          min-h-[145px]
          px-7
          lg:px-10
          py-7
          grid
          grid-cols-1
          lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.9fr_1.2fr]
          items-center
          gap-7
        ">


          {/* FRASE */}
          <div className="flex items-start gap-4">

            <FaQuoteLeft className="
              text-[#5482ad]
              text-4xl
              shrink-0
            " />

            <p className="
              italic
              text-[#31577f]
              text-lg
              lg:text-[20px]
              leading-relaxed
            ">
              “El talento construye
              <br />
              la base, el trabajo en equipo
              <br />
              <span className="underline underline-offset-4">
                eleva los resultados.
              </span>”
            </p>

          </div>


          {/* EQUIPO */}
          <div className="
            lg:border-l
            lg:border-[#9cb9d1]
            lg:pl-7
            flex
            items-center
            gap-4
          ">

            <FaUsers className="text-[39px] text-[#082b59]" />

            <p className="text-[17px] leading-tight">
              Nuestro
              <br />
              Equipo
            </p>

          </div>


          {/* FUERZA */}
          <div className="
            lg:border-l
            lg:border-[#9cb9d1]
            lg:pl-7
            flex
            items-center
            gap-4
          ">

            <FaCog className="text-[39px] text-[#082b59]" />

            <p className="text-[17px] leading-tight">
              Nuestra
              <br />
              Fuerza
            </p>

          </div>


          {/* PROYECTOS */}
          <div className="
            lg:border-l
            lg:border-[#9cb9d1]
            lg:pl-7
            flex
            items-center
            gap-4
          ">

            <FaChartLine className="text-[39px] text-[#082b59]" />

            <p className="text-[17px] leading-tight">
              Grandes
              <br />
              Proyectos
            </p>

          </div>


          {/* LOGIN */}
          <div className="
            lg:border-l
            lg:border-[#9cb9d1]
            lg:pl-8
            flex
            justify-center
          ">

            <button
              onClick={onLogin}
              className="
                bg-[#082b59]
                hover:bg-[#123f6a]
                hover:-translate-y-1
                text-white
                px-8
                py-4
                rounded-xl
                font-semibold
                tracking-wide
                transition-all
                shadow-md
                whitespace-nowrap
              "
            >
              INICIAR SESIÓN
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="
        max-w-[1600px]
        mx-auto
        px-6
        lg:px-14
        pt-7
        pb-8
      ">

        <div className="
          border-t
          border-slate-200
          pt-5
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-4
          text-[#31577f]
        ">

          <div className="
            flex
            items-center
            gap-3
            text-sm
            lg:text-base
          ">

            <span className="font-bold text-[#082b59]">
              DCCI
            </span>

            <span className="text-slate-300">
              |
            </span>

            <span>
              Diseño, Construcción y Consultoría Industrial
            </span>

          </div>


          <p className="
            text-[11px]
            lg:text-[12px]
            tracking-[0.23em]
            uppercase
            text-center
          ">
            Personas · Procesos · Activos · Resultados
          </p>

        </div>

      </footer>

    </div>
  )
}