


function createRobot(x,y,z,proportion = 1){
  let group = new THREE.Group();
  group.add(generateAxis(x,y,z,proportion));
  group.add(generateBody(x,y,z,proportion));
  group.add(generateRightWheels(x,y,z,proportion));
  group.add(generateLeftWheels(x,y,z,proportion));
  group.add(generateHead(x,y,z,proportion));

  return group;
  //scene.add(group);
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
  
  let geometry = new THREE.TorusGeometry(0.05*proportion,0.3*proportion,14,21,4);
  
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