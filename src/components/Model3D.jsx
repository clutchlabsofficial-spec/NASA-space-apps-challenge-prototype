import { useEffect, useRef, useState } from 'react'

// three.js is loaded on demand — it is the largest thing in the bundle and most
// visitors never reach a 3D model.
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

// The spacecraft palette. Lifted well above the page's own near-black ground —
// a model painted in background colours reads as a silhouette, and the point is
// for a child to see the thing they drew.
const MATERIALS = {
  body: { color: 0xb9a8d8, roughness: 0.5, metalness: 0.2 },
  panel: { color: 0x4b5fa8, roughness: 0.25, metalness: 0.7 },
  accent: { color: 0xc89bff, roughness: 0.3, metalness: 0.15 },
  metal: { color: 0xd6d2de, roughness: 0.22, metalness: 0.9 },
  gold: { color: 0xe8c169, roughness: 0.28, metalness: 0.85 },
  lens: { color: 0x8f6ab5, roughness: 0.06, metalness: 0.6 },
}

// Thin plates and open dishes have no back face of their own, so without this
// they vanish as soon as the model turns away.
const TWO_SIDED = new Set(['panel', 'dish'])

function geometryFor(THREE, part) {
  const [w, h, d] = part.size
  switch (part.shape) {
    case 'panel':
      return new THREE.BoxGeometry(w, h, Math.min(d, 0.12))
    case 'cylinder':
      return new THREE.CylinderGeometry(w, w, h, 24)
    case 'rod':
      return new THREE.CylinderGeometry(Math.min(w, 0.14), Math.min(w, 0.14), h, 12)
    case 'dish':
      // An open paraboloid, near enough: a wide shallow sphere segment.
      return new THREE.SphereGeometry(w, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2.6)
    case 'sphere':
      return new THREE.SphereGeometry(w, 24, 18)
    case 'cone':
      return new THREE.ConeGeometry(w, h, 22)
    case 'box':
    default:
      return new THREE.BoxGeometry(w, h, d)
  }
}

export default function Model3D({ model, onPartHover }) {
  const mountRef = useRef(null)
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

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.15
        renderer.setSize(width, height)
        mount.appendChild(renderer.domElement)

        // Sunlight, planet-shine and a cold rim — roughly the three sources a
        // spacecraft actually sees, and enough fill that nothing goes to black.
        scene.add(new THREE.HemisphereLight(0xdcd0f5, 0x3a2a55, 1.5))
        const sun = new THREE.DirectionalLight(0xfff6e6, 3.2)
        sun.position.set(6, 8, 7)
        scene.add(sun)
        const earthshine = new THREE.DirectionalLight(0x7fa6ff, 1.0)
        earthshine.position.set(-4, -6, 2)
        scene.add(earthshine)
        const rim = new THREE.DirectionalLight(0xc89bff, 1.6)
        rim.position.set(-7, 3, -6)
        scene.add(rim)

        const group = new THREE.Group()
        const meshes = []
        for (const part of model.parts) {
          const spec = MATERIALS[part.material] || MATERIALS.body
          const mesh = new THREE.Mesh(
            geometryFor(THREE, part),
            new THREE.MeshStandardMaterial({
              ...spec,
              side: TWO_SIDED.has(part.shape) ? THREE.DoubleSide : THREE.FrontSide,
            }),
          )
          mesh.position.set(...part.position)
          const [rx, ry, rz] = part.rotation || [0, 0, 0]
          mesh.rotation.set((rx * Math.PI) / 180, (ry * Math.PI) / 180, (rz * Math.PI) / 180)
          mesh.userData.label = part.label
          group.add(mesh)
          meshes.push(mesh)
        }
        scene.add(group)

        // Frame whatever was built, whatever scale the model came back in.
        const box = new THREE.Box3().setFromObject(group)
        const centre = box.getCenter(new THREE.Vector3())
        const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 1)
        group.position.sub(centre)
        // Fill the frame: place the camera at the distance where a sphere of
        // this radius just fits the vertical field of view, plus a small margin.
        const fitDistance = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.78
        camera.position.set(fitDistance * 0.55, fitDistance * 0.34, fitDistance * 0.78)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.autoRotate = true
        controls.autoRotateSpeed = 1.1
        controls.enablePan = false
        controls.minDistance = radius * 0.9
        controls.maxDistance = radius * 6
        controls.target.set(0, 0, 0)
        // Spinning it yourself is the point; stop nagging once they take over.
        controls.addEventListener('start', () => {
          controls.autoRotate = false
        })

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        const onMove = (e) => {
          if (!onPartHover) return
          const r = renderer.domElement.getBoundingClientRect()
          pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
          pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
          raycaster.setFromCamera(pointer, camera)
          const hit = raycaster.intersectObjects(meshes, false)[0]
          onPartHover(hit?.object.userData.label || null)
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

        let raf
        const tick = () => {
          controls.update()
          renderer.render(scene, camera)
          raf = requestAnimationFrame(tick)
        }
        tick()

        cleanup = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          renderer.domElement.removeEventListener('pointermove', onMove)
          controls.dispose()
          meshes.forEach((m) => {
            m.geometry.dispose()
            m.material.dispose()
          })
          renderer.dispose()
          if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
        }
      })
      .catch(() => setFailed(true))

    return () => {
      disposed = true
      cleanup()
    }
  }, [model, onPartHover])

  if (failed) return <div className="model3d model3d--msg mono">3D viewer could not start</div>

  return (
    <div className="model3d" ref={mountRef}>
      {!ready && <span className="model3d__loading mono">Warming up the 3D view…</span>}
    </div>
  )
}
