import './style.css'
import * as THREE from 'three'

/**
 * mouse
 */
const mouse = new THREE.Vector2()
const prevMouse = new THREE.Vector2()
let drag = false

const dampingMouse = new THREE.Vector2()
let dampingFactor = 0.05

/**
 * Zoom
 */
let zoomFactor = 0
let zoomSpeed = 0.25

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
camera.position.set(0, 0, 4)

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

	dampingMouse.lerp(mouse, dampingFactor)

	const angleA = -dampingMouse.x * Math.PI
	const angleB = (dampingMouse.y * 0.5 + 0.5) * Math.PI
	const radius = 4 //+ zoomFactor * 2

	// camera.fov = fov + zoomFactor * 30
	// camera.updateProjectionMatrix()

	camera.zoom = 1 + zoomFactor * 0.5
	camera.updateProjectionMatrix()

	const pos = new THREE.Vector3().setFromSphericalCoords(radius, angleB, angleA)

	// camera.position.y = 4 * Math.sin(angle)
	// camera.position.z = 4 * Math.cos(angle)
	camera.position.copy(pos)

	camera.lookAt(mesh.position)

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', onResize)

function onResize() {
	console.log('resize')
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

window.addEventListener('mousemove', (event) => {
	// print mouse coordinates inside window
	// console.log(event.clientX, event.clientY)

	if (drag) {
		const currentMouse = new THREE.Vector2(
			(2 * event.clientX) / window.innerWidth - 1,
			(-2 * event.clientY) / window.innerHeight + 1
		)
		const diff = currentMouse.clone().sub(prevMouse)

		mouse.add(diff)
		mouse.y = THREE.MathUtils.clamp(mouse.y, -0.999, 0.999)
		// mouse.x = (2 * diff.x) / window.innerWidth - 1
		// mouse.y = (-2 * diff.y) / window.innerHeight + 1
		// print normalized mouse coordinates
		// console.log(mouse.x, mouse.y)

		prevMouse.copy(currentMouse)
	}
})

window.addEventListener('wheel', (event) => {
	// print the delta Y scroll amount
	console.log(event.deltaY)
	zoomFactor += (zoomSpeed * event.deltaY) / 1000

	zoomFactor = THREE.MathUtils.clamp(zoomFactor, -1, 1)
})

window.addEventListener('mousedown', (event) => {
	// set mouse starting position
	prevMouse.x = (2 * event.clientX) / window.innerWidth - 1
	prevMouse.y = (-2 * event.clientY) / window.innerHeight + 1
	// start drag
	drag = true
})

window.addEventListener('mouseup', () => {
	// end drag
	drag = false
})
