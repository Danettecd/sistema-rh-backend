export default function DashboardCard({
  title,
  value,
  icon
}) {

  return (

    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between gap-4 min-w-0">

      <div>

        <p className="text-slate-500 mb-3 font-['Cooper'] text-base md:text-lg tracking-tight">
          {title}
        </p>

        <h3 className="text-4xl md:text-5xl font-semibold text-[#0b2447] tracking-tight">
          {value}
        </h3>

      </div>

      <div className="text-3xl md:text-4xl text-[#BFE0FF] flex-shrink-0">
        {icon}
      </div>

    </div>

  )
}
