import { useEffect, useRef, useState } from 'react'

// three.js is loaded on demand — it is by far the largest thing in the bundle,
// and the first screen should paint long before it arrives.
let threePromise = null
const loadThree = () => {
  if (!threePromise) {
    threePromise = Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js'),
    ]).then(([THREE, { OrbitControls }]) => ({ THREE, OrbitControls }))
  }
  return threePromise
}

// The spacecraft palette. Lifted well above the page's near-black ground — a
// model painted in background colours reads as a silhouette, and the point is
// for a child to see the thing they made.
const MATERIALS = {
  body: { color: 0xb9a8d8, roughness: 0.42, metalness: 0.25 },
  panel: { color: 0x4a63c8, roughness: 0.12, metalness: 0.82 },
  accent: { color: 0xc89bff, roughness: 0.28, metalness: 0.2 },
  metal: { color: 0xd6d2de, roughness: 0.2, metalness: 0.92 },
  gold: { color: 0xe8c169, roughness: 0.24, metalness: 0.9 },
  lens: { color: 0x8f6ab5, roughness: 0.05, metalness: 0.65 },
}

// Thin plates and open dishes have no back face of their own, so without this
// they vanish the moment the model turns away.
const TWO_SIDED = new Set(['panel', 'dish'])

function geometryFor(THREE, p) {
  const [w, h, d] = p.size
  switch (p.shape) {
    case 'panel': return new THREE.BoxGeometry(w, h, Math.min(d, 0.12))
    case 'cylinder': return new THREE.CylinderGeometry(w, w, h, 28)
    case 'rod': return new THREE.CylinderGeometry(Math.min(w, 0.14), Math.min(w, 0.14), h, 14)
    case 'dish': return new THREE.SphereGeometry(w, 30, 18, 0, Math.PI * 2, 0, Math.PI / 2.6)
    case 'sphere': return new THREE.SphereGeometry(w, 26, 20)
    case 'cone': return new THREE.ConeGeometry(w, h, 24)
    case 'box':
    default: return new THREE.BoxGeometry(w, h, d)
  }
}

const keyOf = (p) => `${p.shape}|${p.label}|${p.position.join(',')}|${p.size.join(',')}`

