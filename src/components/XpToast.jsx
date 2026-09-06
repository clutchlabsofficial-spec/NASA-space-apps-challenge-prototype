import { useEffect, useState } from 'react'

/**
 * A floating "+20 XP" that acknowledges the work and gets out of the way.
 * It lives at the app root rather than inside the header: the header sets
 * backdrop-filter, which makes it a containing block for fixed children, so a
 * toast rendered inside it would anchor to the header instead of the viewport
 * — and land straight on top of the lesson progress bar.
 */
export default function XpToast({ toast, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!toast) return
    setLeaving(false)
    const a = setTimeout(() => setLeaving(true), 1600)
    const b = setTimeout(onDone, 2200)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [toast, onDone])

  if (!toast) return null
  return (
    <div className={`xptoast ${leaving ? 'xptoast--out' : ''}`} key={toast.id} role="status">
      <span className="xptoast__amount">+{toast.amount} XP</span>
      <span className="xptoast__label">{toast.label}</span>
    </div>
  )
}
