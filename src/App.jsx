import { useCallback, useMemo, useState } from 'react'
import './styles/global.css'
import './styles/app.css'
import { STATIONS, getStation, getOption, asList, pickKey, totalPicks, stationDone } from './data/stations/index.js'
import { getMission } from './data/missions.js'
import TopBar from './components/TopBar.jsx'
import XpToast from './components/XpToast.jsx'
import MissionSelect from './components/MissionSelect.jsx'
import PathMap from './components/PathMap.jsx'
import StationView from './components/StationView.jsx'
import Review from './components/Review.jsx'
import References from './components/References.jsx'
import PartsList from './components/PartsList.jsx'
import BuildGuide from './components/BuildGuide.jsx'

// Experience points are a progress language children already read fluently.
// They are earned for real work — deciding a subsystem, inventing a part,
// drawing your satellite — never for time spent.
export const XP = { choice: 20, invention: 60, sketch: 40, station: 30, finish: 200 }

export default function App() {
  const [mode, setMode] = useState('engineer')
  const [screen, setScreen] = useState('mission') // mission | path | build | review | parts | guide | refs
  const [prevScreen, setPrevScreen] = useState('mission')
  const [missionId, setMissionId] = useState(null)
  const [stationId, setStationId] = useState(STATIONS[0].id)
  const [picks, setPicks] = useState({})
  const [wholeModel, setWholeModel] = useState(null)
  const [xp, setXp] = useState(0)
  const [toast, setToast] = useState(null)

  const mission = missionId ? getMission(missionId) : null
  const built = useMemo(() => STATIONS.filter((s) => stationDone(picks, s.id)).length, [picks])
  const allDone = built === STATIONS.length

  const award = useCallback((amount, label) => {
    setXp((v) => v + amount)
    setToast({ amount, label, id: Date.now() })
  }, [])

  const startMission = (id) => {
    setMissionId(id)
    setPicks({})
    setWholeModel(null)
    setXp(0)
    setStationId(STATIONS[0].id)
    setScreen('path')
  }

  /** Add or remove one choice. Single-select stations replace; multi add. */
  const togglePick = useCallback((sid, entry) => {
    const station = getStation(sid)
    let awarded = null
    setPicks((p) => {
      const list = asList(p[sid])
      const key = pickKey(entry)
      const already = list.some((x) => pickKey(x) === key)
      const next = already
        ? list.filter((x) => pickKey(x) !== key)
        : station.multi
          ? [...list, entry]
          : [entry]

      if (!already) {
        const first = list.length === 0
        awarded = {
          amount: (typeof entry === 'object' ? XP.invention : XP.choice) + (first ? XP.station : 0),
          label: typeof entry === 'object' ? 'Your own design!' : getOption(sid, entry)?.name.e || 'Part added',
        }
      }

      const copy = { ...p }
      if (next.length) copy[sid] = next
      else delete copy[sid]
      return copy
    })
    if (awarded) award(awarded.amount, awarded.label)
  }, [award])

  /** Replace an invention in place — used when its 3D model arrives. */
  const updatePick = useCallback((sid, key, entry) => {
    setPicks((p) => {
      const list = asList(p[sid])
      if (!list.some((x) => pickKey(x) === key)) return p
      return { ...p, [sid]: list.map((x) => (pickKey(x) === key ? entry : x)) }
    })
  }, [])

  const goto = (sid) => {
    setStationId(sid)
    setScreen('build')
  }

  const openRefs = () => {
    setPrevScreen(screen)
    setScreen('refs')
  }

  const finish = () => {
    if (screen !== 'review') award(XP.finish, 'Satellite complete!')
    setScreen('review')
    window.scrollTo({ top: 0 })
  }

  const restart = () => {
    setMissionId(null)
    setPicks({})
    setWholeModel(null)
    setXp(0)
    setStationId(STATIONS[0].id)
    setScreen('mission')
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <TopBar
        mode={mode}
        setMode={setMode}
        mission={mission}
        screen={screen}
        built={built}
        total={STATIONS.length}
        parts={totalPicks(picks)}
        xp={xp}
        onHome={() => (missionId ? setScreen('path') : restart())}
      />

      {screen === 'mission' && <MissionSelect mode={mode} onPick={startMission} onRefs={openRefs} />}

      {screen === 'path' && (
        <PathMap
          mode={mode}
          mission={mission}
          picks={picks}
          built={built}
          allDone={allDone}
          onOpen={goto}
          onFinish={finish}
        />
      )}

      {screen === 'build' && (
        <StationView
          station={getStation(stationId)}
          picks={picks}
          mode={mode}
          missionId={missionId}
          xp={xp}
          onToggle={togglePick}
          onUpdate={updatePick}
          onGoto={goto}
          onBackToPath={() => setScreen('path')}
          onFinish={finish}
        />
      )}

      {screen === 'review' && (
        <Review
          missionId={missionId}
          picks={picks}
          mode={mode}
          xp={xp}
          onGoto={goto}
          onRestart={restart}
          onRefs={openRefs}
          onShop={() => {
            setScreen('parts')
            window.scrollTo({ top: 0 })
          }}
          wholeModel={wholeModel}
          onWholeModel={(m) => {
            setWholeModel(m)
            award(XP.sketch, 'You drew your satellite!')
          }}
        />
      )}

      {screen === 'parts' && (
        <PartsList
          picks={picks}
          mode={mode}
          onBack={() => setScreen('review')}
          onBuild={() => {
            setScreen('guide')
            window.scrollTo({ top: 0 })
          }}
        />
      )}

      {screen === 'guide' && (
        <BuildGuide
          picks={picks}
          mode={mode}
          onBack={() => setScreen('parts')}
          onAward={award}
          onDone={() => setScreen('review')}
        />
      )}

      {screen === 'refs' && <References mode={mode} onBack={() => setScreen(prevScreen)} />}

      <XpToast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}
