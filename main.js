import init from "./physics-wasm/pkg/physics_wasm.js";
import Simulation from "./Simulation.js";

async function run() {
  await init();
  main();
}

function main() {
  let simulation = new Simulation();

  window.addEventListener("resize", () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    simulation.renderer.setSize(width, height);
    simulation.camera.aspect = width / height;
    simulation.camera.updateProjectionMatrix();
  });

  window.addEventListener("keydown", (e) => {
    if (e.keyCode == 87) {
      //Tecla W
      simulation.robot.accelerate(0.3);
      simulation.robot.accelerating = true;
    } else if (e.keyCode == 83) {
      //Tecla S
      simulation.robot.accelerate(-0.3);
      simulation.robot.accelerating = true;
    } else if (e.keyCode == 68) {
      // Left Arrow
      simulation.robot.angularAccelerate(-0.3);
      simulation.robot.angularAccelerating = true;
    } else if (e.keyCode == 65) {
      // Right Arrow
      simulation.robot.angularAccelerate(0.3);
      simulation.robot.angularAccelerating = true;
    }
    console.log("pressed");
  });

  //Run Gameloop (update, render, repeat)
  var gameLoop = () => {
    requestAnimationFrame(gameLoop);
    simulation.update();
    simulation.renderer.render(simulation.scene, simulation.camera);
  };

  gameLoop();
}

run();
