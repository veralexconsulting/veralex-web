/**
 * VERALEX CONSULTING - Three.js 3D Background Scene
 * Premium maroon & gold themed 3D animation
 */

let scene, camera, renderer;
let particles, torusKnot, icosahedron;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1A0A0A, 0.0008);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1A0A0A, 1);
    container.appendChild(renderer.domElement);

    // Create particle system
    createParticles();

    // Create floating 3D objects
    createFloatingObjects();

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Gold and maroon colors
    const goldColor = new THREE.Color(0xD4AF37);
    const maroonColor = new THREE.Color(0x4A0E0E);
    const lightGold = new THREE.Color(0xF4D47C);

    for (let i = 0; i < particleCount; i++) {
        // Random positions in a sphere
        const radius = 1500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Random colors between gold and light gold
        const mixRatio = Math.random();
        const color = new THREE.Color();
        if (Math.random() > 0.7) {
            color.copy(maroonColor);
        } else {
            color.lerpColors(goldColor, lightGold, mixRatio);
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material for better looking particles
    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingObjects() {
    // Torus Knot - represents complexity of legal work
    const torusGeometry = new THREE.TorusKnotGeometry(100, 30, 100, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    torusKnot.position.set(-400, 100, -500);
    scene.add(torusKnot);

    // Icosahedron - represents precision and structure
    const icoGeometry = new THREE.IcosahedronGeometry(80, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0xF4D47C,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(350, -150, -400);
    scene.add(icosahedron);

    // Add some rings for decoration
    const ringGeometry = new THREE.RingGeometry(150, 155, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15
    });

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.set(0, 0, -800);
    ring1.rotation.x = Math.PI * 0.3;
    scene.add(ring1);

    const ring2 = ring1.clone();
    ring2.scale.set(1.5, 1.5, 1.5);
    ring2.rotation.y = Math.PI * 0.2;
    scene.add(ring2);

    const ring3 = ring1.clone();
    ring3.scale.set(2, 2, 2);
    ring3.rotation.z = Math.PI * 0.1;
    scene.add(ring3);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
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

    const time = Date.now() * 0.0001;

    // Rotate particles slowly
    if (particles) {
        particles.rotation.x = time * 0.2;
        particles.rotation.y = time * 0.3;
    }

    // Animate floating objects
    if (torusKnot) {
        torusKnot.rotation.x += 0.002;
        torusKnot.rotation.y += 0.003;
        torusKnot.position.y = 100 + Math.sin(time * 10) * 30;
    }

    if (icosahedron) {
        icosahedron.rotation.x += 0.003;
        icosahedron.rotation.z += 0.002;
        icosahedron.position.y = -150 + Math.cos(time * 8) * 25;
    }

    // Smooth camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
