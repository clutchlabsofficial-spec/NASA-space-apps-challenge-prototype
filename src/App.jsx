import { useState } from 'react'
import './styles/global.css'
import './styles/app.css'
import { STATIONS, getStation } from './data/stations/index.js'
import { getMission } from './data/missions.js'
import TopBar from './components/TopBar.jsx'
import MissionSelect from './components/MissionSelect.jsx'
import StationView from './components/StationView.jsx'
import Review from './components/Review.jsx'
import References from './components/References.jsx'

export default function App() {
  const [mode, setMode] = useState('engineer')
  const [screen, setScreen] = useState('mission') // mission | build | review | refs
  const [prevScreen, setPrevScreen] = useState('mission')
  const [missionId, setMissionId] = useState(null)
  const [stationId, setStationId] = useState(STATIONS[0].id)
  const [picks, setPicks] = useState({})
  const [wholeModel, setWholeModel] = useState(null)

  const mission = missionId ? getMission(missionId) : null

  const startMission = (id) => {
    setMissionId(id)
    setPicks({})
    setWholeModel(null)
    setStationId(STATIONS[0].id)
    setScreen('build')
  }

  const pick = (sid, value) =>
    setPicks((p) => {
      if (value == null) {
        const next = { ...p }
        delete next[sid]
        return next
      }
      return { ...p, [sid]: value }
    })

  const goto = (sid) => {
    setStationId(sid)
    setScreen('build')
  }

  const openRefs = () => {
    setPrevScreen(screen)
    setScreen('refs')
  }

  const restart = () => {
    setMissionId(null)
    setPicks({})
    setWholeModel(null)
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
        picks={picks}
        screen={screen}
        onHome={restart}
      />

      {screen === 'mission' && <MissionSelect mode={mode} onPick={startMission} onRefs={openRefs} />}

      {screen === 'build' && (
        <StationView
          station={getStation(stationId)}
          picks={picks}
          mode={mode}
          missionId={missionId}
          onPick={pick}
          onGoto={goto}
          onFinish={() => {
            setScreen('review')
            window.scrollTo({ top: 0 })
          }}
        />
      )}

      {screen === 'review' && (
        <Review
          missionId={missionId}
          picks={picks}
          mode={mode}
          onGoto={goto}
          onRestart={restart}
          onRefs={openRefs}
          wholeModel={wholeModel}
          onWholeModel={setWholeModel}
        />
      )}

      {screen === 'refs' && <References mode={mode} onBack={() => setScreen(prevScreen)} />}

      <footer className="footer">
        <span className="mono">CubeSat Builder · NASA Space Apps prototype</span>
        <button onClick={openRefs}>References</button>
        <span className="mono" style={{ marginLeft: 'auto' }}>
          Facts sourced from NASA SoA, CubeSat 101, Cal Poly CDS and flown missions
        </span>
      </footer>
    </>
  )
}
