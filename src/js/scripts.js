const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  scene.enablePhysics();

  var camera = new BABYLON.ArcRotateCamera('camera', 30, 1.4, 70, BABYLON.Vector3.Zero(), scene);
  camera.upperRadiusLimit = 100;
  camera.lowerRadiusLimit = 8;
  camera.upperBetaLimit = 1.6;
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(2, 1, 0), scene);
  light.intensity = 0.7;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const ground = BABYLON.Mesh.CreateGround('ground', 400, 400, 2, scene);
  ground.position.y = -7.5;
  ground.position.x = 0;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 5 }, scene);

  function generateBoxes(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateBox(`box${i}`, getRandomInt(0.5, 3.0), scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  function generateSpheres(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateSphere(`sphere${i}`, 16, getRandomInt(0.5, 3.0), scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  function generateCylinders(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateCylinder(`cylinder${i}`, getRandomInt(0.6, 3), getRandomInt(0.6, 3), getRandomInt(0.6, 3), 16, 1, scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  generateBoxes(50);
  generateSpheres(50);
  generateCylinders(50);

  // skybox
  const skybox = BABYLON.Mesh.CreateBox('skybox', 1000, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMat', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 1, 0);
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/skybox', scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skybox.infiniteDistance = true;
  skybox.material = skyboxMaterial;

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
