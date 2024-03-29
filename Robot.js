class Robot {
  constructor(proportion = 1) {
    this.generateBodyHead(proportion);
    this.generateRightWheel(proportion);
    this.generateLeftWheel(proportion);
    this.generateWeight(proportion);
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
    let geometry = new THREE.CylinderGeometry(
      proportion * 0.5,
      proportion * 0.5,
      proportion * 0.2,
      64
    );
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
    leftWheelMesh.receiveShadow = true;
    leftWheelMesh.castShadow = true;
    this.leftWheel.add(leftWheelMesh);

    geometry = new THREE.BoxGeometry(
      proportion * 0.05,
      proportion * 0.1,
      proportion * 0.1
    );
    material = new THREE.MeshPhysicalMaterial({
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
    let leftWheelDecoration = new THREE.Mesh(geometry, material);
    leftWheelDecoration.receiveShadow = true;
    leftWheelDecoration.castShadow = true;
    leftWheelDecoration.position.x += 0.1;
    this.leftWheel.add(leftWheelDecoration);
  }

  generateRightWheel(proportion = 1) {
    this.rightWheel = new THREE.Object3D();
    this.rightWheel.matrixAutoUpdate = false;
    let geometry = new THREE.CylinderGeometry(
      proportion * 0.5,
      proportion * 0.5,
      proportion * 0.2,
      64
    );
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
    rightWheelMesh.receiveShadow = true;
    rightWheelMesh.castShadow = true;
    this.rightWheel.add(rightWheelMesh);

    geometry = new THREE.BoxGeometry(
      proportion * 0.05,
      proportion * 0.1,
      proportion * 0.1
    );
    material = new THREE.MeshPhysicalMaterial({
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
    let rightWheelDecoration = new THREE.Mesh(geometry, material);
    rightWheelDecoration.position.x += -0.1;
    rightWheelDecoration.receiveShadow = true;
    rightWheelDecoration.castShadow = true;
    this.rightWheel.add(rightWheelDecoration);
  }

  generateBodyHead(proportion = 1) {
    let geometry = new THREE.ConeGeometry(
      0.4 * proportion,
      1.2 * proportion,
      16
    );

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
    this.body.receiveShadow = true;
    this.body.castShadow = true;
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
      flatShading: false,
      vertexColors: true,
    });

    let head = new THREE.Mesh(geometry, material);
    head.position.y = 0.6;
    head.receiveShadow = true;
    head.castShadow = true;
    this.body.add(head);

    geometry = new THREE.BoxGeometry(
      0.2 * proportion,
      0.2 * proportion,
      0.2 * proportion,
      16,
      8
    );

    material = new THREE.MeshPhysicalMaterial({
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

    let headDecoration1 = new THREE.Mesh(geometry, material);
    headDecoration1.position.z = 0.5;
    headDecoration1.position.x = 0.2;
    headDecoration1.receiveShadow = true;
    headDecoration1.castShadow = true;
    head.add(headDecoration1);

    let headDecoration2 = new THREE.Mesh(geometry, material);
    headDecoration2.position.z = 0.5;
    headDecoration2.position.x = -0.2;
    headDecoration2.receiveShadow = true;
    headDecoration2.castShadow = true;
    head.add(headDecoration2);
  }

  generateWeight(proportion = 1) {
    let geometry = new THREE.SphereGeometry(proportion * 0.001, 16, 8);
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
    this.weight = new THREE.Mesh(geometry, material);
    this.weight.receiveShadow = true;
    this.weight.castShadow = true;
    this.weight.matrixAutoUpdate = false;
  }

  accelerate(a) {
    this.speed += a;
    if (this.speed > this.MAX_SPEED) this.speed = this.MAX_SPEED;
    if (this.speed < -this.MAX_SPEED) this.speed = -this.MAX_SPEED;
    if (a > 0) {
      if (-this.MAX_SPEED < this.speed < this.MAX_SPEED / 3)
        this.speed += 2 * a;
    }
    if (a < 0) {
      if (-this.MAX_SPEED / 3 < this.speed < this.MAX_SPEED)
        this.speed += 2 * a;
    }
  }

  angularAccelerate(a) {
    this.angularSpeed += a;
    if (this.angularSpeed > this.MAX_ANGULAR_SPEED)
      this.angularSpeed = this.MAX_ANGULAR_SPEED;
    if (this.angularSpeed < -this.MAX_ANGULAR_SPEED)
      this.angularSpeed = -this.MAX_ANGULAR_SPEED;
    if (a > 0) {
      if (
        -this.MAX_ANGULAR_SPEED <
        this.angularSpeed <
        this.MAX_ANGULAR_SPEED / 3
      )
        this.angularSpeed += 2 * a;
    }
    if (a < 0) {
      if (-this.MAX_SPEED / 3 < this.angularSpeed < this.MAX_SPEED)
        this.angularSpeed += 2 * a;
    }
  }
}

export default Robot;
