class Robot {
  constructor(proportion = 1) {
    this.generateBodyHead(proportion);
    this.generateRightWheel(proportion);
    this.generateLeftWheel(proportion);
    this.speed = 0;
    this.angularSpeed = 0;
    this.accelerating = false;
    this.angularAccelerating = false;
    this.MAX_SPEED = 5;
    this.MAX_ANGULAR_SPEED = 3.1415926535897932384626;
  }

  generateLeftWheel(proportion = 1) {
    this.leftWheel = new THREE.Object3D();
    this.leftWheel.matrixAutoUpdate = false;
    let geometry = new THREE.CylinderGeometry(proportion * 0.5, proportion * 0.5, proportion * 0.2, 64);
    let material = new THREE.MeshPhysicalMaterial({
      color: 0xc40707,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.3,
      reflectivity: 0.3,
      flatShading: true,
      vertexColors: true,
    });
    let leftWheelMesh = new THREE.Mesh(geometry, material);
    leftWheelMesh.rotation.z = Math.PI / 2;
    this.leftWheel.add(leftWheelMesh);
  }

  generateRightWheel(proportion = 1) {
    this.rightWheel = new THREE.Object3D();
    this.rightWheel.matrixAutoUpdate = false;
    let geometry = new THREE.CylinderGeometry(proportion * 0.5, proportion * 0.5, proportion * 0.2, 64);
    let material = new THREE.MeshPhysicalMaterial({
      color: 0xc40707,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.3,
      reflectivity: 0.3,
      flatShading: true,
      vertexColors: true,
    });
    let rightWheelMesh = new THREE.Mesh(geometry, material);
    rightWheelMesh.rotation.z = Math.PI / 2;
    this.rightWheel.add(rightWheelMesh);
  }

  generateBodyHead(proportion = 1) {
    let geometry = new THREE.ConeGeometry(0.4 * proportion, 1.2 * proportion, 16);

    let material = new THREE.MeshPhysicalMaterial({
      color: 0xffbda1,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.2,
      metalness: 0.5,
      reflectivity: 0.5,
      flatShading: true,
    });

    this.body = new THREE.Mesh(geometry, material);
    this.body.matrixAutoUpdate = false;
    geometry = new THREE.SphereGeometry(0.5 * proportion, 16, 8);

    material = new THREE.MeshPhysicalMaterial({
      color: 0xc40707,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.3,
      reflectivity: 0.3,
      flatShading: true,
      vertexColors: true,
    });

    let head = new THREE.Mesh(geometry, material);
    head.position.y = 0.6;
    this.body.add(head);
  }

  accelerate(a) {
    this.speed += a;
    if (this.speed > this.MAX_SPEED)
      this.speed = this.MAX_SPEED
    if (this.speed < -this.MAX_SPEED)
      this.speed = -this.MAX_SPEED
  }

  angularAccelerate(a) {
    this.angularSpeed += a;
    if (this.angularSpeed > this.MAX_ANGULAR_SPEED)
      this.angularSpeed = this.MAX_ANGULAR_SPEED
    if (this.angularSpeed < -this.MAX_ANGULAR_SPEED)
      this.angularSpeed = -this.MAX_ANGULAR_SPEED
  }

}

export default Robot;
