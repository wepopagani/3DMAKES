import React, { useRef, useEffect } from 'react';
import THREE from '../utils/threeInstance';import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Cloud } from '@react-three/drei';

function Building({ position, height, color }: { position: [number, number, number], height: number, color: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, height, 1]} />
      <meshPhongMaterial 
        color={color}
        transparent
        opacity={0.8}
        shininess={50}
      />
    </mesh>
  );
}

function LocationMarker({ position }: { position: [number, number, number] }) {
  const markerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + position[1];
    }
  });

  return (
    <group ref={markerRef}>
      {/* Marker pin */}
      <mesh position={position} castShadow>
        <cylinderGeometry args={[0.2, 0, 1, 16]} />
        <meshPhongMaterial color="#dc2626" />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh position={[position[0], position[1] - 0.4, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.5} />
      </mesh>

      {/* Location label */}
      <Text
        position={[position[0], position[1] + 1.5, position[2]]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        3DMAKES
      </Text>
    </group>
  );
}

interface CloudProps {
  opacity: number;
  speed: number;
  width: number;
  depth: number;
  segments: number;
  position: [number, number, number];
}

const Cloud: React.FC<CloudProps> = (props) => {
  // ... implementazione cloud
};

function CityScene() {
  // Load satellite texture
  const texture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  
  // Create a grid of buildings with varied heights
  const buildings = [];
  const gridSize = 10;
  const spacing = 1.5;
  
  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      // Skip the center area for the marker
      if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
      
      const height = 1 + Math.random() * 4;
      const position: [number, number, number] = [x * spacing, height / 2, z * spacing];
      
      // Use more realistic building colors
      const color = new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.3, 0.4 + Math.random() * 0.2);
      
      buildings.push(
        <Building
          key={`${x}-${z}`}
          position={position}
          height={height}
          color={color.getStyle()}
        />
      );
    }
  }

  return (
    <>
      <fog attach="fog" args={['#000000', 30, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ground plane with satellite texture */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial 
          map={texture}
          displacementScale={2}
          shininess={0}
        />
      </mesh>

      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[3, 100]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[3, 100]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Buildings */}
      {buildings}
      
      {/* Location marker */}
      <LocationMarker position={[0, 0, 0]} />

      {/* Atmospheric clouds */}
      <Cloud 
        opacity={0.5}
        speed={0.4}
        width={100}
        depth={1.5}
        segments={20}
        position={[0, 20, 0]}
      />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function Map3D() {
  return (
    <div className="h-[300px] rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ position: [15, 15, 15], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <CityScene />
      </Canvas>
      
      {/* Overlay with address */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg">
        <p className="text-white text-sm">
          Via Pietro Peri 9E<br />
          6900 Lugano<br />
          Switzerland
        </p>
      </div>
      
      {/* Controls hint */}
      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
        <p className="text-xs text-gray-400">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}