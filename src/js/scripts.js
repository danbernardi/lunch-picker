if (BABYLON.Engine.isSupported()) {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  // engine.enableOfflineSupport = false;

  const scene = new BABYLON.Scene(engine);
  scene.enablePhysics();

  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  // Attach camera to canvas inputs
  const camera = new BABYLON.ArcRotateCamera('camera', 30, 1.4, 50, BABYLON.Vector3.Zero(), scene);
  camera.upperRadiusLimit = 100;
  camera.lowerRadiusLimit = 8;
  camera.upperBetaLimit = 1.6;
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  const ground = BABYLON.Mesh.CreateBox('ground', 17.0, scene);
  ground.position.y = -7.5;
  ground.position.x = 0;
  ground.scaling.y = 0.05;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function generateBoxes(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateBox(`box${i}`, getRandomInt(0.5, 2.5), scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1.3) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  function generateSpheres(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateSphere(`sphere${i}`, 16, getRandomInt(0.5, 2.5), scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1.3) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  generateBoxes(100);
  generateSpheres(100);

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

  // Once the scene is loaded, just register a render loop to render it
  engine.runRenderLoop(function() {
    scene.render();
  });
}

window.addEventListener('resize', () => {
  engine.resize();
});
