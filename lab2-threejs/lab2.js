var container
var camera, scene, renderer
var mouseX = 0,
  mouseY = 0
var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2

// Object3D ("Group") nodes and Mesh nodes:
var sceneRoot = new THREE.Group()

//sun var
var sunSpin = new THREE.Group()
var sunMesh

// earth var
var earthRotSun = new THREE.Group() // rotation runt solen
var earthTrans = new THREE.Group() // translation från origo
var earthSpin = new THREE.Group() // rotation runt egen axel
var earthTilt = new THREE.Group() // statisk lutning på earth
var earthMesh

// mars var
var marsRotSun = new THREE.Group() // rotation runt solen
var marsTrans = new THREE.Group() // translation från origo
var marsSpin = new THREE.Group() // rotation runt egen axel
var marsTilt = new THREE.Group() // statisk lutning på mars
var marsMesh

// jupiter var
var jupiterRotSun = new THREE.Group() // rotation runt solen
var jupiterTrans = new THREE.Group() // translation från origo
var jupiterSpin = new THREE.Group() // rotation runt egen axel
var jupiterTilt = new THREE.Group() // statisk lutning
var jupiterMesh

// saturn var
var satRotSun = new THREE.Group() // rotation runt solen
var satTrans = new THREE.Group() // translation från origo
var satSpin = new THREE.Group() // rotation runt egen axel
var satTilt = new THREE.Group() // statisk lutning
var satMesh

//ring var
var ringRotSat = new THREE.Group()
var ringTrans = new THREE.Group() // translation från origo
var ringSpin = new THREE.Group() // rotation runt egen axel
var ringTilt = new THREE.Group() // statisk lutning
var ringMesh

// neptune var
var nepRotSun = new THREE.Group() // rotation runt solen
var nepTrans = new THREE.Group() // translation från origo
var nepSpin = new THREE.Group() // rotation runt egen axel
var nepTilt = new THREE.Group() // statisk lutning
var nepMesh

// moon var
var moonRotEarth = new THREE.Group() // månen roterar runt solen
var moonTrans = new THREE.Group()
var moonSpin = new THREE.Group()
var moonTilt = new THREE.Group()
var moonMesh

var animation = true

function onWindowResize() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove(event) {
  // mouseX, mouseY are in the range [-1, 1]
  mouseX = (event.clientX - windowHalfX) / windowHalfX
  mouseY = (event.clientY - windowHalfY) / windowHalfY
}

