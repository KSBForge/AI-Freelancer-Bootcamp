import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export interface TourRoom {
  id: string
  name: string
  desc: string
  pano: string // path to equirectangular .hdr photo
  thumb: string // preview image for the rail
  /** Initial view direction when entering the room (radians). */
  start?: { lon: number; lat: number }
}

interface Props {
  rooms: TourRoom[]
  activeId: string
  reduced?: boolean
  onRoomClick?: (id: string) => void
}

/**
 * Matterport-style photographic 360° tour: the viewer stands inside a real
 * photo panorama (equirectangular HDRI) and looks around in true 3D
 * perspective. Rooms crossfade as you move through the property.
 */
export default function PanoramaTour({ rooms, activeId, reduced, onRoomClick }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const roomsRef = useRef(rooms)
  roomsRef.current = rooms
  const stateRef = useRef<{
    targetId: string
    current: THREE.Mesh | null
    lon: number
    lat: number
    tLon: number
    tLat: number
    tFov: number
    fov: number
  } | null>(null)
  const clickCbRef = useRef(onRoomClick)
  clickCbRef.current = onRoomClick
  const loadRoomRef = useRef<(room: TourRoom) => void>(() => {})

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
    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / mount.clientHeight, 0.1, 110)

    const renderer = new THREE.WebGLRenderer({ antialias: !reduced, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, reduced ? 1.25 : 1.75))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    const roomMeshes = new Map<string, THREE.Mesh>()
    const rgbeLoader = new RGBELoader()

    const buildMesh = (room: TourRoom, tex: THREE.Texture) => {
      if (roomMeshes.has(room.id)) return
      tex.mapping = THREE.EquirectangularReflectionMapping
      tex.colorSpace = THREE.SRGBColorSpace
      track(tex)
      const geo = track(new THREE.SphereGeometry(50, 60, 40))
      geo.scale(-1, 1, 1)
      const mat = track(
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false }),
      )
      const mesh = new THREE.Mesh(geo, mat)
      mesh.visible = false
      mesh.userData.ready = false
      scene.add(mesh)
      roomMeshes.set(room.id, mesh)
    }

    const loadRoom = (room: TourRoom) => {
      if (roomMeshes.has(room.id)) return
      rgbeLoader.load(
        room.pano,
        (tex) => {
          if (disposed) {
            tex.dispose()
            return
          }
          buildMesh(room, tex)
          const m = roomMeshes.get(room.id)
          if (m) m.userData.ready = true
          renderer.render(scene, camera)
        },
        undefined,
        () => {
          // Fallback: if the .hdr cannot be decoded, show the preview photo instead
          const img = new Image()
          img.onload = () => {
            if (disposed) return
            const tex = new THREE.Texture(img)
            tex.needsUpdate = true
            buildMesh(room, tex)
            const m = roomMeshes.get(room.id)
            if (m) m.userData.ready = true
            renderer.render(scene, camera)
          }
          img.src = room.thumb
        },
      )
    }
    loadRoomRef.current = loadRoom

    // state shared with the animation loop
    const st = {
      targetId: activeId,
      current: null as THREE.Mesh | null,
      lon: 0,
      lat: 0,
      tLon: 0,
      tLat: 0,
      tFov: 72,
      fov: 72,
    }
    stateRef.current = st

    const initial = rooms.find((r) => r.id === activeId) ?? rooms[0]
    if (initial) {
      loadRoom(initial)
      // stays at opacity 0 until the photo is ready; the loop fades it in
      st.lon = st.tLon = initial.start?.lon ?? 0
      st.lat = st.tLat = initial.start?.lat ?? 0
    }

    // ---------- look controls ----------
    const el = renderer.domElement
    el.style.touchAction = 'pan-y'
    el.style.cursor = 'grab'
    let dragging = false
    let px = 0, py = 0
    let moved = 0

    const onDown = (e: PointerEvent) => {
      dragging = true
      moved = 0
      px = e.clientX
      py = e.clientY
      el.style.cursor = 'grabbing'
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - px
      const dy = e.clientY - py
      moved += Math.abs(dx) + Math.abs(dy)
      const k = (st.fov / 72) * 0.16
      st.tLon += dx * k
      st.tLat = Math.max(-72, Math.min(72, st.tLat + dy * k))
      px = e.clientX
      py = e.clientY
    }
    const onUp = () => {
      dragging = false
      el.style.cursor = 'grab'
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      st.tFov = Math.min(95, Math.max(42, st.tFov + e.deltaY * 0.045))
    }
    const onClick = (e: MouseEvent) => {
      if (moved > 8) return // it was a drag, not a click
      clickCbRef.current?.(st.targetId)
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('click', onClick)

    // ---------- resize ----------
    const ro = new ResizeObserver(() => {
      if (!mount.clientWidth) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    ro.observe(mount)

    // ---------- animation: inertia + room crossfade ----------
    let raf = 0
    const clock = new THREE.Clock()
    const sph = new THREE.Spherical()
    const look = new THREE.Vector3()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const k = 1 - Math.pow(0.0015, dt) // frame-rate independent damping

      st.lon += (st.tLon - st.lon) * k
      st.lat += (st.tLat - st.lat) * k
      st.fov += (st.tFov - st.fov) * k
      if (Math.abs(camera.fov - st.fov) > 0.01) {
        camera.fov = st.fov
        camera.updateProjectionMatrix()
      }

      const phi = THREE.MathUtils.degToRad(90 - st.lat)
      const theta = THREE.MathUtils.degToRad(st.lon)
      sph.set(1, phi, theta)
      look.setFromSpherical(sph)
      camera.lookAt(look)

      const targetMesh = roomMeshes.get(st.targetId)
      if (targetMesh) {
        // fade the target in once its photo has arrived
        if (!targetMesh.visible && targetMesh.userData.ready) {
          targetMesh.visible = true
          ;(targetMesh.material as THREE.MeshBasicMaterial).opacity = 0
        }
        if (targetMesh.visible && targetMesh !== st.current) {
          const m = targetMesh.material as THREE.MeshBasicMaterial
          m.opacity = Math.min(1, m.opacity + dt * 2.2)
          if (m.opacity >= 1) st.current = targetMesh
        }
        // fade every other visible mesh out
        roomMeshes.forEach((mesh, id) => {
          if (id === st.targetId) return
          if (!mesh.visible) return
          const m = mesh.material as THREE.MeshBasicMaterial
          m.opacity = Math.max(0, m.opacity - dt * 2.6)
          if (m.opacity <= 0) mesh.visible = false
        })
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('click', onClick)
      renderer.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
      disposables.forEach((d) => d.dispose())
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
    // rooms load lazily when targetId changes
  }, [reduced])

  // Entering a room: load its photo, aim the camera at its start direction
  useEffect(() => {
    const st = stateRef.current
    if (!st) return
    const room = rooms.find((r) => r.id === activeId)
    if (!room) return
    loadRoomRef.current(room)
    st.targetId = activeId
    st.tLon = room.start?.lon ?? 0
    st.tLat = room.start?.lat ?? 0
    st.tFov = 72
  }, [activeId, rooms])

  return <div ref={mountRef} className="absolute inset-0" aria-label="360 degree photographic property tour" role="img" />
}
