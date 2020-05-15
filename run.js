//Game Logic
var update = () => {
  robot.move();
};

//Draw Scene
var render = () => {
  renderer.render(scene, camera);
};

//Run Gameloop (update, render, repeat)
var gameLoop = () => {
  requestAnimationFrame(gameLoop);
  update();
  render();
};

export default gameLoop;