function getRandomStarField(numberOfStars, width, height) {
  var canvas = document.createElement('CANVAS')

  canvas.width = width
  canvas.height = height

  var ctx = canvas.getContext('2d')

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  for (var i = 0; i < numberOfStars; ++i) {
    var radius = Math.random() * 2
    var x = Math.floor(Math.random() * width)
    var y = Math.floor(Math.random() * height)

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  var texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

function createSceneGraph() {
  scene = new THREE.Scene()

  //diffuse light
  const light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(0, 0, 0)
  light.castShadow = true
  scene.add(light)
  light.shadow.mapSize.width = 512 // default
  light.shadow.mapSize.height = 512 // default
  light.shadow.camera.near = 0.5 // default
  light.shadow.camera.far = 500 // default

  //ambient light
  const ambientLight = new THREE.AmbientLight(0x202020)
  scene.add(ambientLight)

  // Top-level node
  scene.add(sceneRoot)

  //sun branch
  sceneRoot.add(sunSpin)
  sunSpin.add(sunMesh)

  // earth branch
  sceneRoot.add(earthRotSun)
  earthRotSun.add(earthTrans)
  earthTrans.add(earthTilt)
  earthTilt.add(earthSpin)
  earthSpin.add(earthMesh)

  // mars branch
  sceneRoot.add(marsRotSun)
  marsRotSun.add(marsTrans)
  marsTrans.add(marsTilt)
  marsTilt.add(marsSpin)
  marsSpin.add(marsMesh)

  // jupiter branch
  sceneRoot.add(jupiterRotSun)
  jupiterRotSun.add(jupiterTrans)
  jupiterTrans.add(jupiterTilt)
  jupiterTilt.add(jupiterSpin)
  jupiterSpin.add(jupiterMesh)

  // saturn branch
  sceneRoot.add(satRotSun)
  satRotSun.add(satTrans)
  satTrans.add(satTilt)
  satTilt.add(satSpin)
  satSpin.add(satMesh)

  //ring branch
  satTrans.add(ringRotSat)
  ringRotSat.add(ringTrans)
  ringTrans.add(ringTilt)
  ringTilt.add(ringSpin)
  ringSpin.add(ringMesh)

  //neptune branch
  sceneRoot.add(nepRotSun)
  nepRotSun.add(nepTrans)
  nepTrans.add(nepTilt)
  nepTilt.add(nepSpin)
  nepSpin.add(nepMesh)

  // moon branch
  earthTrans.add(moonRotEarth)
  moonRotEarth.add(moonTrans)
  moonTrans.add(moonTilt)
  moonTilt.add(moonSpin)
  moonSpin.add(moonMesh)
}

function init() {
  container = document.getElementById('container')

  camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 150)
  camera.position.z = 50

  var texloader = new THREE.TextureLoader()

  // Earth mesh
  var geometryEarth = new THREE.SphereGeometry(0.5, 32, 32)
  var materialEarth = new THREE.MeshPhongMaterial()
  materialEarth.combine = 0
  materialEarth.needsUpdate = true
  materialEarth.wireframe = false

  //Mars mesh
  var geometryMars = new THREE.SphereGeometry(0.25, 32, 32)
  var materialMars = new THREE.MeshPhongMaterial()
  materialMars.combine = 0
  materialMars.needsUpdate = true
  materialMars.wireframe = false

  //Jupiter mesh
  var geometryJupiter = new THREE.SphereGeometry(5.5, 32, 32)
  var materialJupiter = new THREE.MeshPhongMaterial()
  materialJupiter.combine = 0
  materialJupiter.needsUpdate = true
  materialJupiter.wireframe = false

  //Saturn mesh
  var geometrySat = new THREE.SphereGeometry(4.5, 32, 32)
  var materialSat = new THREE.MeshPhongMaterial()
  materialSat.combine = 0
  materialSat.needsUpdate = true
  materialSat.wireframe = false

  // Saturn ring
  var geometryRing = new THREE.RingGeometry(6, 8, 32)
  var materialRing = new THREE.MeshBasicMaterial({ color: 0x9c9679, side: THREE.DoubleSide })
  materialRing.combine = 0
  materialRing.needsUpdate = true
  materialRing.wireframe = false
  materialRing.transparent = true
  materialRing.opacity = 0.5

  //Neptune mesh
  var geometryNep = new THREE.SphereGeometry(1.8, 32, 32)
  var materialNep = new THREE.MeshPhongMaterial()
  materialNep.combine = 0
  materialNep.needsUpdate = true
  materialNep.wireframe = false

  // Moon mesh
  var geometryMoon = new THREE.SphereGeometry(0.125, 10, 10)
  var materialMoon = new THREE.MeshPhongMaterial(0.00229)
  materialMoon.combine = 0
  materialMoon.needsUpdate = true
  materialMoon.wireframe = false

  //Sun mesh
  var geometrySun = new THREE.SphereGeometry(3, 32, 32)
  var materialSun = new THREE.MeshBasicMaterial()
  materialSun.combine = 0
  materialSun.needsUpdate = true
  materialSun.wireframe = false

  //starfield
  let skyBox = new THREE.BoxGeometry(120, 120, 120)
  let skyBoxMaterial = new THREE.MeshBasicMaterial({
    map: getRandomStarField(600, 2048, 2048),
    side: THREE.BackSide,
  })
  let sky = new THREE.Mesh(skyBox, skyBoxMaterial)
  sceneRoot.add(sky)

  //background
  const spaceBack = texloader.load('tex/space.jpg')
  sceneRoot.background = spaceBack

  //Textures

  const earthTexture = texloader.load('tex/2k_earth_daymap.jpg')
  materialEarth.map = earthTexture
  const moonTexture = texloader.load('tex/2k_moon.jpg')
  materialMoon.map = moonTexture
  const sunTexture = texloader.load('tex/2k_sun.jpg')
  materialSun.map = sunTexture
  const marsTexture = texloader.load('tex/2k_mars.jpg')
  materialMars.map = marsTexture
  const jupiterTexture = texloader.load('tex/2k_jupiter.jpg')
  materialJupiter.map = jupiterTexture
  const satTexture = texloader.load('tex/2k_saturn.jpg')
  materialSat.map = satTexture
  const nepTexture = texloader.load('tex/2k_neptune.jpg')
  materialNep.map = nepTexture
  // const ringTexture = texloader.load('tex/2k_jupiter.jpg')
  // materialRing.map = ringTexture

  var uniforms = THREE.UniformsUtils.merge([
    {
      colorTexture: { value: new THREE.Texture() },
      specularMap: { value: new THREE.Texture() },
    },
    THREE.UniformsLib['lights'],
  ])

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent.trim(),
    fragmentShader: document.getElementById('fragmentShader').textContent.trim(),
    lights: true,
  })
  shaderMaterial.uniforms.colorTexture.value = earthTexture

  const specularMap = texloader.load('tex/2k_earth_specular_map.jpg')
  shaderMaterial.uniforms.specularMap.value = specularMap

  //Meshes
  earthMesh = new THREE.Mesh(geometryEarth, shaderMaterial)
  earthMesh.castShadow = true
  earthMesh.receiveShadow = true

  moonMesh = new THREE.Mesh(geometryMoon, materialMoon)

  sunMesh = new THREE.Mesh(geometrySun, materialSun)

  marsMesh = new THREE.Mesh(geometryMars, materialMars)
  marsMesh.castShadow = true
  marsMesh.receiveShadow = true

  jupiterMesh = new THREE.Mesh(geometryJupiter, materialJupiter)
  jupiterMesh.castShadow = true //default is false
  jupiterMesh.receiveShadow = true //default

  satMesh = new THREE.Mesh(geometrySat, materialSat)
  satMesh.receiveShadow = true
  satMesh.castShadow = true

  nepMesh = new THREE.Mesh(geometryNep, materialNep)
  nepMesh.receiveShadow = true

  ringMesh = new THREE.Mesh(geometryRing, materialRing)

  createSceneGraph()

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  container.appendChild(renderer.domElement)

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  window.addEventListener('resize', onWindowResize, false)

  var checkBoxAnim = document.getElementById('animation')
  animation = checkBoxAnim.checked
  checkBoxAnim.addEventListener('change', (event) => {
    animation = event.target.checked
  })
}

