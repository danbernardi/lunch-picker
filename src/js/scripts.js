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

  let power;
  let keyStart;
  let keyEnd;
  let keyIsHeld = false;
  const meter = document.querySelector('.strengthMeter');
  const meterBar = meter.querySelector('.meterBar');

  const tl = new TimelineMax();
  tl.to(meterBar, 4, { width: '100%', ease: Power3.easeOut }, 'start');
  tl.to(meter, 0.1, { x: '+=10', yoyo: true, repeat: -1 }, 'start+=2.25');
  tl.pause();

  function onKeyDown (evt) {
    const key = evt.sourceEvent.code;

    if (key === 'Space' && !keyIsHeld) {
      // console.log('keydown');
      keyIsHeld = true;
      keyStart = window.performance.now();
      tl.play();
    }
  }

  function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  function onKeyUp (evt) {
    // console.log('keyUp');
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

      const oldBullet = scene.getMeshByName('bullet')
      if (oldBullet) oldBullet.dispose();

      const bullet = new BABYLON.Mesh.CreateBox('bullet', 0.5, scene);
      bullet.physicsImposter = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.BoxImpostor, { friction: 2, mass: 3, restitution: 0.3 }, scene);

      console.log(tiles);
      tiles.forEach((tile, index) => {
        const triggerBulletCollision = (event) => {
          tiles.forEach((tile, index) => { tile.material.emissiveColor = new BABYLON.Color3(0, 0, 0); });
          tile.material.emissiveColor = new BABYLON.Color3(1, 1, 1); 
        }

        tile.actionManager = new BABYLON.ActionManager(scene);
        tile.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: bullet
        }, triggerBulletCollision));
      });

      const mappedStrength = mapRange(keyEnd - keyStart, minDiff, maxDiff, minStrength, maxStrength);
      console.log(mappedStrength); 
      bullet.position.x = scene.activeCamera.position.x;
      bullet.position.y = scene.activeCamera.position.y;
      bullet.position.z = scene.activeCamera.position.z;
      bullet.physicsImposter.applyImpulse(new BABYLON.Vector3(0, 0, -mappedStrength), bullet.getAbsolutePosition());
    }
  }

  const tiles = [];

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

  generateTiles(tileData);

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
