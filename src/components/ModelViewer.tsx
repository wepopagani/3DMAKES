import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Html } from '@react-three/drei';
import { analyzeGeometry, ModelAnalysis } from '../utils/modelAnalysis';
import { Object3D } from 'three';
import THREE, { STLLoader, OBJLoader } from '../utils/threeInstance';

interface ModelViewerProps {
  file: File | null;
  fileType: string;
  onAnalysis?: (analysis: ModelAnalysis) => void;
  uploadPrompt?: string;
  onDimensions?: (dims: { x: number; y: number; z: number }) => void;
  onOrientationChange?: (rotation: { x: number; y: number; z: number }) => void;
}

// Use window.matchMedia instead of navigator.userAgent
const isMobile = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

// Aggiungi questa funzione per calcolare la posizione ottimale
const calculateOptimalRotation = (geometry: THREE.BufferGeometry | THREE.Group) => {
  let bbox: THREE.Box3;
  
  if (geometry instanceof THREE.BufferGeometry) {
    bbox = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position as THREE.BufferAttribute);
  } else {
    bbox = new THREE.Box3().setFromObject(geometry);
  }

  const size = new THREE.Vector3();
  bbox.getSize(size);

  // Calcola il rapporto tra le dimensioni
  const ratio = {
    xy: size.x / size.y,
    xz: size.x / size.z,
    yz: size.y / size.z
  };

  // Determina la rotazione ottimale
  const rotation = new THREE.Vector3(0, 0, 0);

  // Se l'oggetto è più alto che largo, ruotalo di 90 gradi
  if (size.z > size.x && size.z > size.y) {
    rotation.x = Math.PI / 2;
  }
  // Se l'oggetto è più largo che alto, ruotalo di 90 gradi
  else if (size.x > size.z && size.x > size.y) {
    rotation.z = Math.PI / 2;
  }

  // Calcola il centro
  const center = new THREE.Vector3();
  bbox.getCenter(center);

  return {
    rotation,
    center,
    size
  };
};

interface PlacementPlane {
  normal: THREE.Vector3;
  area: number;
  rotation: THREE.Euler;
  position: THREE.Vector3;
  dimensions: THREE.Vector2;
}

function getLargeFlatFaces(geometry: THREE.BufferGeometry, thresholdArea = 100): PlacementPlane[] {
  const position = geometry.attributes.position;
  const index = geometry.index;
  const faces: PlacementPlane[] = [];

  if (!index) return faces;

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);

    const va = new THREE.Vector3().fromBufferAttribute(position, a);
    const vb = new THREE.Vector3().fromBufferAttribute(position, b);
    const vc = new THREE.Vector3().fromBufferAttribute(position, c);

    const ab = new THREE.Vector3().subVectors(vb, va);
    const ac = new THREE.Vector3().subVectors(vc, va);
    const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();

    const area = 0.5 * ab.cross(ac).length();
    if (area > thresholdArea) {
      const centroid = new THREE.Vector3().add(va).add(vb).add(vc).divideScalar(3);

      faces.push({
        normal,
        area,
        position: centroid,
        rotation: new THREE.Euler(),
        dimensions: new THREE.Vector2(Math.sqrt(area), Math.sqrt(area)),
      });
    }
  }
  return faces;
}

