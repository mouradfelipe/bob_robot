import Robot from "./Robot.js";
import * as wasmlib from "./physics-wasm/pkg/physics_wasm.js";
import { Water } from "https://threejs.org/examples/jsm/objects/Water.js";
import { GUI } from "https://threejs.org/examples/jsm/libs/dat.gui.module.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/DragControls.js";


class Simulation {
  constructor() {
    this.scene = new THREE.Scene();
    this.physics = new wasmlib.PhysicsWorld();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("mycanvas"),
      precision: "mediump",
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.orbitControl = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    let proportion = 1;
    let x = 0,
      y = -3,
      z = 0;
    this.robot = new Robot(proportion);
    this.scene.add(this.robot.body);
    this.scene.add(this.robot.leftWheel);
    this.scene.add(this.robot.rightWheel);
    this.scene.add(this.robot.weight);
    this.setArena(x, 0, z, proportion);
    this.light = this.setLight(x, y, z, 75);
    this.setRamp();
    this.setObstacles();
    this.setBlenderObjects();
    this.water = this.setWater();
    this.setGUI();
    this.camera.position.set(10 * proportion, 5 * proportion, 13 * proportion);
    this.camera.lookAt(this.robot.body.getWorldPosition());

    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.physics.set_max_left_motor_torque(50);
    this.physics.set_max_right_motor_torque(50);
    this.physics.set_timestep(1 / 120);
  }

  setGUI() {
    let gui = new GUI();

    let uniforms = this.water.material.uniforms;
    var folder = gui.addFolder("Water");
    folder
      .add(uniforms.distortionScale, "value", 0, 8, 0.1)
      .name("distortionScale");
    folder.add(uniforms.size, "value", 0.1, 10, 0.1).name("size");
    folder.open();
  }

  setWater() {
    let waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
    let water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      alpha: 1.0,
      sunDirection: this.light.position.clone().normalize(),
      sunColor: 0xffffff,
      //waterColor: 0x001e0f,
      waterColor: 0x004d99,
      distortionScale: 3.7,
      fog: this.scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = water.position.y - 4;
    this.scene.add(water);
    return water;
  }

