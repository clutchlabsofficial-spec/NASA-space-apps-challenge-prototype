import { useEffect, useRef, useState } from 'react'

/**
 * Reveal on scroll — but from a *visible* resting state, never parked at zero
 * opacity waiting for an observer. If the observer never fires (reduced motion,
 * no IntersectionObserver, a screenshot), the content is simply already there.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setShown(true)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setShown(true)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${shown ? 'reveal--in' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
