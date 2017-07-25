import tileData from './data/tileData';
import { TimelineMax, Power3 } from 'gsap';

if (BABYLON.Engine.isSupported()) {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  const scene = new BABYLON.Scene(engine);
  scene.enablePhysics();

  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  // Attach camera to canvas inputs
  const camera = new BABYLON.ArcRotateCamera('camera', 1.57, 1.3, 70, BABYLON.Vector3.Zero(), scene);
  camera.upperRadiusLimit = 100;
  camera.lowerRadiusLimit = 8;
  camera.upperBetaLimit = 1.6;
  camera.lowerBetaLimit = 1;
  camera.upperAlphaLimit = 1.74;
  camera.lowerAlphaLimit = 1.401;

  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 1), scene);
  light.intensity = 0.8;

  const ground = BABYLON.Mesh.CreateBox('ground', 43.4, scene);
  ground.position.y = -6;
  ground.position.x = 0;
  ground.scaling.y = 0.02;
  ground.scaling.x = 0.56;
  ground.scaling.z = 1.3;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let tiles = [];

  function generateTiles (count) {
    tileData.forEach((data, i) => {
      const tile = BABYLON.Mesh.CreateBox(`tile${i}`, 8, scene);
      const tileMaterial = new BABYLON.StandardMaterial(`tile${i}Material`, scene);
      tileMaterial.diffuseColor = data.color;
      tile.material = tileMaterial;
      tile.position.y = -5.4;
      tile.position.x = data.x;
      tile.position.z = data.z;
      tile.scaling.y = 0.05;
      tile.physicsImpostor = new BABYLON.PhysicsImpostor(tile, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);

      tiles.push(tile);
    });
  }

  function generateBoxes(count) {
    for (let i = 0; i < count; i++) {
      const mesh = BABYLON.Mesh.CreateBox(`box${i}`, 2.0, scene);
      mesh.position.y = getRandomInt(5, 20);
      mesh.position.x = getRandomInt(-10, 10);
      mesh.position.z = getRandomInt(-10, 10);
      mesh.rotation.x = Math.PI/getRandomInt(0.01, 90);
      mesh.rotation.y = Math.PI/getRandomInt(0.01, 90);
      mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 0.3, mass: 3, restitution: getRandomInt(0.07, 1) }, scene);
      mesh.actionManager = new BABYLON.ActionManager(scene);
    };
  }

  generateTiles(tileData);
  // generateBoxes(1);

  const box = BABYLON.Mesh.CreateBox(`box`, 2.0, scene);
  box.position.y = getRandomInt(5, 20);
  box.position.x = getRandomInt(-10, 10);
  box.position.z = getRandomInt(-10, 10);
  box.rotation.x = Math.PI/getRandomInt(0.01, 90);
  box.rotation.y = Math.PI/getRandomInt(0.01, 90);
  box.physicsImposter = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 0.3, mass: 3, restitution: 0.3 }, scene);
  box.actionManager = new BABYLON.ActionManager(scene);

  const triggerBoxCollision = (event) => {
    console.log(event);
  }

  // box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnIntersectionExitTrigger, (e) => { console.log(e); } ));

  let power;
  let keyStart;
  let keyEnd;
  let keyIsHeld = false;
  const tl = new TimelineMax({ repeat: 2 });

  function onKeyDown (evt) {
    const key = evt.sourceEvent.code;

    if (key === 'Space' && !keyIsHeld) {
      console.log('keydown');
      keyIsHeld = true;
      keyStart = window.performance.now();
      const meter = document.querySelector('.strengthMeter');
      const meterBar = meter.querySelector('.meterBar');

      tl.to(meterBar, 4, { width: '100%', ease: Power3.easeOut }, 'start');
      tl.to(meter, 0.1, { x: '+=10', yoyo: true, repeat: -1 }, 'start+=2.25');
    }
  }

  function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  function onKeyUp (evt) {
    if (keyStart) {
      tl.pause();
      tl.progress(0);
      keyIsHeld = false;

      keyEnd = window.performance.now();
      // const difference = (55 - 200) / (keyEnd - keyStart);
      const minStrength = 55;
      const maxStrength = 200;
      const minDiff = 60;
      const maxDiff = 4000;

      const mappedStrength = mapRange(keyEnd - keyStart, minDiff, maxDiff, minStrength, maxStrength);

      const bullet = new BABYLON.Mesh.CreateBox('bullet', 0.5, scene);
      bullet.position.x = scene.activeCamera.position.x;
      bullet.position.y = scene.activeCamera.position.y;
      bullet.position.z = scene.activeCamera.position.z;
      bullet.physicsImposter = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 2, mass: 3, restitution: 0.3 }, scene);
      const camera = scene.activeCamera;
      const cameraPosition = camera.position;
      // debugger;
      
      bullet.physicsImposter.applyImpulse(new BABYLON.Vector3(0, 0, -mappedStrength), bullet.getAbsolutePosition());
    }
  }

  // keyboard events
  scene.actionManager = new BABYLON.ActionManager(scene); 
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, onKeyDown));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, onKeyUp));


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

  scene.beforeRender = () => {
    // console.log(scene.activeCamera);
  }

  // Once the scene is loaded, just register a render loop to render it
  engine.runRenderLoop(function() {
    scene.render();
  });
}

window.addEventListener('resize', () => {
  engine.resize();
});
