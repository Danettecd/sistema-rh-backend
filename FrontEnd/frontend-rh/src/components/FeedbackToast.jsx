export default function FeedbackToast({ message, type = 'success' }) {
  if (!message) {
    return null
  }

  const tone = type === 'error'
    ? 'bg-red-500'
    : 'bg-[#07355E]'

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-scaleIn">
      <div className={`${tone} text-white px-7 py-4 rounded-3xl shadow-2xl font-medium`}>
        {message}
      </div>
    </div>
  )
}
