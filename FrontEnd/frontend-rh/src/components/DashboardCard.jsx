export default function DashboardCard({
  title,
  value,
  icon
}) {

  return (

    <div
      className="
        group
        bg-white
        rounded-3xl
        p-5
        shadow-sm
        border border-slate-100
        min-w-0
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      {/* PARTE SUPERIOR */}
      <div className="flex items-start justify-between gap-3 mb-5">

        <div
          className="
            w-11 h-11
            rounded-2xl
            bg-[#EAF4FC]
            text-[#164e87]
            flex items-center justify-center
            text-xl
            flex-shrink-0
          "
        >
          {icon}
        </div>

        <span
          className="
            w-2 h-2
            rounded-full
            bg-[#a9cbea]
            mt-2
          "
        />

      </div>

      {/* NUMERO */}
      <h3
        className="
          text-4xl
          font-bold
          text-[#082b59]
          tracking-tight
          leading-none
          mb-2
        "
      >
        {value}
      </h3>

      {/* TITULO */}
      <p
        className="
          text-sm
          font-medium
          text-slate-500
          leading-tight
        "
      >
        {title}
      </p>

    </div>

  )
}