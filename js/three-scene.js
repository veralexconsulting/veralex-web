/**
 * VERALEX CONSULTING - Elegant Particle Background
 * White/neutral confetti particles with maroon & gold accents + batik nuance
 */

let scene, camera, renderer;
let particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let clock;

// Particle config
const PARTICLE_COUNT = 800;
const SPREAD_X = 2000;
const SPREAD_Y = 1500;
const SPREAD_Z = 1200;
const FALL_SPEED = 0.15;
const DRIFT_SPEED = 0.08;

function init() {
    const container = document.getElementById('three-container');
    if (!container) return;

    clock = new THREE.Clock();

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create the particle system
    createParticles();

    // Events
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Go
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const velocities = new Float32Array(PARTICLE_COUNT * 3); // vx, vy, vz
    const phases = new Float32Array(PARTICLE_COUNT); // for sine-wave drift

    // Color palette
    const palette = [
        new THREE.Color(0xFFFFFF),     // pure white
        new THREE.Color(0xF5F0E8),     // warm cream
        new THREE.Color(0xE8E0D4),     // soft beige
        new THREE.Color(0xD4CFC6),     // muted grey-cream
        new THREE.Color(0xF0ECE3),     // off-white
        new THREE.Color(0x8B2252),     // maroon accent
        new THREE.Color(0x6B1535),     // deep maroon
        new THREE.Color(0xD4AF37),     // gold accent
        new THREE.Color(0xC49B2C),     // darker gold
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Scatter across the viewport area
        positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
        positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;

        // Pick color: ~70% white/cream, ~15% maroon, ~15% gold
        let colorIdx;
        const roll = Math.random();
        if (roll < 0.70) {
            colorIdx = Math.floor(Math.random() * 5); // white/cream range (0-4)
        } else if (roll < 0.85) {
            colorIdx = 5 + Math.floor(Math.random() * 2); // maroon (5-6)
        } else {
            colorIdx = 7 + Math.floor(Math.random() * 2); // gold (7-8)
        }
        const c = palette[colorIdx];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        // Random sizes — small confetti dots
        sizes[i] = Math.random() * 3.5 + 1;

        // Velocities: gentle downward + slight horizontal drift
        velocities[i * 3] = (Math.random() - 0.5) * DRIFT_SPEED;  // vx
        velocities[i * 3 + 1] = -(Math.random() * FALL_SPEED + 0.05); // vy (falling)
        velocities[i * 3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.5; // vz

        // Phase offset for sine-wave wobble
        phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Store velocities and phases on geometry for animation access
    geometry.userData = { velocities, phases };

    const material = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.3;
    mouseY = (event.clientY - windowHalfY) * 0.3;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    if (particleSystem) {
        const geo = particleSystem.geometry;
        const positions = geo.attributes.position.array;
        const { velocities, phases } = geo.userData;

        const halfY = SPREAD_Y / 2;
        const halfX = SPREAD_X / 2;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Apply velocity
            positions[ix] += velocities[ix];
            positions[iy] += velocities[iy];
            positions[iz] += velocities[iz];

            // Sine-wave horizontal wobble
            positions[ix] += Math.sin(elapsed * 0.5 + phases[i]) * 0.15;

            // Wrap: if particle falls below bottom, reset to top
            if (positions[iy] < -halfY) {
                positions[iy] = halfY + Math.random() * 100;
                positions[ix] = (Math.random() - 0.5) * SPREAD_X;
                positions[iz] = (Math.random() - 0.5) * SPREAD_Z;
            }

            // Wrap horizontal
            if (positions[ix] > halfX) positions[ix] = -halfX;
            if (positions[ix] < -halfX) positions[ix] = halfX;
        }

        geo.attributes.position.needsUpdate = true;

        // Subtle global rotation for depth feel
        particleSystem.rotation.y = elapsed * 0.02;
    }

    // Smooth camera parallax following mouse
    camera.position.x += (mouseX - camera.position.x) * 0.015;
    camera.position.y += (-mouseY - camera.position.y) * 0.015;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
