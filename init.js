var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("mycanvas"),
  alpha: false,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor({ color: 0xeeeeff });
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

camera.position.z = 3;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

var floorGeometry = new THREE.BoxGeometry(10, 1, 10);
var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
var floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
floorCube.position.y = -5;
scene.add(floorCube);