function rotSpeed(days, speed) {
  return ((2 * Math.PI) / 60 / days) * speed
}

function tilt(degree) {
  return (degree * Math.PI) / 180
}

function render() {
  // Set up the camera
  camera.position.x = mouseX * 50
  camera.position.y = -mouseY * 50
  camera.lookAt(scene.position)

  let speed = 1
  speed = speed * document.getElementById('slider').value

  // Perform animations
  if (animation) {
    // earth
    earthSpin.rotation.y += 0.1
    earthTilt.rotation.z = tilt(23.44)
    earthRotSun.rotation.y += rotSpeed(365, speed)
    earthTrans.position.x = 10

    //mars
    marsSpin.rotation.y += 0.1
    marsTilt.rotation.z = tilt(25)
    marsRotSun.rotation.y += rotSpeed(365 * 2, speed)
    marsTrans.position.x = 12

    //jupiter
    jupiterSpin.rotation.y += rotSpeed(0.55, speed)
    jupiterTilt.rotation.z = tilt(3)
    jupiterRotSun.rotation.y += rotSpeed(4380, speed)
    jupiterTrans.position.x = 22

    //saturn
    satSpin.rotation.y += rotSpeed(0.55, speed)
    satTilt.rotation.z = tilt(26.73)
    satRotSun.rotation.y += rotSpeed(10585, speed)
    satTrans.position.x = 45

    //ring
    ringRotSat.rotation.y += rotSpeed(5, speed)
    ringTrans.position.x = 0.0
    ringSpin.rotation.y += 0.0
    ringTilt.rotation.x = tilt(90)
    ringTilt.rotation.y = tilt(0)

    //neptune
    nepSpin.rotation.y += rotSpeed(0.8, speed)
    nepTilt.rotation.z = tilt(28)
    nepRotSun.rotation.y += rotSpeed(60225, speed)
    nepTrans.position.x = 55

    // moon
    moonRotEarth.rotation.y += 0.1 // moon rot
    moonTrans.position.x = -1
    moonSpin.rotation.y += 0.0038
    moonTilt.rotation.z = 0.09

    //sun
    sunSpin.rotation.y += 0.004
  }

  // Render the scene
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate) // Request to be called again for next frame
  render()
}

init() // Set up the scene
animate() // Enter an infinite loop
