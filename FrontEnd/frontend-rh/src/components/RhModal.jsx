export default function RhModal({
  title,
  children,
  onClose,
  footer
}) {
  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] md:rounded-[32px] p-5 md:p-8 shadow-2xl border border-slate-100 animate-scaleIn">
        <div className="flex items-start justify-between gap-6 mb-7">
          <h2 className="text-2xl md:text-3xl font-medium text-[#001b70] font-['Cooper']">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-2xl leading-none transition-all"
            aria-label="Cerrar modal"
          >
            x
          </button>
        </div>

        {children}

        {footer && (
          <div className="mt-8">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