export default function Model3D({ model, variant = 'inline', onPartHover, autoRotate = true }) {
  const mountRef = useRef(null)
  const seenRef = useRef(new Set())
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    loadThree()
      .then(({ THREE, OrbitControls }) => {
        const mount = mountRef.current
        if (disposed || !mount) return
        setReady(true)

        const scene = new THREE.Scene()
        const width = mount.clientWidth || 320
        const height = mount.clientHeight || 300

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 400)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(width, height)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        mount.appendChild(renderer.domElement)

        // Sunlight, planet-shine and a cold rim — roughly the three sources a
        // real spacecraft sees, and enough fill that nothing goes to black.
        scene.add(new THREE.HemisphereLight(0xdcd0f5, 0x3a2a55, 1.4))
        const sun = new THREE.DirectionalLight(0xfff6e6, 3.4)
        sun.position.set(6, 8, 7)
        scene.add(sun)
        const earthshine = new THREE.DirectionalLight(0x7fa6ff, 1.1)
        earthshine.position.set(-4, -6, 2)
        scene.add(earthshine)
        const rim = new THREE.DirectionalLight(0xc89bff, 1.7)
        rim.position.set(-7, 3, -6)
        scene.add(rim)

        // A starfield, because the thing is in space and a plain void says
        // nothing. Cheap: one Points object, no textures.
        const starCount = variant === 'hero' ? 900 : 420
        const starPos = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount; i++) {
          const r = 60 + Math.random() * 90
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
          starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
          starPos[i * 3 + 2] = r * Math.cos(phi)
        }
        const starGeo = new THREE.BufferGeometry()
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
        const stars = new THREE.Points(
          starGeo,
          new THREE.PointsMaterial({ color: 0xf0e6ff, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.85 }),
        )
        scene.add(stars)

        const group = new THREE.Group()
        const meshes = []
        // Parts that were not in the previous model animate in, so adding a
        // subsystem is something you see happen rather than something that has
        // silently already happened.
        const seen = seenRef.current
        const entering = []

        for (const p of model.parts) {
          const spec = MATERIALS[p.material] || MATERIALS.body
          const mesh = new THREE.Mesh(
            geometryFor(THREE, p),
            new THREE.MeshStandardMaterial({
              ...spec,
              side: TWO_SIDED.has(p.shape) ? THREE.DoubleSide : THREE.FrontSide,
            }),
          )
          mesh.position.set(...p.position)
          const [rx, ry, rz] = p.rotation || [0, 0, 0]
          mesh.rotation.set((rx * Math.PI) / 180, (ry * Math.PI) / 180, (rz * Math.PI) / 180)
          mesh.userData.label = p.label

          const k = keyOf(p)
          if (!seen.has(k)) {
            mesh.scale.setScalar(0.001)
            entering.push({ mesh, t: 0 })
            seen.add(k)
          }
          group.add(mesh)
          meshes.push(mesh)
        }
        scene.add(group)

        // Frame whatever was built, at whatever scale it came back in.
        const box = new THREE.Box3().setFromObject(group)
        const centre = box.getCenter(new THREE.Vector3())
        const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 1)
        group.position.sub(centre)
        // Margin around the craft, by context. Deployed antennas and booms reach well
        // past the body, so the build view needs more room than a sketch does.
        const MARGIN = { hero: 1.18, build: 1.02, inline: 0.8 }
        const fit = (radius / Math.sin((camera.fov * Math.PI) / 360)) * (MARGIN[variant] ?? 0.8)
        camera.position.set(fit * 0.5, fit * 0.32, fit * 0.8)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.06
        controls.autoRotate = autoRotate
        controls.autoRotateSpeed = variant === 'hero' ? 0.9 : 1.2
        controls.enablePan = false
        controls.minDistance = radius * 0.9
        controls.maxDistance = radius * 6
        controls.target.set(0, 0, 0)
        // Spinning it yourself is the point; stop nagging once they take over.
        controls.addEventListener('start', () => { controls.autoRotate = false })

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        const onMove = (e) => {
          if (!onPartHover) return
          const r = renderer.domElement.getBoundingClientRect()
          pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
          pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
          raycaster.setFromCamera(pointer, camera)
          onPartHover(raycaster.intersectObjects(meshes, false)[0]?.object.userData.label || null)
        }
        renderer.domElement.addEventListener('pointermove', onMove)

        const onResize = () => {
          const w = mount.clientWidth || width
          const h = mount.clientHeight || height
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
        }
        const ro = new ResizeObserver(onResize)
        ro.observe(mount)

        // Do not burn a phone battery rendering a canvas nobody can see.
        let visible = true
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0.01 })
        io.observe(mount)

        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (reduced) controls.autoRotate = false

        let raf
        const clock = new THREE.Clock()
        const tick = () => {
          raf = requestAnimationFrame(tick)
          if (!visible) return
          const dt = clock.getDelta()

          for (let i = entering.length - 1; i >= 0; i--) {
            const e = entering[i]
            e.t = Math.min(1, e.t + dt * (reduced ? 6 : 2.4))
            // Overshoot slightly then settle — parts arrive with a bit of snap.
            const s = reduced ? e.t : 1 + Math.sin(e.t * Math.PI) * 0.16 - (1 - e.t) ** 2
            e.mesh.scale.setScalar(Math.max(0.001, s))
            if (e.t >= 1) {
              e.mesh.scale.setScalar(1)
              entering.splice(i, 1)
            }
          }

          if (!reduced) {
            stars.rotation.y += dt * 0.006
            group.position.y = -centre.y + Math.sin(clock.elapsedTime * 0.6) * radius * 0.012
          }
          controls.update()
          renderer.render(scene, camera)
        }
        tick()

        cleanup = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          io.disconnect()
          renderer.domElement.removeEventListener('pointermove', onMove)
          controls.dispose()
          meshes.forEach((m) => { m.geometry.dispose(); m.material.dispose() })
          starGeo.dispose()
          stars.material.dispose()
          renderer.dispose()
          if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
        }
      })
      .catch(() => setFailed(true))

    return () => { disposed = true; cleanup() }
  }, [model, variant, onPartHover, autoRotate])

  if (failed) return <div className="model3d model3d--msg mono">3D viewer could not start</div>

  return (
    <div className={`model3d model3d--${variant}`} ref={mountRef}>
      {!ready && <span className="model3d__loading mono">Warming up the 3D view…</span>}
    </div>
  )
}
