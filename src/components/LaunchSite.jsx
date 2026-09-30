import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { animate, stagger, createSpring, utils } from 'animejs'
import {
  FLIGHT_MODES,
  SAFETY_RULES,
  NAR_SITE_TABLE,
  NAR_SOURCE,
  findOpenSpaces,
  getLocation,
  mapLinkFor,
  prettyDistance,
} from '../lib/launchSite.js'
import { t } from './bits.jsx'
import { PHOTOS } from '../data/photos.js'

/**
 * Where could you actually fly this?
 *
 * Read the long comment at the top of ../lib/launchSite.js before changing
 * anything here. The short version: this screen finds CANDIDATES and hands
 * back the questions that still need answering. It never tells a child that a
 * particular field is a safe or legal place to launch, because nothing on a
 * map can establish that.
 *
 * The thing being launched is a CanSat — the same subsystems the child just
 * designed, packed into a drink can and lofted a few hundred metres. That is
 * the real student version of this. A CubeSat rides a rocket to orbit and is
 * not something anyone launches from a field.
 */

function Rule({ rule, mode, index }) {
  return (
    <li className="srule">
      <span className="srule__n squeeze">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <h4>{t(rule.title, mode)}</h4>
        <p>{t(rule.body, mode)}</p>
      </div>
    </li>
  )
}

function SiteCard({ site, mode, need }) {
  const measured = site.spanM != null
  const verdict = site.fits === true ? 'fits' : site.fits === false ? 'small' : 'unknown'

  return (
    <li className={`site site--${verdict}`}>
      <div className="site__top">
        <span className="site__kind squeeze">{t(site.kind, mode)}</span>
        <span className="site__dist mono">{prettyDistance(site.distanceM)} away</span>
      </div>

      <h4 className="site__name">{site.name || (mode === 'explorer' ? 'Unnamed open space' : 'Unnamed area')}</h4>

      <p className="site__span">
        {measured ? (
          <>
            <strong>Roughly {prettyDistance(site.spanM)} across</strong>{' '}
            {site.fits
              ? mode === 'explorer'
                ? `— that is big enough for the ${need} m you need.`
                : `— clears the ${need} m minimum.`
              : mode === 'explorer'
                ? `— too small. You need at least ${need} m.`
                : `— below the ${need} m minimum site dimension.`}
          </>
        ) : (
          <>
            {mode === 'explorer'
              ? 'I could not measure this one from the map. You would have to go and look.'
              : 'No usable bounding box in the map data — size unverified.'}
          </>
        )}
      </p>

      <div className="site__links">
        <a href={site.osmUrl} target="_blank" rel="noreferrer" className="btn btn--bare">
          See it on the map
        </a>
      </div>

      <p className="site__caveat">
        {mode === 'explorer'
          ? 'Somebody owns this. Find out who, and ask them.'
          : 'Ownership unknown. Identify the landowner and get permission before anything else.'}
      </p>
    </li>
  )
}

