import Robot from "./Robot.js";
import * as wasmlib from "./physics-wasm/pkg/physics_wasm.js";

class Simulation {
  constructor() {
    this.scene = new THREE.Scene();
    this.physics = new wasmlib.PhysicsWorld();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("mycanvas"),
      precision: "mediump",
      antialias: true,
      alpha: true,
    });;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    let proportion = 1;
    let x = 0, y = -3, z = 0;
    this.robot = new Robot(proportion);
    this.scene.add(this.robot.body);
    this.scene.add(this.robot.leftWheel);
    this.scene.add(this.robot.rightWheel);
    this.scene.add(this.robot.weight);
    this.setFloor(x, 0, z, proportion);
    this.setLight(x, y, z, 500);
    this.camera.position.set(10 * proportion, 5 * proportion, 13 * proportion);
    this.camera.lookAt(this.robot.body.getWorldPosition());

    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.physics.set_max_left_motor_torque(50);
    this.physics.set_max_right_motor_torque(50);
  }

  setFloor(x, y, z, proportion) {
    let floorGeometry = new THREE.BoxGeometry(
      100 * proportion,
      proportion,
      100 * proportion,
      10,
      10
    );
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x3d2100,
      emissive: 0x000000,
      specular: 0xffffff,
      shininess: 50,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.set(x, y - proportion, z);
    this.scene.add(floor);
  }

  setLight(x, y, z, adjuster) {
    this.scene.add(new THREE.AmbientLight(0x3d4143));

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(300, 1000, 500);
    light.target.position.set();
    light.castShadow = true;

    light.shadow.camera = new THREE.OrthographicCamera(
      -adjuster,
      adjuster,
      adjuster,
      -adjuster,
      500,
      1600
    );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
    this.scene.add(light);
  }

  update() {
    this.physics.step();
    let position = this.physics.get_part_position(wasmlib.Parts.BASE);
    let rotation = this.physics.get_part_rotation(wasmlib.Parts.BASE);
    this.robot.body.matrix.compose(position, rotation, new THREE.Vector3(1, 1, 1));

    position = this.physics.get_part_position(wasmlib.Parts.LEFT_WHEEL);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.LEFT_WHEEL);
    this.robot.leftWheel.matrix.compose(position, rotation, new THREE.Vector3(1, 1, 1));

    position = this.physics.get_part_position(wasmlib.Parts.RIGHT_WHEEL);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.RIGHT_WHEEL);
    this.robot.rightWheel.matrix.compose(position, rotation, new THREE.Vector3(1, 1, 1));

    position = this.physics.get_part_position(wasmlib.Parts.WEIGHT);
    rotation = this.physics.get_part_rotation(wasmlib.Parts.WEIGHT);
    this.robot.weight.matrix.compose(position, rotation, new THREE.Vector3(1, 1, 1));

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
    if (!this.robot.accelerating)
      this.robot.speed *= 0.99;
    if (!this.robot.angularAccelerating)
      this.robot.angularSpeed *= 0.99;
    this.robot.accelerating = false;
    this.robot.angularAccelerating = false;
    this.physics.set_left_motor_target_speed((this.robot.speed - this.robot.angularSpeed * 1 / 2) / 0.49);
    this.physics.set_right_motor_target_speed((this.robot.speed + this.robot.angularSpeed * 1 / 2) / 0.49);
  }
}

export default Simulation;