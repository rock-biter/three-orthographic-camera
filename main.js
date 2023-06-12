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

const mouse = new THREE.Vector2(0, 0)
let factor = 0

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
const fov = 90
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)

camera.position.set(0, 0, 3)

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

// window.addEventListener('click', function () {
// 	// cliccando sulla window attiviamo il controls se non è attivo
// 	if (!controls.isLocked) {
// 		controls.lock()
// 	}
// })