  setArena(x, y, z, proportion) {
    let floorGeometry = new THREE.BoxGeometry(
      100 * proportion,
      2 * proportion,
      100 * proportion,
      10,
      10
    );
    let floorTexture = new THREE.TextureLoader().load(
      "./resources/floor.jpeg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(25, 25);
      }
    );
    let floorMaterial = new THREE.MeshPhysicalMaterial({ map: floorTexture });
    let wall1Geometry = new THREE.BoxGeometry(
      2 * proportion,
      20 * proportion,
      100 * proportion,
      10,
      10
    );
    let wall2Geometry = new THREE.BoxGeometry(
      100 * proportion,
      20 * proportion,
      2 * proportion,
      10,
      10
    );
    let wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3d2100,
      emissive: 0x000000,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      reflectivity: 0.2,
      flatShading: true,
      vertexColors: true,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.castShadow = true;
    floor.position.set(x, y - proportion, z);
    this.scene.add(floor);
    let wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
    wall1.receiveShadow = true;
    wall1.castShadow = true;
    wall1.position.set(
      x + 50 * proportion + proportion,
      y + 10 * proportion,
      z
    );
    //this.scene.add(wall1);
    let wall2 = new THREE.Mesh(wall2Geometry, wallMaterial);
    wall2.receiveShadow = true;
    wall2.castShadow = true;
    wall2.position.set(
      x,
      y + 10 * proportion,
      z + 50 * proportion + proportion
    );
    //this.scene.add(wall2);
    let wall3 = new THREE.Mesh(wall1Geometry, wallMaterial);
    wall3.receiveShadow = true;
    wall3.castShadow = true;
    wall3.position.set(
      x - 50 * proportion - proportion,
      y + 10 * proportion,
      z
    );
    //this.scene.add(wall3);
    let wall4 = new THREE.Mesh(wall2Geometry, wallMaterial);
    wall4.receiveShadow = true;
    wall4.castShadow = true;
    wall4.position.set(
      x,
      y + 10 * proportion,
      z - 50 * proportion - proportion
    );
    //this.scene.add(wall4);
  }

  setRamp() {
    let rampGeometry = new THREE.Geometry();
    rampGeometry.vertices.push(
      new THREE.Vector3(-4, 0, 0), //0
      new THREE.Vector3(4, 0, 0), //1
      new THREE.Vector3(-4, 2, 4), //2
      new THREE.Vector3(4, 2, 4), //3
      new THREE.Vector3(-4, 0, 4), //4
      new THREE.Vector3(4, 0, 4) //5
    );
    rampGeometry.faces.push(
      new THREE.Face3(0, 1, 2), //front
      new THREE.Face3(1, 3, 2), //front
      new THREE.Face3(5, 4, 3), //back
      new THREE.Face3(2, 3, 4), //back
      new THREE.Face3(0, 4, 1), //bottom
      new THREE.Face3(1, 4, 5), //bottom
      new THREE.Face3(0, 2, 4), //left
      new THREE.Face3(1, 5, 3) //right
    );
    rampGeometry.computeBoundingSphere();

    let rampMaterial = new THREE.MeshPhysicalMaterial({
      //map: rampTexture,
      color: 0xaaaaaa, //scream
      emissive: 0x000000,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      reflectivity: 0.2,
      flatShading: true,
      //vertexColors: true,
    });

    let ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.receiveShadow = true;
    ramp.castShadow = true;
    ramp.position.set(0, 0, 4);
    this.scene.add(ramp);
  }

  setObstacles() {
    let obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    let boxTexture = new THREE.TextureLoader().load(
      "./resources/box2.jpeg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        //texture.repeat.set(25,25);
        //texture.offset.set(0.5,0.5);
      }
    );
    let obstacleMaterial = new THREE.MeshPhysicalMaterial({
      map: boxTexture,
      //color: 0x2266aa,
      //emissive: 0x000000,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      reflectivity: 0.2,
      flatShading: true,
      vertexColors: true,
    });
    let obstacles = [];
    for (let i = 0; i < 4 * 8; i++) {
      let obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      obstacle.matrixAutoUpdate = false;
      obstacle.receiveShadow = true;
      obstacle.castShadow = true;
      this.scene.add(obstacle);
      obstacles.push(obstacle);
    }
    this.obstacles = obstacles;
    this.renderer.domElement.ondragstart = function (event) { event.preventDefault(); return false; };
    this.dragControl = new DragControls([...obstacles],this.camera,this.renderer.domElement);
    this.dragControl.addEventListener('dragstart',(event)=>{
      event.object.matrixAutoUpdate = true
      this.orbitControl.enabled = false;
    });
    this.dragControl.addEventListener('dragend',(event)=>{
      event.object.matrixAutoUpdate = true
      this.orbitControl.enabled = true;
    });
  }

  setBlenderObjects() {
    let scene = this.scene;

    let loader1 = new THREE.GLTFLoader();
    let mesh1 = new THREE.Object3D();
    let position1 = [0, 0, 15];
    let scale1 = [0.5, 0.5, 0.5];

    let loader2 = new THREE.GLTFLoader();
    let mesh2 = new THREE.Object3D();
    let position2 = [10, 0, 5];
    let scale2 = [1, 1, 1];

    let loader3 = new THREE.GLTFLoader();
    let mesh3 = new THREE.Object3D();
    let position3 = [-10, 0, 0];
    let scale3 = [0.5, 0.5, 0.5];

    loader1.load("resources/lefttree.glb", (gltf) =>
      handle_load(gltf, mesh1, position1, scale1)
    );

    loader2.load("resources/mytree.glb", (gltf) =>
      handle_load(gltf, mesh2, position2, scale2)
    );

    loader3.load("resources/middletree.glb", (gltf) =>
      handle_load(gltf, mesh3, position3, scale3)
    );

    function handle_load(gltf, mesh, position, scale) {
      console.log(gltf.scene.children);
      mesh = gltf.scene.children[0];
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.flatShading = true;
      mesh.position.set(position[0], position[1], position[2]);
      mesh.scale.set(scale[0], scale[1], scale[2]);
      scene.add(mesh);
      console.log(mesh);
    }
  }

  setLight(x, y, z, adjuster) {
    this.scene.add(new THREE.AmbientLight(0x3d4143));

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(24, 80, 40);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    light.shadow.camera = new THREE.OrthographicCamera(
      -adjuster,
      adjuster,
      adjuster,
      -adjuster,
      0.1,
      1600
    );

    light.shadow.bias = -0.0002;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 4096;
    this.scene.add(light);
    this.scene.add(light.target);
    return light;
    //const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    //this.scene.add(cameraHelper);
  }

  update() {
    this.water.material.uniforms["time"].value += 1.0 / 60.0;

    this.physics.step();
    this.physics.step();
    let position = this.physics.get_part_position(wasmlib.Parts.BASE);
    let rotation = this.physics.get_part_rotation(wasmlib.Parts.BASE);
    this.robot.body.matrix.compose(
      position,
      rotation,
      new THREE.Vector3(1, 1, 1)
    );

    position = this.physics.get_part_position(wasmlib.Parts.LEFT_WHEEL);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.LEFT_WHEEL);
    this.robot.leftWheel.matrix.compose(
      position,
      rotation,
      new THREE.Vector3(1, 1, 1)
    );

    position = this.physics.get_part_position(wasmlib.Parts.RIGHT_WHEEL);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.RIGHT_WHEEL);
    this.robot.rightWheel.matrix.compose(
      position,
      rotation,
      new THREE.Vector3(1, 1, 1)
    );

    position = this.physics.get_part_position(wasmlib.Parts.WEIGHT);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.WEIGHT);
    this.robot.weight.matrix.compose(
      position,
      rotation,
      new THREE.Vector3(1, 1, 1)
    );

    for (let i = 0; i < this.obstacles.length; i++) {
      position = this.physics.get_obstacle_position(i);
      rotation = this.physics.get_obstacle_rotation(i);
      this.obstacles[i].matrix.compose(
        position,
        rotation,
        new THREE.Vector3(1, 1, 1)
      );
    }
    // let pos = this.physics.get_part_position(wasmlib.Parts.BASE);
    // let rot = this.physics.get_part_rotation(wasmlib.Parts.BASE);
    // let matrix = new THREE.Matrix4().compose(pos, rot, new THREE.Vector3(1, 1, 1));
    // let basis_x = new THREE.Vector3();
    // let basis_y = new THREE.Vector3();
    // let basis_z = new THREE.Vector3();
    // matrix.extractBasis(basis_x, basis_y, basis_z);
    //let inclination = -Math.asin(basis_z.y);
    //this.physics.set_left_motor_target_speed(50 * inclination);
    //this.physics.set_right_motor_target_speed(50 * inclination);
    if (!this.robot.accelerating) this.robot.speed *= 0.99;
    if (!this.robot.angularAccelerating) this.robot.angularSpeed *= 0.99;
    this.robot.accelerating = false;
    this.robot.angularAccelerating = false;
    this.physics.set_left_motor_target_speed(
      (this.robot.speed - (this.robot.angularSpeed * 1) / 2) / 0.49
    );
    this.physics.set_right_motor_target_speed(
      (this.robot.speed + (this.robot.angularSpeed * 1) / 2) / 0.49
    );
  }
}

export default Simulation;
