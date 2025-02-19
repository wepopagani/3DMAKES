import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { analyzeGeometry, ModelAnalysis } from '../utils/modelAnalysis';
import { Object3D } from 'three';

interface ModelViewerProps {
  file: File | null;
  fileType: string;
  onAnalysis?: (analysis: ModelAnalysis) => void;
  uploadPrompt?: string;
}

// Use window.matchMedia instead of navigator.userAgent
const isMobile = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

function Model({ file, fileType, onAnalysis }: ModelViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<FileReader | null>(null);
  const modelRef = useRef<THREE.Mesh | THREE.Group>(null);

  // Auto-rotation state
  const [isRotating, setIsRotating] = useState(true);
  
  // Handle auto-rotation
  useFrame((state) => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.005;
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
            result.scale.multiplyScalar(50);
            
            result.traverse((child: Object3D) => {
              if (child instanceof THREE.Mesh) {
                if (!child.geometry.hasAttribute('normal')) {
                  child.geometry.computeVertexNormals();
                }
                child.geometry.computeBoundingBox();
                child.geometry.center();

                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  metalness: 0.2,
                  roughness: 0.3,
                  clearcoat: 0.3,
                  clearcoatRoughness: 0.25,
                  reflectivity: 1
                });
              }
            });
            
            if (isSubscribed) {
              setGeometry(result);
              if (onAnalysis && result.children[0] instanceof THREE.Mesh) {
                const analysis = analyzeGeometry(result.children[0].geometry);
                onAnalysis(analysis);
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
  }, [file, fileType, onAnalysis]);

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
    const scale = 100 / maxDim;

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

export default function ModelViewer({ file, fileType, onAnalysis, uploadPrompt = 'Upload a 3D model to preview' }: ModelViewerProps) {
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full h-[400px] bg-gray-800 rounded-lg overflow-hidden relative">
      {!file ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">{uploadPrompt}</p>
        </div>
      ) : (
        <Canvas
          shadows
          dpr={isHighPerformance ? [1, 2] : 1}
          onError={(err) => setError(err instanceof Error ? err.message : 'Error loading model')}
          gl={{ 
            powerPreference: isHighPerformance ? "high-performance" : "default",
            antialias: true,
            alpha: false,
            logarithmicDepthBuffer: true
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 150]} fov={50} />
          
          <color attach="background" args={['#1f2937']} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Suspense fallback={<LoadingSpinner />}>
            <Model file={file} fileType={fileType} onAnalysis={onAnalysis} />
            
            <ContactShadows
              opacity={0.4}
              scale={10}
              blur={1}
              far={10}
              resolution={256}
              color="#000000"
            />
          </Suspense>

          <OrbitControls
            makeDefault
            minDistance={50}
            maxDistance={250}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            target={[0, 0, 0]}
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