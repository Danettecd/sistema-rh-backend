export default function ConfirmModal({
  title,
  message,
  highlight,
  confirmText = 'Eliminar',
  onConfirm,
  onCancel
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-5 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-100 animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-5">
            !
          </div>

          <h2 className="text-2xl font-bold text-[#07355E] mb-3">
            {title}
          </h2>

          <p className="text-slate-500 leading-relaxed mb-8">
            {message}
            {highlight && (
              <span className="font-semibold text-[#07355E]">
                {' '}{highlight}
              </span>
            )}
          </p>

          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-[#07355E] hover:bg-[#1B2A38] text-white py-3 rounded-2xl font-medium shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {confirmText}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-medium transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
