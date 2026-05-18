export default function DashboardCard({
  title,
  value,
  icon
}) {

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