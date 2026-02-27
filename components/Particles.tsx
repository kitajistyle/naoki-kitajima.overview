'use client';

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
    count?: number;
}

export const Particles: React.FC<ParticlesProps> = ({ count = 100 }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random positions around the book spawn point
            positions[i3] = (Math.random() - 0.5) * 8;
            positions[i3 + 1] = (Math.random() - 0.5) * 8 - 2;
            positions[i3 + 2] = (Math.random() - 0.5) * 8;

            // Golden and white sparkle colors
            const isGold = Math.random() > 0.5;
            if (isGold) {
                colors[i3] = 1.0; // R
                colors[i3 + 1] = 0.84; // G
                colors[i3 + 2] = 0.0; // B
            } else {
                colors[i3] = 1.0;
                colors[i3 + 1] = 1.0;
                colors[i3 + 2] = 1.0;
            }

            // Random sizes
            sizes[i] = Math.random() * 0.1 + 0.05;

            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = Math.random() * 0.03 + 0.01;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }

        return { positions, colors, sizes, velocities };
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particles.velocities;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update positions based on velocities
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Reset particles that go too far
            if (positions[i3 + 1] > 5) {
                positions[i3] = (Math.random() - 0.5) * 8;
                positions[i3 + 1] = -5;
                positions[i3 + 2] = (Math.random() - 0.5) * 8;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Gentle rotation
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[particles.sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};
