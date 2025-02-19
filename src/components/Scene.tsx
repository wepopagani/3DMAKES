import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 200; i++) {
      const t = Math.random() * 100;
      const factor = 50 + Math.random() * 200;
      const speed = 0.0005 + Math.random() / 4000;
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      const xFactor = Math.cos(angle) * radius;
      const yFactor = (Math.random() - 0.5) * 40;
      const zFactor = Math.sin(angle) * radius;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  const particleRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (particleRef.current) {
      const positions = particleRef.current.geometry.attributes.position.array as Float32Array;
      particles.forEach((particle, i) => {
        const i3 = i * 3;
        particle.t += particle.speed;
        positions[i3] = particle.xFactor + Math.cos(particle.t) * 5;
        positions[i3 + 1] = particle.yFactor + Math.sin(particle.t * 0.5) * 3;
        positions[i3 + 2] = particle.zFactor + Math.sin(particle.t) * 5;
      });
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.7}
        color="#ff0000"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function PrintingAnimations() {
  const groupRefs = useRef<THREE.Group[]>([]);
  
  const positions = useMemo(() => {
    const pos = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 25;
      pos.push({
        x: Math.cos(angle) * radius,
        y: -5 + Math.random() * 10,
        z: Math.sin(angle) * radius,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    groupRefs.current.forEach((group, i) => {
      if (group) {
        const pos = positions[i];
        group.rotation.y = clock.getElapsedTime() * pos.speed;
        group.position.y += Math.sin(clock.getElapsedTime() + pos.phase) * 0.002;
      }
    });
  });

  return (
    <>
      {positions.map((pos, index) => (
        <group
          key={index}
          ref={(el) => (groupRefs.current[index] = el!)}
          position={[pos.x, pos.y, pos.z]}
          scale={0.5}
        >
          <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
              <torusKnotGeometry args={[1, 0.3, 100, 16]} />
              <meshPhongMaterial
                color="#ff0000"
                emissive="#ff0000"
                wireframe
                transparent
                opacity={0.2}
              />
            </mesh>
          </Float>
        </group>
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff0000" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <ParticleField />
      <PrintingAnimations />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}