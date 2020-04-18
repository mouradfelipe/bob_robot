//Create the shape
var geometry = new THREE.BoxGeometry(1, 1, 1);

//Create a material, colour or image texture
var material = new THREE.MeshLambertMaterial({
  color: 0xeeeeee,
  wireframe: true,
});

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var updateRobot = () => {
  cube.rotation.z += 0.001;
  cube.rotation.x += 0.001;
  cube.rotation.y += 0.001;
};
