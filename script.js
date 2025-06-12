const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planetsData = [
  { name: "Mercury", color: 0xaaa9ad, size: 0.3, distance: 4, speed: 0.04 },
  { name: "Venus", color: 0xffdd44, size: 0.5, distance: 6, speed: 0.035 },
  { name: "Earth", color: 0x2266ff, size: 0.6, distance: 8, speed: 0.03 },
  { name: "Mars", color: 0xff2200, size: 0.45, distance: 10, speed: 0.025 },
  { name: "Jupiter", color: 0xffa500, size: 1.2, distance: 13, speed: 0.02 },
  { name: "Saturn", color: 0xffcc99, size: 1.1, distance: 16, speed: 0.015 },
  { name: "Uranus", color: 0x66ccff, size: 0.9, distance: 19, speed: 0.01 },
  { name: "Neptune", color: 0x3333ff, size: 0.85, distance: 22, speed: 0.008 }
];

// Planet objects
const planets = [];
const orbitSpeeds = {};
const slidersContainer = document.getElementById('sliders');

planetsData.forEach((data, index) => {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const planet = new THREE.Mesh(geometry, material);

  const pivot = new THREE.Object3D();
  pivot.rotation.z = Math.random(); // Random orbit tilt
  pivot.add(planet);
  planet.position.x = data.distance;

  scene.add(pivot);

  planets.push({ mesh: planet, pivot: pivot, angle: 0 });
  orbitSpeeds[index] = data.speed;

  // Add slider
  const sliderWrapper = document.createElement('div');
  sliderWrapper.innerHTML = `
    <label class="slider-label">${data.name}</label><br/>
    <input type="range" min="0" max="0.1" step="0.001" value="${data.speed}" id="slider-${index}">
  `;
  slidersContainer.appendChild(sliderWrapper);

  document.getElementById(`slider-${index}`).addEventListener('input', (e) => {
    orbitSpeeds[index] = parseFloat(e.target.value);
  });
});

// Camera position
camera.position.z = 30;

// Animation
let isPaused = false;
document.getElementById('toggleBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('toggleBtn').textContent = isPaused ? "Resume" : "Pause";
});

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach((planet, i) => {
      planet.angle += orbitSpeeds[i];
      planet.pivot.rotation.y = planet.angle;
    });
  }

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
