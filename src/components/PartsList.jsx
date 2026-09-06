import { useMemo, useState } from 'react'
import { STATIONS, resolvePicks, asList, isCustom } from '../data/stations/index.js'
import { partsFor, isBuyable, COMMON_PARTS, PRICES_CHECKED, PRICE_NOTE } from '../data/parts.js'
import { t } from './bits.jsx'
import { MascotSays } from './Mascot.jsx'

const money = (n) => `$${n.toFixed(2)}`

function PartCard({ part, mode, checked, onToggle }) {
  if (!isBuyable(part)) {
    return (
      <div className="part part--none">
        <span className="part__badge mono">{mode === 'explorer' ? 'Cannot be bought' : 'No hobby equivalent'}</span>
        <div className="part__name">{part.name}</div>
        <p className="part__why">{t(part.why, mode)}</p>
      </div>
    )
  }

  const qty = part.quantity || 1
  return (
    <label className={`part ${checked ? 'part--in' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="part__check" />
      <span className="part__mark" aria-hidden="true">{checked ? '✓' : ''}</span>

      <span className="part__body">
        <span className="part__head">
          <span className="part__name">
            {part.name}
            {qty > 1 && <span className="part__qty mono">× {qty}</span>}
          </span>
          <span className="part__price mono">
            {part.price === 0
              ? mode === 'explorer' ? 'free!' : 'free'
              : typeof part.price === 'number'
                ? money(part.price * qty)
                : mode === 'explorer' ? 'check price' : 'price varies'}
          </span>
        </span>

        <span className="part__vendor mono">{part.vendor}</span>
        {part.spec && <span className="part__spec mono">{part.spec}</span>}
        <span className="part__why">{t(part.why, mode)}</span>
        {part.needs && <span className="part__needs mono">Needs: {part.needs}</span>}
        {part.warning && (
          <span className="part__warning">
            <strong>{mode === 'explorer' ? 'Careful:' : 'Safety:'}</strong> {t(part.warning, mode)}
          </span>
        )}
        {part.url && (
          <a className="part__link mono" href={part.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            {mode === 'explorer' ? 'See it in the shop ↗' : 'View product page ↗'}
          </a>
        )}
      </span>
    </label>
  )
}

export default function PartsList({ picks, mode, onBack, onBuild }) {
  // Everything is ticked to begin with, so the total is honest on arrival and
  // the child unticks what they do not want rather than hunting for things.
  const groups = useMemo(() => {
    return STATIONS.map((station) => {
      const chosen = resolvePicks(station.id, picks)
      const entries = []
      for (const pick of asList(picks[station.id])) {
        if (isCustom(pick)) {
          entries.push({ key: `own:${pick.name}`, forChoice: pick.name, own: true })
          continue
        }
        const parts = partsFor(station.id, pick) || []
        const label = chosen.find((o) => o.id === pick)?.name
        for (const [i, part] of parts.entries()) {
          entries.push({ key: `${station.id}:${pick}:${i}`, forChoice: label ? t(label, mode) : pick, part })
        }
      }
      return { station, entries }
    }).filter((g) => g.entries.length)
  }, [picks, mode])

  const [unticked, setUnticked] = useState(() => new Set())
  const toggle = (key) =>
    setUnticked((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const all = groups.flatMap((g) => g.entries).filter((e) => e.part && isBuyable(e.part))
  const inBasket = all.filter((e) => !unticked.has(e.key))
  const total = inBasket.reduce((sum, e) => sum + (typeof e.part.price === 'number' ? e.part.price * (e.part.quantity || 1) : 0), 0)
  const unpriced = inBasket.filter((e) => typeof e.part.price !== 'number').length

  return (
    <div className="shell parts">
      <header className="lesson__head">
        <button className="lesson__close" onClick={onBack} aria-label="Back">✕</button>
        <div className="parts__headline">
          <span className="mono lesson__code">{mode === 'explorer' ? 'Shopping list' : 'Bill of materials'}</span>
          <h1>{mode === 'explorer' ? 'Build it for real' : 'Build it for real'}</h1>
        </div>
      </header>

      <MascotSays mood="excited" highlight={mode === 'explorer' ? 'You can actually build this!' : 'A CanSat-class build'}>
        {mode === 'explorer'
          ? 'You cannot buy real space parts — they cost more than a house. But you CAN build a satellite the size of a drinks can that does all the same jobs: it senses things, thinks, powers itself and radios you. Here is the shopping list for YOUR design.'
          : 'Nobody can buy spaceflight hardware on a school budget. What you can build is a CanSat-class model — drinks-can sized, doing every job your design does: sense, compute, self-power, and downlink to a ground station you also built. This list is assembled from your choices.'}
      </MascotSays>

      <div className="basket panel">
        <div className="basket__row">
          <span className="label">{mode === 'explorer' ? 'Your shopping list' : 'Basket total'}</span>
          <strong className="basket__total mono">{money(total)}</strong>
        </div>
        <p className="basket__note">
          {unpriced > 0 && (
            <>
              {mode === 'explorer'
                ? `Plus ${unpriced} thing${unpriced > 1 ? 's' : ''} you need to look up the price for. `
                : `Plus ${unpriced} item${unpriced > 1 ? 's' : ''} with no quoted price. `}
            </>
          )}
          {t(PRICE_NOTE, mode)} <span className="mono">Checked {PRICES_CHECKED}.</span>
        </p>
      </div>

      {groups.map(({ station, entries }) => (
        <section className="parts__group" key={station.id}>
          <h2 className="parts__station">
            <span className="mono">{station.code}</span> {t(station.name, mode)}
          </h2>
          {entries.map((e) =>
            e.own ? (
              <div className="part part--own" key={e.key}>
                <span className="part__badge mono">{mode === 'explorer' ? 'Your invention' : 'Your own design'}</span>
                <div className="part__name">{e.forChoice}</div>
                <p className="part__why">
                  {mode === 'explorer'
                    ? 'This one is yours, so there is no shop for it! Look at the parts above and think about what you could use to make it.'
                    : 'You invented this, so nobody sells it. Look at the neighbouring parts and work out what you would build it from — that is genuine engineering.'}
                </p>
              </div>
            ) : (
              <div className="parts__forchoice" key={e.key}>
                <span className="parts__choicelabel mono">{e.forChoice}</span>
                <PartCard part={e.part} mode={mode} checked={!unticked.has(e.key)} onToggle={() => toggle(e.key)} />
              </div>
            ),
          )}
        </section>
      ))}

      <section className="parts__group">
        <h2 className="parts__station">
          <span className="mono">ALL</span> {mode === 'explorer' ? 'Bits every build needs' : 'Common to every build'}
        </h2>
        {COMMON_PARTS.map((part, i) => (
          <PartCard key={i} part={part} mode={mode} checked onToggle={() => {}} />
        ))}
      </section>

      <div className="actionbar">
        <div className="actionbar__inner">
          <span className="actionbar__total">
            <span className="label">{mode === 'explorer' ? 'Your list' : 'Total'}</span>
            <strong>{money(total)}</strong>
          </span>
          <button className="btn btn--big" onClick={onBuild}>
            {mode === 'explorer' ? 'Show me how to build it →' : 'Assembly guide →'}
          </button>
        </div>
      </div>
    </div>
  )
}
