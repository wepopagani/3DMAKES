import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Html } from '@react-three/drei';
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
  
  // Logging per debug
  useEffect(() => {
    console.log("ModelViewer rendering with file:", file ? file.name : "none");
    console.log("File type:", fileType);
  }, [file, fileType]);
  
  // Handle auto-rotation
  useFrame(() => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (!file) {
      console.log("No file provided to ModelViewer");
      return;
    }

    let isSubscribed = true;
    const loader = fileType.toLowerCase() === 'stl' ? new STLLoader() : new OBJLoader();
    
    console.log("Loading 3D model with loader:", fileType.toLowerCase());
    
    if (readerRef.current) {
      readerRef.current.abort();
      readerRef.current = null;
    }

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onerror = (e) => {
      if (!isSubscribed) return;
      console.error("FileReader error:", e);
      setError('Failed to read the file. Please try again.');
    };

    reader.onload = () => {
      if (!isSubscribed) return;

      try {
        if (!reader.result) {
          throw new Error('File is empty');
        }

        console.log("File loaded, processing...");
        
        if (fileType.toLowerCase() === 'stl') {
          if (!(reader.result instanceof ArrayBuffer)) {
            throw new Error('Invalid STL file format');
          }

          try {
            console.log("Parsing STL file...");
            const result = (loader as STLLoader).parse(reader.result);
            if (!result.hasAttribute('normal')) {
              result.computeVertexNormals();
            }
            result.computeBoundingBox();
            
            // Centra la geometria sull'origine
            const center = new THREE.Vector3();
            result.boundingBox?.getCenter(center);
            result.translate(-center.x, -center.y, -center.z);
            
            if (isSubscribed) {
              setGeometry(result);
              console.log("STL geometry loaded successfully");
              
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
            console.log("Parsing OBJ file...");
            const result = (loader as OBJLoader).parse(reader.result);
            
            // Calcola bounding box del gruppo completo
            const bbox = new THREE.Box3().setFromObject(result);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            
            // Centra l'intero gruppo
            result.position.set(-center.x, -center.y, -center.z);
            
            let dimsFound = false;

            result.traverse((child: Object3D) => {
              if (child instanceof THREE.Mesh) {
                if (!child.geometry.hasAttribute('normal')) {
                  child.geometry.computeVertexNormals();
                }
                
                // Materiale migliorato per la visualizzazione
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0xdddddd,
                  metalness: 0.2,
                  roughness: 0.4,
                  clearcoat: 0.2,
                  clearcoatRoughness: 0.2,
                  reflectivity: 1
                });

                // Calcolo dimensioni child
                child.geometry.computeBoundingBox();
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
              console.log("OBJ geometry loaded successfully");
              
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

      console.log("Starting file read...");
      
      if (fileType.toLowerCase() === 'obj') {
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
        <Html position={[0, 1.5, 0]}>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'red',
            padding: '10px',
            borderRadius: '5px',
            width: '200px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        </Html>
      </mesh>
    );
  }

  if (!geometry) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="gray" wireframe />
      </mesh>
    );
  }

  if (geometry instanceof THREE.BufferGeometry) {
    const size = new THREE.Vector3();
    geometry.boundingBox?.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Normalizza le dimensioni del modello per adattarlo alla vista
    const scale = maxDim > 0 ? 4 / maxDim : 1;

    return (
      <mesh 
        ref={modelRef as any}
        scale={[scale, scale, scale]}
        position={[0, 0, 0]}
        onPointerOver={() => setIsRotating(false)}
        onPointerOut={() => setIsRotating(true)}
        castShadow
        receiveShadow
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
    );
  } else {
    // Calcola dimensioni del gruppo per scala appropriata
    const bbox = new THREE.Box3().setFromObject(geometry);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Normalizza le dimensioni del modello
    const scale = maxDim > 0 ? 4 / maxDim : 1;

    return (
      <primitive 
        ref={modelRef as any}
        object={geometry} 
        scale={[scale, scale, scale]}
        position={[0, 0, 0]}
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 rounded-md">
        <p className="text-gray-400">{uploadPrompt}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full relative">

      <Canvas shadows className="w-full h-full">
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.8}
          color="#a0a0ff"
        />
        <directionalLight
          position={[-10, -10, -10]}
          intensity={0.6}
        />
        <spotLight 
          position={[0, 15, 0]} 
          intensity={0.5} 
          angle={0.5} 
          penumbra={1} 
          castShadow 
        />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
        <Suspense fallback={<LoadingSpinner />}>
          <Model 
            file={file} 
            fileType={fileType} 
            onAnalysis={onAnalysis} 
            onDimensions={onDimensions} 
          />
        </Suspense>
        <OrbitControls 
          enableDamping 
          dampingFactor={0.1}
          minDistance={1}
          maxDistance={100}
          target={[0, 0, 0]}
          makeDefault
        />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={10}
          blur={1.5}
          far={1.5}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#222" 
            metalness={0.2} 
            roughness={0.8} 
            opacity={0.4} 
            transparent 
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
