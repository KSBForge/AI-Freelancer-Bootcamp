import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  focus: { pos: [number, number, number]; target: [number, number, number] } | null
  reduced?: boolean
  onClearFocus?: () => void
}

/** Procedural luxury villa built from primitives — cinematic lighting, orbit + hotspot camera. */
export default function VillaCanvas({ focus, reduced, onClearFocus }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef(focus)
  focusRef.current = focus
  const clearCbRef = useRef(onClearFocus)
  clearCbRef.current = onClearFocus

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#05070b')
    scene.fog = new THREE.FogExp2('#05070b', 0.028)

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.set(11, 6, 12)

    const renderer = new THREE.WebGLRenderer({ antialias: !reduced, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, reduced ? 1.25 : 1.8))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = !reduced
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    // ---------- Lighting: cinematic dusk ----------
    scene.add(new THREE.AmbientLight('#24303f', 0.9))
    const moon = new THREE.DirectionalLight('#9db4d6', 0.55)
    moon.position.set(-14, 18, -8)
    scene.add(moon)

    const sun = new THREE.DirectionalLight('#ffb066', 1.35)
    sun.position.set(16, 8, -12)
    if (!reduced) {
      sun.castShadow = true
      sun.shadow.mapSize.set(1024, 1024)
      sun.shadow.camera.near = 1
      sun.shadow.camera.far = 80
      const s = 22
      Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s })
    }
    scene.add(sun)

    const poolLight = new THREE.PointLight('#54d1c9', 1.4, 16, 2)
    poolLight.position.set(0, 1.2, 6.5)
    scene.add(poolLight)

    const interior = new THREE.PointLight('#ffc98a', 1.5, 20, 2)
    interior.position.set(0, 2.6, 0)
    scene.add(interior)

    // ---------- Materials ----------
    const concrete = new THREE.MeshStandardMaterial({ color: '#b9b2a4', roughness: 0.92, metalness: 0.05 })
    const darkConcrete = new THREE.MeshStandardMaterial({ color: '#5b564d', roughness: 0.95 })
    const wood = new THREE.MeshStandardMaterial({ color: '#8a6844', roughness: 0.7 })
    const glass = reduced
      ? new THREE.MeshStandardMaterial({ color: '#9fc4cf', metalness: 0.2, roughness: 0.15, transparent: true, opacity: 0.5 })
      : new THREE.MeshPhysicalMaterial({
          color: '#9fc4cf',
          metalness: 0.1,
          roughness: 0.06,
          transmission: 0.85,
          thickness: 0.4,
          transparent: true,
          opacity: 0.55,
        })
    const glassDim = reduced
      ? new THREE.MeshStandardMaterial({ color: '#7da4b0', metalness: 0.2, roughness: 0.2, transparent: true, opacity: 0.38 })
      : new THREE.MeshPhysicalMaterial({
          color: '#7da4b0',
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.7,
          thickness: 0.4,
          transparent: true,
          opacity: 0.4,
        })
    const warmWindow = new THREE.MeshStandardMaterial({
      color: '#ffd9a0',
      emissive: '#ffb45e',
      emissiveIntensity: 1.6,
      roughness: 0.4,
    })
    const water = reduced
      ? new THREE.MeshStandardMaterial({ color: '#1e6f6a', roughness: 0.15, metalness: 0.5, transparent: true, opacity: 0.9 })
      : new THREE.MeshPhysicalMaterial({
          color: '#1e6f6a',
          roughness: 0.12,
          metalness: 0.4,
          transmission: 0.5,
          thickness: 0.6,
          transparent: true,
          opacity: 0.85,
        })

    const group = new THREE.Group()
    scene.add(group)

    // ---------- Ground / site ----------
    const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshStandardMaterial({ color: '#11151d', roughness: 1 }))
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.02
    scene.add(ground)

    const deck = new THREE.Mesh(new THREE.BoxGeometry(16, 0.25, 12), darkConcrete)
    deck.position.set(0, 0.12, 1)
    deck.receiveShadow = true
    group.add(deck)

    // ---------- Main volume (ground floor) ----------
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

    // Ground floor: glass living pavilion
    addBox(9.5, 3.2, 7, 0, 1.85, 0, concrete) // core walls
    addBox(9.7, 2.4, 7.2, 0, 1.9, 0.05, glass).castShadow = false // glass skin
    addBox(3.2, 2.2, 0.15, 0, 1.55, 3.62, warmWindow) // glowing living room window
    addBox(0.15, 2.2, 5.5, 4.85, 1.55, 0, warmWindow) // side glazing
    // mullions
    for (let i = -2; i <= 2; i++) addBox(0.08, 2.4, 0.08, i * 1.9, 1.9, 3.7, darkConcrete)

    // Upper cantilevered volume (bedrooms)
    addBox(11, 2.9, 6, -0.8, 5.15, -0.6, concrete)
    addBox(11.2, 2.1, 6.2, -0.8, 5.15, -0.45, glassDim).castShadow = false
    addBox(2.6, 1.9, 0.15, -3.4, 5.1, 2.75, warmWindow) // bedroom glazing
    addBox(2.2, 1.9, 0.15, 1.8, 5.1, 2.75, warmWindow)

    // Rooftop lounge
    addBox(6.5, 2.3, 5, 1.5, 8.15, -1.5, concrete)
    addBox(6.7, 1.7, 5.2, 1.5, 8.2, -1.35, glassDim).castShadow = false
    addBox(4.5, 1.4, 0.15, 1.5, 7.9, 1.15, warmWindow)

    // Slab roof planes
    addBox(12.4, 0.28, 6.8, -0.8, 6.75, -0.6, concrete)
    addBox(7.2, 0.26, 5.6, 1.5, 9.45, -1.5, concrete)

    // Thin steel columns
    const colMat = new THREE.MeshStandardMaterial({ color: '#3c4148', roughness: 0.5, metalness: 0.7 })
    ;[[-5.6, 3.2], [-2, 3.2], [1.6, 3.2], [5.2, 3.2]].forEach(([x, z]) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.4, 8), colMat)
      c.position.set(x, 1.75, z)
      group.add(c)
    })

    // Wood slat feature wall
    for (let i = 0; i < 9; i++) {
      addBox(0.12, 3.1, 0.5, -5.2 + i * 0.28, 1.85, -3.35, wood)
    }

    // ---------- Infinity pool ----------
    const pool = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.5, 3.4), water)
    pool.position.set(0.6, 0.32, 6.2)
    group.add(pool)
    const poolInner = new THREE.Mesh(
      new THREE.BoxGeometry(7.3, 0.48, 3.2),
      new THREE.MeshStandardMaterial({ color: '#0d4f4c', emissive: '#0e5f5a', emissiveIntensity: 0.5, roughness: 0.3 }),
    )
    poolInner.position.set(0.6, 0.3, 6.2)
    group.add(poolInner)

    // Pool loungers
    const loungerMat = new THREE.MeshStandardMaterial({ color: '#d8cbb2', roughness: 0.9 })
    ;[[-2.4], [-0.9], [0.6]].forEach(([x]) => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.55), loungerMat)
      l.position.set(x, 0.32, 4.1)
      l.rotation.y = 0.12
      group.add(l)
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.55), loungerMat)
      back.position.set(x - 0.6, 0.5, 4.1)
      group.add(back)
    })

    // ---------- Garden ----------
    const hedgeMat = new THREE.MeshStandardMaterial({ color: '#274a30', roughness: 1 })
    const addTree = (x: number, z: number, s = 1) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * s, 0.12 * s, 1.1 * s, 6), wood)
      trunk.position.set(x, 0.6 * s, z)
      group.add(trunk)
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.75 * s, 10, 8), hedgeMat)
      crown.position.set(x, 1.5 * s, z)
      crown.scale.y = 1.25
      group.add(crown)
    }
    ;[[-7.5, 4.5], [-6.8, 5.6], [6.8, 4.8], [7.6, 3.4], [-7.2, -4.5], [7.4, -5], [-6, -5.4], [6.2, -5.8]].forEach(
      ([x, z]) => addTree(x, z, 0.9 + Math.random() * 0.5),
    )
    for (let i = 0; i < 6; i++) {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 0.6), hedgeMat)
      hedge.position.set(-6.5 + i * 2.6, 0.4, 7.8)
      group.add(hedge)
    }

    // ---------- Floating stone steps ----------
    for (let i = 0; i < 4; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.8), concrete)
      step.position.set(5.6, 0.2 + i * 0.32, 3.4 - i * 0.9)
      group.add(step)
    }

    // ---------- Atmosphere particles ----------
    let particles: THREE.Points | null = null
    if (!reduced) {
      const count = 220
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 40
        pos[i * 3 + 1] = Math.random() * 10 + 0.5
        pos[i * 3 + 2] = (Math.random() - 0.5) * 40
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      particles = new THREE.Points(
        geo,
        new THREE.PointsMaterial({ color: '#c8a45f', size: 0.06, transparent: true, opacity: 0.5, sizeAttenuation: true }),
      )
      scene.add(particles)
    }

    // ---------- Remote mountains silhouette ----------
    const mountainMat = new THREE.MeshStandardMaterial({ color: '#0a0e15', roughness: 1 })
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(new THREE.ConeGeometry(8 + Math.random() * 7, 6 + Math.random() * 7, 5), mountainMat)
      const a = Math.random() * Math.PI * 2
      m.position.set(Math.cos(a) * 42, 2.2, Math.sin(a) * 42)
      scene.add(m)
    }

    // ---------- Orbit controls (hand-rolled, no addon import needed) ----------
    const spherical = new THREE.Spherical()
    const controls = {
      theta: 0.62, phi: 1.12, radius: 15.5,
      target: new THREE.Vector3(0, 1.6, 0),
      tTheta: 0.62, tPhi: 1.12, tRadius: 15.5,
      tTarget: new THREE.Vector3(0, 1.6, 0),
    }

    const el = renderer.domElement
    el.style.touchAction = 'none'
    el.style.cursor = 'grab'
    let dragging = false
    let px = 0, py = 0
    let autoTheta = 0

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
      controls.tRadius = Math.min(26, Math.max(7, controls.tRadius + e.deltaY * 0.012))
      if (hasFocus()) clearFocus()
    }
    const hasFocus = () => focusRef.current !== null
    const clearFocus = () => {
      const f = focusRef.current
      if (f) {
        controls.tTarget.set(0, 1.6, 0)
        focusRef.current = null
        onClearFocus?.()
      }
    }

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        if ((onTouch as unknown as { last?: number }).last) {
          const prev = (onTouch as unknown as { last: number }).last
          controls.tRadius = Math.min(26, Math.max(7, controls.tRadius - (dist - prev) * 0.03))
        }
        ;(onTouch as unknown as { last?: number }).last = dist
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

    // ---------- Animation loop ----------
    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Hotspot focus transitions
      const f = focusRef.current
      if (f) {
        controls.tTarget.set(f.target[0], f.target[1], f.target[2])
        const dir = new THREE.Vector3(f.pos[0], f.pos[1], f.pos[2]).sub(
          new THREE.Vector3(f.target[0], f.target[1], f.target[2]),
        )
        spherical.setFromVector3(dir)
        controls.tTheta = spherical.theta
        controls.tPhi = THREE.MathUtils.clamp(spherical.phi, 0.55, 1.42)
        controls.tRadius = THREE.MathUtils.clamp(dir.length(), 7, 26)
      }

      // Smooth damping
      controls.theta += (controls.tTheta - controls.theta) * 0.06
      controls.phi += (controls.tPhi - controls.phi) * 0.06
      controls.radius += (controls.tRadius - controls.radius) * 0.06
      controls.target.lerp(controls.tTarget, 0.06)

      // Gentle auto-rotation when idle
      if (!dragging && !focusRef.current) autoTheta += 0.0016
      const theta = controls.theta + (focusRef.current ? 0 : autoTheta)

      camera.position.set(
        controls.target.x + controls.radius * Math.sin(controls.phi) * Math.sin(theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * Math.sin(controls.phi) * Math.cos(theta),
      )
      camera.lookAt(controls.target)

      // Water shimmer
      poolLight.intensity = 1.3 + Math.sin(t * 2.1) * 0.25
      poolInner.position.y = 0.3 + Math.sin(t * 1.3) * 0.02

      if (particles) particles.rotation.y = t * 0.014

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('touchend', onTouchEnd)
      renderer.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
  }, [reduced])

  // Respond to focus changes without rebuilding the scene
  useEffect(() => {
    // handled via focusRef inside animation loop
  }, [focus])

  return <div ref={mountRef} className="absolute inset-0" aria-label="Interactive 3D villa model" role="img" />
}
