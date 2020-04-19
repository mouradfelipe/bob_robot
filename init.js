
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("mycanvas"),
  precision: "mediump", 
  antialias:true, 
  alpha: true
});

document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

init();

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


function setFloor(x,y,z,proportion){

  let floorGeometry = new THREE.BoxGeometry(30*proportion,proportion,30*proportion,10,10);
  let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x3d2100,
      emissive: 0x000000,
      specular: 0xffffff,
      shininess: 50
  });
  
  let floor = new THREE.Mesh(floorGeometry,floorMaterial);
  
  floor.position.set(x,y,z);
  scene.add(floor);
}

function setLight(x,y,z,adjuster){

  scene.add( new THREE.AmbientLight( 0x3D4143 ) );
  
  let light = new THREE.DirectionalLight( 0xffffff , 1);
  light.position.set( 300, 1000, 500 );
  light.target.position.set();
  light.castShadow = true;
  
  light.shadow.camera = new THREE.OrthographicCamera(-adjuster,adjuster,adjuster,-adjuster,500,1600);
  light.shadow.bias = 0.0001;
  light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
  scene.add( light );
}


function init(){
  
  let x = 0.0;
  let y = -3;
  let z = 0.0;
  let proportion = 1;

  let cameraPositionX = 0.45*proportion;
  let cameraPositionY = 0.6*proportion;
  let cameraPositionZ = 8*proportion;

  
  let robot = createRobot(x,y,z,proportion);
  scene.add(robot);
  setFloor(x,y-0.75*proportion,z,proportion);
  setLight(x,y,z,500);

  camera.position.set(cameraPositionX,cameraPositionY,cameraPositionZ);
  camera.lookAt(robot.getWorldPosition());
  
  renderer.setClearColor(0xEEEEEE,1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  
  
}