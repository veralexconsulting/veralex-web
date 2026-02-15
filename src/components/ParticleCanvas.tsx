'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Particle system
        const PARTICLE_COUNT = 800;
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const velocities: { x: number; y: number; z: number; wobbleSpeed: number; wobbleAmount: number }[] = [];

        const palette = [
            new THREE.Color(0xffffff),
            new THREE.Color(0xfaf5e4),
            new THREE.Color(0xf5ebe0),
            new THREE.Color(0xe8ddd3),
            new THREE.Color(0xf8f4ef),
        ];
        const accents = [new THREE.Color(0x4a0e0e), new THREE.Color(0xd4af37)];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

            const isAccent = Math.random() < 0.2;
            const col = isAccent ? accents[Math.floor(Math.random() * accents.length)] : palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;

            sizes[i] = Math.random() * 2.0 + 0.5;
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: -(Math.random() * 0.03 + 0.01),
                z: (Math.random() - 0.5) * 0.01,
                wobbleSpeed: Math.random() * 0.02 + 0.005,
                wobbleAmount: Math.random() * 0.3 + 0.1,
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Mouse tracking
        const mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animate
        let frame = 0;
        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            frame++;

            const posArr = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                posArr[i3] += velocities[i].x + Math.sin(frame * velocities[i].wobbleSpeed) * velocities[i].wobbleAmount * 0.05;
                posArr[i3 + 1] += velocities[i].y;
                posArr[i3 + 2] += velocities[i].z;

                if (posArr[i3 + 1] < -60) posArr[i3 + 1] = 60;
                if (posArr[i3] > 60) posArr[i3] = -60;
                if (posArr[i3] < -60) posArr[i3] = 60;
            }
            geometry.attributes.position.needsUpdate = true;

            particles.rotation.y = mouse.x * 0.05;
            particles.rotation.x = mouse.y * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="three-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}
