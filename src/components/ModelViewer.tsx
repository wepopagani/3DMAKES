import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import { analyzeGeometry, ModelAnalysis } from '../utils/modelAnalysis';
import { Object3D } from 'three';

interface ModelViewerProps {
  file: File | null;
  fileType: string;
  onAnalysis?: (analysis: ModelAnalysis) => void;
  uploadPrompt?: string;
  // AGGIUNTA: callback per dimensioni
  onDimensions?: (dims: { x: number; y: number; z: number }) => void;
}

// Use window.matchMedia instead of navigator.userAgent
const isMobile = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

function Model({ file, fileType, onAnalysis, onDimensions }: ModelViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<FileReader | null>(null);
  const modelRef = useRef<THREE.Mesh | THREE.Group>(null);

  // Auto-rotation state
  const [isRotating, setIsRotating] = useState(true);
  
  // Handle auto-rotation
  useFrame(() => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (!file) return;

    let isSubscribed = true;
    const loader = fileType === 'stl' ? new STLLoader() : new OBJLoader();
    
    if (readerRef.current) {
      readerRef.current.abort();
      readerRef.current = null;
    }

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onerror = () => {
      if (!isSubscribed) return;
      setError('Failed to read the file. Please try again.');
    };

    reader.onload = () => {
      if (!isSubscribed) return;

      try {
        if (!reader.result) {
          throw new Error('File is empty');
        }

        if (fileType === 'stl') {
          if (!(reader.result instanceof ArrayBuffer)) {
            throw new Error('Invalid STL file format');
          }

          try {
            const result = (loader as STLLoader).parse(reader.result);
            if (!result.hasAttribute('normal')) {
              result.computeVertexNormals();
            }
            result.computeBoundingBox();
            result.center();
            
            if (isSubscribed) {
              setGeometry(result);
              // Calcola dimensioni
              if (result.boundingBox) {
                const size = new THREE.Vector3();
                result.boundingBox.getSize(size);
                onDimensions?.({ x: size.x, y: size.y, z: size.z });
              }

              // Se c'è onAnalysis
              if (onAnalysis) {
                const analysis = analyzeGeometry(result);
                onAnalysis(analysis);
              }
            }
          } catch (err) {
            console.error('Error parsing STL:', err);
            setError('Invalid or corrupted STL file');
          }
        } else {
          if (typeof reader.result !== 'string') {
            throw new Error('Invalid OBJ file format');
          }

          try {
            const result = (loader as OBJLoader).parse(reader.result);
            // Esempio di scala
            result.scale.multiplyScalar(50);
            
            let dimsFound = false;

            result.traverse((child: Object3D) => {
              if (child instanceof THREE.Mesh) {
                if (!child.geometry.hasAttribute('normal')) {
                  child.geometry.computeVertexNormals();
                }
                child.geometry.computeBoundingBox();
                child.geometry.center();

                // Materiale base
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  metalness: 0.2,
                  roughness: 0.3,
                  clearcoat: 0.3,
                  clearcoatRoughness: 0.25,
                  reflectivity: 1
                });

                // Calcolo dimensioni child
                if (child.geometry.boundingBox) {
                  const size = new THREE.Vector3();
                  child.geometry.boundingBox.getSize(size);
                  dimsFound = true;
                  onDimensions?.({ x: size.x, y: size.y, z: size.z });
                }
              }
            });
            
            if (isSubscribed) {
              setGeometry(result);
              // onAnalysis
              if (onAnalysis && result.children[0] instanceof THREE.Mesh) {
                const analysis = analyzeGeometry(result.children[0].geometry);
                onAnalysis(analysis);
              }
              // Se non abbiamo trovato dimensioni in un mesh, potresti tentare boundingBox del group
              if (!dimsFound) {
                const groupBox = new THREE.Box3().setFromObject(result);
                const size = new THREE.Vector3();
                groupBox.getSize(size);
                onDimensions?.({ x: size.x, y: size.y, z: size.z });
              }
            }
          } catch (err) {
            console.error('Error parsing OBJ:', err);
            setError('Invalid or corrupted OBJ file');
          }
        }
      } catch (err) {
        console.error('Error processing file:', err);
        setError('Failed to process the 3D model');
      }
    };

    try {
      if (file.size === 0) {
        setError('File is empty');
        return;
      }

      if (fileType === 'obj') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      console.error('Error initiating file read:', err);
      setError('Failed to read the file');
    }

    return () => {
      isSubscribed = false;
      if (readerRef.current) {
        readerRef.current.abort();
        readerRef.current = null;
      }
    };
  }, [file, fileType, onAnalysis, onDimensions]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (!geometry) {
    return null;
  }

  if (geometry instanceof THREE.BufferGeometry) {
    const size = new THREE.Vector3();
    geometry.boundingBox?.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 100 / maxDim : 1;

    return (
      <mesh 
        ref={modelRef as any}
        scale={[scale, scale, scale]}
        onPointerOver={() => setIsRotating(false)}
        onPointerOut={() => setIsRotating(true)}
      >
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial
          color={0xffffff}
          metalness={0.2}
          roughness={0.3}
          clearcoat={0.3}
          clearcoatRoughness={0.25}
          reflectivity={1}
        />
      </mesh>
    );
  } else {
    return (
      <primitive 
        ref={modelRef}
        object={geometry}
        onPointerOver={() => setIsRotating(false)}
        onPointerOut={() => setIsRotating(true)}
      />
    );
  }
}

function LoadingSpinner() {
  return (
    <mesh>
      <torusGeometry args={[1, 0.2, 16, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

export default function ModelViewer({ 
  file, 
  fileType, 
  onAnalysis, 
  uploadPrompt = 'Carica un modello 3D per la visualizzazione', 
  onDimensions 
}: ModelViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 150]); // Posizione della camera

  // Use feature detection for device capabilities
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isHighPerformance = devicePixelRatio >= 2 && !isMobile();

  if (file && file.size > 50 * 1024 * 1024) {
    return (
      <div className="w-full h-[400px] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-red-500 text-center px-4">
          File is too large. Please upload a file smaller than 50MB.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden relative">
      {!file ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">{uploadPrompt}</p>
        </div>
      ) : (
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          <color attach="background" args={["#1f2937"]} />
          
          // Luce ambientale per illuminazione generale
          <ambientLight intensity={0.5} />
          // Luce direzionale per riflessi e ombre
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          
          <Suspense fallback={<LoadingSpinner />}>
            <Model file={file} fileType={fileType} onAnalysis={onAnalysis} onDimensions={onDimensions} />
            <ContactShadows opacity={0.4} scale={10} blur={1.5} far={10} resolution={256} color="#000000" />
          </Suspense>

          // Controlli migliorati per zoom e pan
          <OrbitControls 
            enableZoom 
            enablePan 
            dampingFactor={0.1} 
            rotateSpeed={0.5} 
            minDistance={50} // Distanza minima per lo zoom
            maxDistance={300} // Distanza massima per lo zoom
            target={[0, 0, 0]} // Centra il modello
          />
        </Canvas>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
          <p className="text-red-500 text-center px-4">{error}</p>
        </div>
      )}
      
      {file && !error && (
        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-xs text-gray-400">
            🖱️ Left click + drag to rotate<br />
            🖱️ Right click + drag to pan<br />
            🖱️ Scroll to zoom
          </p>
        </div>
      )}
    </div>
  );
}
