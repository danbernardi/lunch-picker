const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  var camera = new BABYLON.ArcRotateCamera('camera', 30, 1.2, 15, BABYLON.Vector3.Zero(), scene);
  camera.upperRadiusLimit = 50;
  camera.lowerRadiusLimit = 8;
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const sun = BABYLON.Mesh.CreateSphere('sphere1', 16, 5, scene);
  const sunMaterial = new BABYLON.StandardMaterial('sunMaterial', scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture('assets/sun.jpg', scene);
  sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  sun.material = sunMaterial;
  sun.position.y = 1;

  const sunLight = new BABYLON.PointLight('sunlight', BABYLON.Vector3.Zero(), scene);
  sunLight.intensity = 6;

  const planet1 = new BABYLON.Mesh.CreateSphere('planet1', 16, 1, scene);
  const planet1Material = new BABYLON.StandardMaterial('planetMat1', scene);
  planet1Material.diffuseTexture = new BABYLON.Texture('assets/planet1.jpg', scene);
  planet1Material.specularColor = new BABYLON.Color3(1, 1, 1);
  planet1.material = planet1Material;
  planet1.position.x = 10;
  planet1.orbit = {
    radius: planet1.position.x,
    speed: 0.01,
    angle: 0
  };

  const planet2 = new BABYLON.Mesh.CreateSphere('planet2', 16, 1.3, scene);
  const planet2Material = new BABYLON.StandardMaterial('planetMat2', scene);
  planet2Material.diffuseTexture = new BABYLON.Texture('assets/planet2.jpg', scene);
  planet2Material.specularColor = new BABYLON.Color3(1, 1, 1);
  planet2.material = planet2Material;
  planet2.position.x = 5;
  planet2.orbit = {
    radius: planet2.position.x,
    speed: -0.01,
    angle: 0.4
  };

  const planet3 = new BABYLON.Mesh.CreateSphere('planet3', 16, 0.4, scene);
  const planet3Material = new BABYLON.StandardMaterial('planetMat3', scene);
  planet3Material.diffuseTexture = new BABYLON.Texture('assets/planet3.jpg', scene);
  planet3Material.specularColor = new BABYLON.Color3(1, 1, 1);
  planet3.material = planet3Material;
  planet3.position.x = 8;
  planet3.orbit = {
    radius: planet3.position.x,
    speed: 0.012,
    angle: 0
  };

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
    [planet1, planet2, planet3].forEach((planet) => {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);

      planet.orbit.angle += planet.orbit.speed;
    });
  }

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
