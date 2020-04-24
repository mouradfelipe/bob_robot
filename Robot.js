

class Robot{

  constructor(x,y,z,proportion = 1){
    
    this.group = new THREE.Group();
    this.axis = generateAxis(x,y,z,proportion);
    this.body = generateBody(x,y,z,proportion);
    this.rightWheels = generateRightWheels(x,y,z,proportion);
    this.leftWheels = generateLeftWheels(x,y,z,proportion);
    this.head = generateHead(x,y,z,proportion);

    this.group.add(this.axis);
    this.group.add(this.body);
    this.group.add(this.rightWheels);
    this.group.add(this.leftWheels);
    this.group.add(this.head);  
    
    this.linearSpeed = new THREE.Vector3(0,0,0);
    this.angularSpeed = new THREE.Vector3(0,0,0);
    this.angle = 0;
    
    this.maxLinearSpeed = 6;
    this.maxAngularSpeed = 2;
    
  }
  
  setVelocityWheels(vx,vy,vz){
    this.linearSpeed.add(new THREE.Vector3(vx,vy,vz));
    //this.group.position.add(this.linearSpeed);
    this.linearSpeed.clampLength(-this.maxLinearSpeed,this.maxLinearSpeed);
  }

  setRotation(wx,wy,wz){
    this.angularSpeed.add(new THREE.Vector3(wx,wy,wz));
    this.angularSpeed.clampLength(-this.maxAngularSpeed,this.maxAngularSpeed);
  }

  move(){

    let dt = 1/60;
    let v = this.linearSpeed.length()*Math.sign(this.linearSpeed.dot(new THREE.Vector3(1,1,1)));
    let w = this.angularSpeed.length()*Math.sign(this.angularSpeed.dot(new THREE.Vector3(1,1,1)));
    
    this.group.position.x += v*dt*Math.sin(this.angle + w*dt/2);
    this.group.position.z += v*dt*Math.cos(this.angle + w*dt/2);

    this.angle += (w*dt)%(2*Math.PI);
    this.group.rotation.y = this.angle+Math.PI/2;
  }

}


function generateRightWheels(x,y,z, proportion = 1){
  let geometry = new THREE.TorusGeometry(proportion*0.2,proportion*0.08,20,60);
  let material = new THREE.MeshPhysicalMaterial( { 
    color: 0xc40707,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    roughness: 0.3,
    reflectivity: 0.3,
    flatShading: true,
    vertexColors: true
    });
  let torus = new THREE.Mesh( geometry, material );
  //torus.position.set(0,-3,0.35);
  torus.position.set(x,y,z+0.35*proportion);
  //scene.add( torus );
  return torus;
}

function generateLeftWheels(x,y,z,proportion = 1){
  let geometry = new THREE.TorusGeometry(proportion*0.2,proportion*0.08,20,60);
  let material = new THREE.MeshPhysicalMaterial( { 
    color: 0xc40707,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    roughness: 0.3,
    reflectivity: 0.3,
    flatShading: true,
    vertexColors: true
    });
  let torus = new THREE.Mesh( geometry, material );
  //torus.position.set(0,-3,0.35);
  torus.position.set(x,y,z-0.35*proportion);
  //scene.add( torus );
  return torus;
}

function generateAxis(x,y,z,proportion=1){

  let geometry = new THREE.CylinderGeometry(0.2*proportion,0.2*proportion,0.75*proportion,64,1,false);
    
  let material = new THREE.MeshPhysicalMaterial( { 
    color: 0xffbda1,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    roughness: 0.2,
    metalness: 0.5,
    reflectivity: 0.5,
    flatShading: true
    });
    
    let cylinder = new THREE.Mesh( geometry, material );
    
    cylinder.rotateZ(Math.PI/2);
    cylinder.rotateX(Math.PI/2);
    cylinder.position.set(x,y,z);
    //cylinder.position.set(0,-3,0);
    //scene.add( cylinder );
    return cylinder;
}

function generateHead(x,y,z,proportion = 1){
  
  let geometry = new THREE.TorusGeometry(0.05*1.25*proportion,1.25*0.3*proportion,14,21,4);
  
  let material = new THREE.MeshPhysicalMaterial( { 
      color: 0xc40707,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.3,
      reflectivity: 0.3,
      flatShading: true,
      vertexColors: true
  });
  let torus = new THREE.Mesh( geometry, material );
  torus.position.set(x,y+proportion,z);
  //torus.position.set(0,-2,0);
  //scene.add( torus );
  return torus;
}

function generateBody(x,y,z,proportion = 1){

  let geometry = new THREE.CylinderGeometry(0.18*proportion,0.36*proportion,proportion,16,10,true);
  
  let material = new THREE.MeshPhysicalMaterial( { 
      color: 0xffbda1,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      roughness: 0.2,
      metalness: 0.5,
      reflectivity: 0.5,
      flatShading: true
  });
  
  let cylinder = new THREE.Mesh( geometry, material );
  //cylinder.rotateZ(Math.PI);
  cylinder.position.set(x,y+0.3*proportion,z);
  //scene.add( cylinder );
  return cylinder;
}
