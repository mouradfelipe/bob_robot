var textureLoader = new THREE.TextureLoader();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById("mycanvas"),
    alpha:false,
    antialias: true
});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor({color:0xEEEEFF}); 
document.body.appendChild(renderer.domElement);

//Create the shape
var geometry = new THREE.BoxGeometry(1,1,1);

//Create a material, colour or image texture
var material = new THREE.MeshLambertMaterial({color:0xEEEEEE, wireframe:true});


var cube = new THREE.Mesh(geometry,material);
scene.add(cube);

camera.position.z = 3;

window.addEventListener('resize',function(){

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix( );
});

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var ambientLight = new THREE.AmbientLight(0xFFFFFF,1.5);
scene.add(ambientLight);


var floorGeometry = new THREE.BoxGeometry(10,1,10);
var floorMaterial = new THREE.MeshBasicMaterial({color: 0xEEEEEE});
var floorCube = new THREE.Mesh(floorGeometry,floorMaterial);
floorCube.position.y = -5;
scene.add(floorCube);



//Game Logic
var update = function(){
    cube.rotation.z += 0.001;
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
};



//Draw Scene
var render = function(){
    renderer.render(scene,camera);
};

//Run Gameloop (update, render, repeat)
var gameLoop = function(){
    requestAnimationFrame(gameLoop);
    update();
    render();
};

gameLoop();