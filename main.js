import './style.css'
import * as THREE from 'three'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Manhattan
 */
const material = new THREE.MeshNormalMaterial()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const moon = mesh.clone()
moon.scale.multiplyScalar(0.25)

// scene.add(moon)

/**
 * Mouse
 */

const mouse = new THREE.Vector2(0, 0)
const prevMouse = new THREE.Vector2(0, 0)
let drag = false

const dumpingMouse = new THREE.Vector2()
let dumpingFactor = 0.05

let zoomFactor = 0
let zoomSpeed = 0.25

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 0, 8)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
renderer.setSize(sizes.width, sizes.height)

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * muovo indietro la camera
 */
// camera.position.z = 4

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

// let R = 4

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()
	// const angle = -mouse.y * Math.PI * 0.5

	// camera.position.y = R * Math.sin(angle)
	// camera.position.z = R * Math.cos(angle)
	let R = 4 //+ zoomFactor * 2

	dumpingMouse.lerp(mouse, dumpingFactor)

	const angleA = -dumpingMouse.x * Math.PI
	const angleB = (dumpingMouse.y * 0.5 + 0.5) * Math.PI

	const pos = new THREE.Vector3().setFromSphericalCoords(R, angleB, angleA)
	camera.position.copy(pos)

	camera.lookAt(0, 0, 0)

	// camera.fov = fov + zoomFactor * 30
	camera.zoom = 1 + zoomFactor * 0.5
	camera.updateProjectionMatrix()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', onResize)

function onResize() {
	// console.log('resize')
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

window.addEventListener('mousemove', onMouseMove)

function onMouseMove(event) {
	// mouse.x = (2 * event.clientX) / window.innerWidth - 1
	// mouse.y = (-2 * event.clientY) / window.innerHeight + 1

	if (drag) {
		console.log('drag anb drop ON')

		const currentMouse = new THREE.Vector2(
			(2 * event.clientX) / window.innerWidth - 1,
			(-2 * event.clientY) / window.innerHeight + 1
		)

		const diff = currentMouse.clone().sub(prevMouse)

		mouse.add(diff)
		mouse.y = THREE.MathUtils.clamp(mouse.y, -1, 1)

		prevMouse.copy(currentMouse)
	}
}

window.addEventListener('mousedown', function (event) {
	prevMouse.x = (2 * event.clientX) / window.innerWidth - 1
	prevMouse.y = (-2 * event.clientY) / window.innerHeight + 1

	drag = true
})

window.addEventListener('mouseup', function () {
	drag = false
})

window.addEventListener('wheel', function (event) {
	// console.log(event.deltaY)

	zoomFactor += (zoomSpeed * event.deltaY) / 1000
	zoomFactor = THREE.MathUtils.clamp(zoomFactor, -1, 1)
	console.log(zoomFactor)
})
