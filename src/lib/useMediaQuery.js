import { useEffect, useState } from 'react'

/** Subscribe to a media query. Used for layout decisions React has to make
 *  itself, where CSS alone cannot reach — such as whether a disclosure starts
 *  open. SSR-safe and cleans up after itself. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1100px)')
