import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  focus: { pos: [number, number, number]; target: [number, number, number] } | null
  reduced?: boolean
  onClearFocus?: () => void
  resetKey?: number
}

const TEX = (p: string) => `${import.meta.env.BASE_URL}tex/${p}`
const ENV = (p: string) => `${import.meta.env.BASE_URL}env/${p}`
const FOL = (p: string) => `${import.meta.env.BASE_URL}models/foliage/${p}`

const DEFAULTS = { theta: 0.62, phi: 1.12, radius: 16.5, target: new THREE.Vector3(0, 1.7, 0) }

/** Luxury villa: HDRI sunset IBL, PBR materials from scanned textures, alpha-foliage trees. */
export default function VillaCanvas({ focus, reduced, onClearFocus, resetKey = 0 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef(focus)
  focusRef.current = focus
  const clearCbRef = useRef(onClearFocus)
  clearCbRef.current = onClearFocus
  const resetRef = useRef(resetKey)
  resetRef.current = resetKey

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    const disposables: Array<{ dispose: () => void }> = []
    const track = <T extends { dispose: () => void }>(x: T): T => {
      disposables.push(x)
      return x
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#1a1410', 0.012)

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 500)
    camera.position.set(11, 6, 13)

    const renderer = new THREE.WebGLRenderer({ antialias: !reduced, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, reduced ? 1.25 : 1.8))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = !reduced
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    // ---------- Real HDRI environment: sunset sky, image-based lighting + backdrop ----------
    const pmrem = new THREE.PMREMGenerator(renderer)
    new THREE.TextureLoader().load(ENV('sunset_2k.hdr'), (hdr) => {
      if (disposed) {
        hdr.dispose()
        return
      }
      hdr.mapping = THREE.EquirectangularReflectionMapping
      hdr.colorSpace = THREE.SRGBColorSpace
      track(hdr)
      const env = pmrem.fromEquirectangular(hdr).texture
      track(env)
      scene.environment = env
      scene.background = hdr
      scene.backgroundIntensity = 0.9
      scene.backgroundBlurriness = 0.12
      pmrem.dispose()
    })

    // ---------- Texture helper ----------
    const loader = new THREE.TextureLoader()
    const tex = (path: string, rx = 1, ry = 1, srgb = true) => {
      const t = loader.load(path)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(rx, ry)
      t.anisotropy = maxAniso
      if (srgb) t.colorSpace = THREE.SRGBColorSpace
      return track(t)
    }
    const pbr = (name: string, rx = 1, ry = 1) => ({
      map: tex(TEX(`${name}/diffuse.jpg`), rx, ry),
      normalMap: tex(TEX(`${name}/normal.jpg`), rx, ry, false),
      roughnessMap: tex(TEX(`${name}/rough.jpg`), rx, ry, false),
      aoMap: tex(TEX(`${name}/ao.jpg`), rx, ry, false),
    })

    // ---------- Materials (real scanned PBR) ----------
    const plaster = track(
      new THREE.MeshStandardMaterial({ ...pbr('plastered_wall_02', 2.2, 1.4), roughness: 0.9, metalness: 0 }),
    )
    const concrete = track(
      new THREE.MeshStandardMaterial({ ...pbr('concrete_wall_004', 3, 3), roughness: 0.85, metalness: 0.02 }),
    )
    const oak = track(new THREE.MeshStandardMaterial({ ...pbr('oak_veneer_01', 1.2, 1.2), roughness: 0.6, metalness: 0 }))
    const marble = track(
      new THREE.MeshStandardMaterial({ ...pbr('marble_01', 1.5, 1.5), roughness: 0.18, metalness: 0.05 }),
    )
    const grass = track(
      new THREE.MeshStandardMaterial({ ...pbr('forrest_ground_01', 9, 9), roughness: 1, metalness: 0 }),
    )
    const rock = track(
      new THREE.MeshStandardMaterial({ ...pbr('coast_sand_rocks_02', 7, 7), roughness: 0.95, metalness: 0 }),
    )
    const darkMetal = track(new THREE.MeshStandardMaterial({ color: '#2e333b', roughness: 0.45, metalness: 0.85 }))

    const glass = reduced
      ? track(new THREE.MeshStandardMaterial({ color: '#a8c8d4', metalness: 0.25, roughness: 0.12, transparent: true, opacity: 0.45 }))
      : track(
          new THREE.MeshPhysicalMaterial({
            color: '#a8c8d4',
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.85,
            thickness: 0.4,
            transparent: true,
            opacity: 0.55,
          }),
        )
    const warmWindow = track(
      new THREE.MeshStandardMaterial({
        color: '#ffd9a0',
        emissive: '#ffb45e',
        emissiveIntensity: 1.5,
        roughness: 0.35,
      }),
    )
    const water = reduced
      ? track(new THREE.MeshStandardMaterial({ color: '#17756d', roughness: 0.12, metalness: 0.5, transparent: true, opacity: 0.92 }))
      : track(
          new THREE.MeshPhysicalMaterial({
            color: '#17756d',
            roughness: 0.08,
            metalness: 0.35,
            transmission: 0.55,
            thickness: 0.8,
            transparent: true,
            opacity: 0.9,
          }),
        )
    const flame = track(
      new THREE.MeshStandardMaterial({ color: '#ffb45e', emissive: '#ff8a2a', emissiveIntensity: 2.4, roughness: 0.6 }),
    )

    // ---------- Ground / terrain ----------
    const ground = new THREE.Mesh(new THREE.CircleGeometry(90, 48), grass)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.02
    ground.receiveShadow = !reduced
    scene.add(ground)

    // Rock cliff ring so the villa sits on a hillside above the HDRI horizon
    const cliff = new THREE.Mesh(new THREE.CylinderGeometry(46, 52, 7, 40, 1, true), rock)
    cliff.position.y = -3.8
    scene.add(cliff)

    const group = new THREE.Group()
    scene.add(group)

    const addBox = (
      w: number, h: number, d: number, x: number, y: number, z: number,
      mat: THREE.Material, ry = 0,
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      m.position.set(x, y, z)
      m.rotation.y = ry
      m.castShadow = !reduced
      m.receiveShadow = !reduced
      group.add(m)
      return m
    }

    // ---------- Deck + pool ----------
    const deck = addBox(17, 0.3, 12.5, 0, 0.15, 1, concrete)
    deck.position.set(0, 0.15, 1)

    const coping = addBox(8.1, 0.18, 3.9, 0.6, 0.36, 6.1, marble)
    coping.castShadow = false
    const poolWater = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.5, 3.4), water)
    poolWater.position.set(0.6, 0.28, 6.1)
    group.add(poolWater)
    const poolInner = new THREE.Mesh(
      new THREE.BoxGeometry(7.4, 0.46, 3.2),
      track(new THREE.MeshStandardMaterial({ color: '#0b4f4a', emissive: '#0d5f58', emissiveIntensity: 0.45, roughness: 0.35 })),
    )
    poolInner.position.set(0.6, 0.24, 6.1)
    group.add(poolInner)

    // Loungers
    const loungerMat = track(new THREE.MeshStandardMaterial({ color: '#e8e0cf', roughness: 0.9 }))
    ;[-2.6, -0.9, 0.8].forEach((x) => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.6), loungerMat)
      l.position.set(x, 0.38, 4)
      l.rotation.y = 0.1
      l.castShadow = !reduced
      group.add(l)
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.6), loungerMat)
      back.position.set(x - 0.65, 0.55, 4)
      group.add(back)
    })

    // Fire pit
    const pit = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.4, 24), marble)
    pit.position.set(-5.2, 0.5, 5.2)
    pit.castShadow = !reduced
    group.add(pit)
    const fire = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.55, 12), flame)
    fire.position.set(-5.2, 0.92, 5.2)
    group.add(fire)
    const fireLight = new THREE.PointLight('#ff8a3a', 1.6, 9, 2)
    fireLight.position.set(-5.2, 1.3, 5.2)
    scene.add(fireLight)

    // ---------- Villa massing ----------
    // Ground floor: glass living pavilion with plaster core
    addBox(9.5, 3.2, 7, 0, 1.9, 0, plaster)
    addBox(9.7, 2.4, 7.2, 0, 1.95, 0.05, glass).castShadow = false
    addBox(3.4, 2.2, 0.15, 0, 1.6, 3.62, warmWindow)
    addBox(0.15, 2.2, 5.5, 4.85, 1.6, 0, warmWindow)
    for (let i = -2; i <= 2; i++) addBox(0.08, 2.4, 0.08, i * 1.9, 1.95, 3.7, darkMetal)

    // Oak entry portal + pivot door
    addBox(0.3, 3.1, 0.3, -2.6, 1.7, 3.6, oak)
    addBox(0.3, 3.1, 0.3, -0.6, 1.7, 3.6, oak)
    addBox(1.7, 2.9, 0.14, -1.6, 1.6, 3.62, oak)

    // Upper cantilevered bedroom volume
    addBox(11.5, 2.9, 6, -0.8, 5.25, -0.6, plaster)
    addBox(11.7, 2.1, 6.2, -0.8, 5.25, -0.45, glassDim()).castShadow = false
    addBox(2.6, 1.9, 0.15, -3.6, 5.2, 2.75, warmWindow)
    addBox(2.2, 1.9, 0.15, 1.9, 5.2, 2.75, warmWindow)

    // Rooftop lounge volume
    addBox(6.5, 2.3, 5, 1.6, 8.35, -1.5, plaster)
    addBox(6.7, 1.7, 5.2, 1.6, 8.4, -1.35, glassDim()).castShadow = false
    addBox(4.5, 1.4, 0.15, 1.6, 8.1, 1.15, warmWindow)

    // Slab roofs with slim fascias
    addBox(12.9, 0.3, 7, -0.8, 6.85, -0.6, concrete)
    addBox(7.3, 0.28, 5.7, 1.6, 9.65, -1.5, concrete)

    // Slender steel columns under the cantilever
    ;[[-5.6, 3.2], [-2, 3.2], [1.6, 3.2], [5.2, 3.2]].forEach(([x, z]) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.5, 8), darkMetal)
      c.position.set(x, 1.85, z)
      c.castShadow = !reduced
      group.add(c)
    })

    // Oak slat feature wall
    for (let i = 0; i < 9; i++) addBox(0.12, 3.1, 0.5, -5.2 + i * 0.28, 1.9, -3.35, oak)

    // Marble garden path
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.9), marble)
      p.position.set(6.4 + i * 1.7, 0.28 + i * 0.14, 4.6 - i * 1.35)
      p.rotation.y = 0.18
      p.receiveShadow = !reduced
      group.add(p)
    }

    function glassDim() {
      return reduced
        ? track(new THREE.MeshStandardMaterial({ color: '#7da4b0', metalness: 0.2, roughness: 0.2, transparent: true, opacity: 0.38 }))
        : track(
            new THREE.MeshPhysicalMaterial({
              color: '#7da4b0',
              metalness: 0.1,
              roughness: 0.1,
              transmission: 0.7,
              thickness: 0.4,
              transparent: true,
              opacity: 0.4,
            }),
          )
    }

    // ---------- Trees: scanned foliage on alpha-tested cards ----------
    const leavesDiff = tex(FOL('leaves_diff.jpg'), 1, 1)
    const leavesAlpha = tex(FOL('leaves_alpha.jpg'), 1, 1, false)
    const trunkDiff = tex(FOL('trunk_diff.jpg'), 1, 1)
    const trunkNormal = tex(FOL('trunk_normal.jpg'), 1, 1, false)
    const leafMat = track(
      new THREE.MeshStandardMaterial({
        map: leavesDiff,
        alphaMap: leavesAlpha,
        transparent: true,
        alphaTest: 0.42,
        side: THREE.DoubleSide,
        roughness: 0.95,
        metalness: 0,
      }),
    )
    const trunkMat = track(new THREE.MeshStandardMaterial({ map: trunkDiff, normalMap: trunkNormal, roughness: 0.9 }))

    const addTree = (x: number, z: number, s = 1) => {
      const t = new THREE.Group()
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * s, 0.17 * s, 2.1 * s, 7), trunkMat)
      trunk.position.y = 1.05 * s
      trunk.castShadow = !reduced
      t.add(trunk)
      const cards = [
        { w: 2.6, h: 2.6, y: 2.9, ry: 0 },
        { w: 2.4, h: 2.4, y: 3.3, ry: Math.PI / 3 },
        { w: 2.2, h: 2.2, y: 3.7, ry: (Math.PI * 2) / 3 },
        { w: 1.9, h: 1.9, y: 2.5, ry: Math.PI / 6 },
      ]
      cards.forEach((c) => {
        const card = new THREE.Mesh(new THREE.PlaneGeometry(c.w * s, c.h * s), leafMat)
        card.position.y = c.y * s
        card.rotation.y = c.ry
        t.add(card)
      })
      t.position.set(x, 0, z)
      t.rotation.y = Math.random() * Math.PI * 2
      group.add(t)
    }
    const treeSpots: Array<[number, number, number]> = [
      [-7.5, 4.5, 1], [-6.8, 5.8, 0.85], [6.6, 5.4, 0.95], [7.8, 3.2, 0.8],
      [-7.2, -4.5, 1.05], [7.4, -5, 0.9], [-6, -5.6, 0.85], [6.2, -5.9, 1],
    ]
    const treeCount = reduced ? Math.ceil(treeSpots.length / 2) : treeSpots.length
    for (let i = 0; i < treeCount; i++) {
      const [x, z, s] = treeSpots[i]
      addTree(x, z, s * (0.9 + Math.random() * 0.25))
    }
    // Hedges
    const hedgeMat = track(new THREE.MeshStandardMaterial({ color: '#2d5236', roughness: 1 }))
    for (let i = 0; i < 6; i++) {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 0.6), hedgeMat)
      hedge.position.set(-6.5 + i * 2.6, 0.42, 8)
      hedge.castShadow = !reduced
      group.add(hedge)
    }

    // ---------- Lighting: HDRI does the heavy lift; add dusk key + warm interiors ----------
    const sun = new THREE.DirectionalLight('#ffb066', 1.5)
    sun.position.set(16, 9, -11)
    if (!reduced) {
      sun.castShadow = true
      sun.shadow.mapSize.set(1024, 1024)
      sun.shadow.camera.near = 1
      sun.shadow.camera.far = 80
      const s = 22
      Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s })
    }
    scene.add(sun)
    const fill = new THREE.DirectionalLight('#9db4d6', 0.35)
    fill.position.set(-14, 18, -8)
    scene.add(fill)
    const poolLight = new THREE.PointLight('#54d1c9', 1.4, 15, 2)
    poolLight.position.set(0.6, 1.2, 6)
    scene.add(poolLight)
    const interior = new THREE.PointLight('#ffc98a', 1.6, 20, 2)
    interior.position.set(0, 2.7, 0)
    scene.add(interior)

    // ---------- Atmosphere particles ----------
    let particles: THREE.Points | null = null
    if (!reduced) {
      const count = 200
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 44
        pos[i * 3 + 1] = Math.random() * 11 + 0.5
        pos[i * 3 + 2] = (Math.random() - 0.5) * 44
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      particles = new THREE.Points(
        geo,
        new THREE.PointsMaterial({ color: '#e8c98a', size: 0.055, transparent: true, opacity: 0.5, sizeAttenuation: true }),
      )
      scene.add(particles)
    }

    // ---------- Orbit controls ----------
    const spherical = new THREE.Spherical()
    const controls = {
      theta: DEFAULTS.theta, phi: DEFAULTS.phi, radius: DEFAULTS.radius,
      target: DEFAULTS.target.clone(),
      tTheta: DEFAULTS.theta, tPhi: DEFAULTS.phi, tRadius: DEFAULTS.radius,
      tTarget: DEFAULTS.target.clone(),
    }

    const el = renderer.domElement
    el.style.touchAction = 'none'
    el.style.cursor = 'grab'
    let dragging = false
    let px = 0, py = 0
    let autoTheta = 0
    let lastReset = resetKey

    const hasFocus = () => focusRef.current !== null
    const clearFocus = () => {
      if (focusRef.current) {
        focusRef.current = null
        clearCbRef.current?.()
      }
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      px = e.clientX
      py = e.clientY
      el.style.cursor = 'grabbing'
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      controls.tTheta -= (e.clientX - px) * 0.005
      controls.tPhi = Math.min(1.42, Math.max(0.55, controls.tPhi - (e.clientY - py) * 0.004))
      px = e.clientX
      py = e.clientY
      if (hasFocus()) clearFocus()
    }
    const onUp = () => {
      dragging = false
      el.style.cursor = 'grab'
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      controls.tRadius = Math.min(30, Math.max(7, controls.tRadius + e.deltaY * 0.012))
      if (hasFocus()) clearFocus()
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        const self = onTouch as unknown as { last?: number }
        if (self.last) controls.tRadius = Math.min(30, Math.max(7, controls.tRadius - (dist - self.last) * 0.03))
        self.last = dist
      }
    }
    const onTouchEnd = () => {
      ;(onTouch as unknown as { last?: number }).last = undefined
      if (hasFocus()) clearFocus()
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchmove', onTouch, { passive: false })
    el.addEventListener('touchend', onTouchEnd)

    // ---------- Resize ----------
    const ro = new ResizeObserver(() => {
      if (!mount.clientWidth) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    ro.observe(mount)

    // ---------- Animation ----------
    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (resetRef.current !== lastReset) {
        lastReset = resetRef.current
        controls.tTheta = DEFAULTS.theta
        controls.tPhi = DEFAULTS.phi
        controls.tRadius = DEFAULTS.radius
        controls.tTarget.copy(DEFAULTS.target)
        autoTheta = 0
      }

      const f = focusRef.current
      if (f) {
        controls.tTarget.set(f.target[0], f.target[1], f.target[2])
        const dir = new THREE.Vector3(f.pos[0], f.pos[1], f.pos[2]).sub(
          new THREE.Vector3(f.target[0], f.target[1], f.target[2]),
        )
        spherical.setFromVector3(dir)
        controls.tTheta = spherical.theta
        controls.tPhi = THREE.MathUtils.clamp(spherical.phi, 0.55, 1.42)
        controls.tRadius = THREE.MathUtils.clamp(dir.length(), 7, 30)
      }

      controls.theta += (controls.tTheta - controls.theta) * 0.06
      controls.phi += (controls.tPhi - controls.phi) * 0.06
      controls.radius += (controls.tRadius - controls.radius) * 0.06
      controls.target.lerp(controls.tTarget, 0.06)

      if (!dragging && !focusRef.current) autoTheta += 0.0016
      const theta = controls.theta + (focusRef.current ? 0 : autoTheta)

      camera.position.set(
        controls.target.x + controls.radius * Math.sin(controls.phi) * Math.sin(theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * Math.sin(controls.phi) * Math.cos(theta),
      )
      camera.lookAt(controls.target)

      poolLight.intensity = 1.3 + Math.sin(t * 2.1) * 0.25
      fire.scale.y = 1 + Math.sin(t * 9) * 0.16
      fire.scale.x = 1 + Math.cos(t * 7.3) * 0.1
      fireLight.intensity = 1.5 + Math.sin(t * 8.2) * 0.5
      poolInner.position.y = 0.24 + Math.sin(t * 1.3) * 0.02
      if (particles) particles.rotation.y = t * 0.014

      renderer.render(scene, camera)
    }
    animate()

    // ---------- Cleanup ----------
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('touchend', onTouchEnd)
      renderer.dispose()
      pmrem.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
      disposables.forEach((d) => d.dispose())
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
  }, [reduced])

  return <div ref={mountRef} className="absolute inset-0" aria-label="Interactive 3D villa model" role="img" />
}