function Model({ file, fileType, onDimensions }: ModelViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [faces, setFaces] = useState<PlacementPlane[]>([]);
  const modelRef = useRef<THREE.Mesh | THREE.Group>(null);

  const orientModelToFace = (face: PlacementPlane) => {
    if (!modelRef.current) return;

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      face.normal,
      new THREE.Vector3(0, 1, 0)
    );

    modelRef.current.setRotationFromQuaternion(quaternion);

    // Aggiorna la posizione per mantenere il modello sul piano
    const bbox = new THREE.Box3().setFromObject(modelRef.current);
    const minY = bbox.min.y;
    modelRef.current.position.y -= minY;
  };

  useEffect(() => {
    if (!file) return;

    const loader = fileType.toLowerCase() === 'stl' ? new STLLoader() : new OBJLoader();
    const reader = new FileReader();

    reader.onload = () => {
      try {
        if (fileType.toLowerCase() === 'stl') {
          const result = (loader as STLLoader).parse(reader.result as ArrayBuffer);
          result.computeBoundingBox();
          const bbox = result.boundingBox!;
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          
          // Centra il modello alla base invece che al centro
          result.translate(-center.x, -bbox.min.y, -center.z);
          
          const size = new THREE.Vector3();
          bbox.getSize(size);
          onDimensions?.({ x: size.x, y: size.y, z: size.z });
          
          if (!result.hasAttribute('normal')) {
            result.computeVertexNormals();
          }

          // Calcola le facce piane
          const faces = getLargeFlatFaces(result);
          setFaces(faces);
          
          setGeometry(result);
        } else {
          const result = (loader as OBJLoader).parse(reader.result as string);
          const bbox = new THREE.Box3().setFromObject(result);
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          
          // Centra il modello alla base invece che al centro
          result.position.set(-center.x, -bbox.min.y, -center.z);
          
          const size = new THREE.Vector3();
          bbox.getSize(size);
          onDimensions?.(size);
          
          setGeometry(result);
        }
      } catch (err) {
        console.error('Error processing model:', err);
        setError('Errore nel processamento del modello 3D');
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file, fileType, onDimensions]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 1.5, 0]}>
          <div className="bg-black/70 text-red-500 p-3 rounded text-center">
            {error}
          </div>
        </Html>
      </mesh>
    );
  }

  if (!geometry) return null;

  if (geometry instanceof THREE.BufferGeometry) {
    const size = new THREE.Vector3();
    geometry.boundingBox?.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 4 / maxDim : 1;

    return (
      <>
        <mesh 
          ref={modelRef as any}
          scale={[scale, scale, scale]}
          position={[0, 0, 0]}
        >
          <primitive object={geometry} attach="geometry" />
          <meshPhysicalMaterial
            color={0xdddddd}
            metalness={0.2}
            roughness={0.3}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
            reflectivity={1}
            envMapIntensity={0.5}
          />
        </mesh>
        {faces.map((face, idx) => (
          <mesh
            key={idx}
            position={face.position}
            rotation={face.rotation}
            onClick={() => orientModelToFace(face)}
          >
            <planeGeometry args={[face.dimensions.x, face.dimensions.y]} />
            <meshStandardMaterial color="#ff69b4" transparent opacity={0.3} />
          </mesh>
        ))}
      </>
    );
  }

  const bbox = new THREE.Box3().setFromObject(geometry);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? 4 / maxDim : 1;

  return (
    <primitive 
      ref={modelRef as any}
      object={geometry} 
      scale={[scale, scale, scale]}
      position={[0, 2, 0]}
    />
  );
}

export default function ModelViewer({ file, fileType, onDimensions }: ModelViewerProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 rounded-md">
        <p className="text-gray-400">Carica un modello 3D</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <div className="group relative">
          <button 
            className="w-8 h-8 flex items-center justify-center bg-gray-900/50 hover:bg-gray-800/70 text-gray-400 hover:text-white rounded-full transition-all duration-200"
            title="Informazioni"
          >
            i
          </button>
          <div className="absolute right-0 mt-2 w-64 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
            Non ti piace l'orientamento? Controlla nel tuo software la posizione e ricaricalo come preferisci
          </div>
        </div>
      </div>

      <Canvas className="w-full h-full">
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={35} />
        <Suspense fallback={null}>
          <Model file={file} fileType={fileType} onDimensions={onDimensions} />
        </Suspense>
        <OrbitControls 
          enableDamping 
          dampingFactor={0.1}
          minDistance={1}
          maxDistance={100}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#333" 
            metalness={0}
            roughness={1}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

// Aggiungo un nuovo componente alla fine del file per la sezione preventivo
export const ModelViewerPreventivo: React.FC<ModelViewerProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a', borderRadius: '8px' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={1}
          position={[5, 10, 5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <Model {...props} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.8}
          minDistance={2}
          maxDistance={20}
        />
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.6}
          scale={10}
          blur={1}
          far={5}
        />
      </Canvas>
    </div>
  );
};