export default function LaunchSite({ mode, onBack, onDone }) {
  const [flight, setFlight] = useState('small')
  const [status, setStatus] = useState('idle') // idle | locating | searching | done | failed | denied
  const [where, setWhere] = useState(null)
  const [sites, setSites] = useState([])
  const [note, setNote] = useState(null)
  const listRef = useRef(null)
  const reduced = useReducedMotion()

  const chosen = FLIGHT_MODES[flight]
  const need = chosen.needMetres

  useEffect(() => {
    if (!sites.length || reduced) return
    const cards = listRef.current?.querySelectorAll('.site')
    if (!cards?.length) return
    animate(cards, {
      opacity: [0, 1],
      y: [20, 0],
      delay: stagger(70),
      ease: createSpring({ stiffness: 110, damping: 14 }),
    })
    return () => utils.remove(cards)
  }, [sites, reduced])

  async function scout() {
    setStatus('locating')
    setNote(null)
    setSites([])

    const loc = await getLocation({ coarse: true })
    if (!loc.ok) {
      setStatus(loc.reason === 'denied' ? 'denied' : 'failed')
      setNote(
        loc.reason === 'denied'
          ? null
          : 'Your device would not give a location. You can still search by hand below.',
      )
      return
    }

    setWhere(loc)
    setStatus('searching')

    const res = await findOpenSpaces({
      lat: loc.lat,
      lon: loc.lon,
      radiusM: 5000,
      needMetres: need,
    })

    if (!res.ok) {
      setStatus('failed')
      setNote(res.note)
      return
    }
    setSites(res.sites.slice(0, 8))
    setStatus('done')
  }

  return (
    <div className="shell launch">
      <header className="launch__head">
        <span className="squeeze launch__tag">Last step</span>
        <h1 className="poster-lg">Where could you fly it?</h1>
        <p className="launch__intro">
          {mode === 'explorer'
            ? 'A real CubeSat rides a rocket into space — nobody launches one from a field. What you can really build and fly is a CanSat: the same parts, squeezed into a drink can, thrown a few hundred metres up by a model rocket or dropped from a drone.'
            : 'A CubeSat reaches orbit on a launch vehicle; it is not something you fly yourself. The student equivalent is a CanSat — the same subsystems in a drink-can volume, lofted a few hundred metres by a model rocket or released from a drone. That is what this plans for.'}
        </p>
      </header>

      <figure className="launch__figure">
        <img src={PHOTOS.test.src} alt={PHOTOS.test.alt} loading="lazy" />
        <figcaption>
          <strong>{PHOTOS.test.title}</strong>
          <span>{PHOTOS.test.caption}</span>
          <span className="lesson__credit">{PHOTOS.test.credit}</span>
        </figcaption>
      </figure>

      {/* ── The honest banner. Not dismissible, not a footnote. ───────── */}
      <div className="warnbox">
        <span className="warnbox__tag squeeze">Read this before anything else</span>
        <p>
          {mode === 'explorer'
            ? 'I can show you open spaces near you. I cannot tell you that any of them are safe or allowed — no map can. Every one of them belongs to somebody, and you have to ask them first, with an adult.'
            : 'This finds candidate open spaces. It cannot establish that any of them is a safe or lawful launch site — no map can. Every result needs an owner identified, permission obtained, airspace checked and an adult responsible.'}
        </p>
      </div>

      <section className="flightpick">
        <span className="label">{mode === 'explorer' ? 'How will you send it up?' : 'Flight method'}</span>
        <div className="flightpick__row">
          {Object.values(FLIGHT_MODES).map((f) => (
            <button
              key={f.id}
              className={`flightopt ${flight === f.id ? 'flightopt--on' : ''}`}
              onClick={() => setFlight(f.id)}
            >
              <span className="flightopt__name">{t(f.name, mode)}</span>
              <span className="flightopt__blurb">{t(f.blurb, mode)}</span>
              <span className="flightopt__need mono">needs {f.needMetres} m clear</span>
            </button>
          ))}
        </div>
        <p className="flightpick__why">
          {t(chosen.why, mode)}{' '}
          <a href={NAR_SOURCE.url} target="_blank" rel="noreferrer">
            {NAR_SOURCE.label}
          </a>
        </p>
      </section>

      <section className="scout">
        <motion.button
          className="btn btn--primary scout__go"
          onClick={scout}
          disabled={status === 'locating' || status === 'searching'}
          whileTap={reduced ? undefined : { scale: 0.96 }}
        >
          {status === 'locating'
            ? 'Asking your device where you are…'
            : status === 'searching'
              ? 'Looking for open ground…'
              : mode === 'explorer'
                ? 'Find open space near me'
                : 'Search for candidate sites'}
        </motion.button>

        <p className="scout__privacy">
          {mode === 'explorer'
            ? 'Your location is rounded off, used once to search, and never saved or sent to us.'
            : 'Location is rounded to ~1 km, used only for the map query, never stored and never sent to this app’s server.'}
        </p>

        <AnimatePresence>
          {status === 'denied' && (
            <motion.div
              className="scout__msg"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>
                {mode === 'explorer'
                  ? 'No problem — you said no to sharing your location. You can still do this by hand: open a map, find a big open space, and check it against the size below.'
                  : 'Location declined. You can do the same search manually: open a map, identify open ground, and measure it against the minimum below.'}
              </p>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              className="scout__msg"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>
                {note ||
                  'The open-space search could not run from here.'}{' '}
                {mode === 'explorer'
                  ? 'You can still look by hand:'
                  : 'Manual fallback:'}
              </p>
              <a
                className="btn btn--ghost"
                href={where ? mapLinkFor(where.lat, where.lon) : 'https://www.openstreetmap.org/'}
                target="_blank"
                rel="noreferrer"
              >
                Open a map and look for open ground
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'done' && (
          <div className="scout__results">
            <p className="scout__count">
              {sites.length === 0
                ? mode === 'explorer'
                  ? 'I did not find any mapped open spaces within 5 km. That does not mean there are none — the map may just not know about them.'
                  : 'No mapped open spaces within 5 km. Absence from OpenStreetMap is not absence on the ground.'
                : mode === 'explorer'
                  ? `${sites.length} open spaces within 5 km, biggest-enough first. Every one still needs checking.`
                  : `${sites.length} candidates within 5 km, ranked by whether they clear ${need} m, then by distance.`}
            </p>
            <ul className="sites" ref={listRef}>
              {sites.map((s) => (
                <SiteCard key={s.id} site={s} mode={mode} need={need} />
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rules">
        <h2 className="poster-md">
          {mode === 'explorer' ? 'The things a map cannot tell you' : 'What the map cannot answer'}
        </h2>
        <ol className="rules__list">
          {SAFETY_RULES.map((r, i) => (
            <Rule key={r.id} rule={r} mode={mode} index={i} />
          ))}
        </ol>
      </section>

      <section className="nartable">
        <h3 className="squeeze">How much space each motor really needs</h3>
        <p className="nartable__intro">
          {mode === 'explorer'
            ? 'This is the actual safety rule rocket clubs use. The bigger the motor, the bigger the empty space you need around it.'
            : 'Minimum site dimensions from the NAR Model Rocket Safety Code, by total motor impulse.'}
        </p>
        <table>
          <thead>
            <tr>
              <th>Motor</th>
              <th>Total impulse</th>
              <th>Clear area needed</th>
            </tr>
          </thead>
          <tbody>
            {NAR_SITE_TABLE.map((row) => (
              <tr key={row.cls}>
                <td className="mono">{row.cls}</td>
                <td className="mono">{row.impulse}</td>
                <td className="mono">
                  {row.metres} m <span className="nartable__ft">({row.feet} ft)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="nartable__src">
          Source:{' '}
          <a href={NAR_SOURCE.url} target="_blank" rel="noreferrer">
            {NAR_SOURCE.label}
          </a>
        </p>
      </section>

      <div className="actionbar">
        <div className="actionbar__inner">
          <button className="btn btn--bare" onClick={onBack}>
            Back to the build
          </button>
          <button className="btn btn--big" onClick={onDone}>
            {mode === 'explorer' ? 'See my whole satellite' : 'Back to the review'}
          </button>
        </div>
      </div>
    </div>
  )
}
