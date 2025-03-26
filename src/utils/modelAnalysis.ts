import THREE from './threeInstance';

export interface ModelAnalysis {
  volume: number;       // in cubic centimeters (cm³)
  boundingBox: {
    x: number;
    y: number;
    z: number;
  };
  surfaceArea: number;  // in square centimeters (cm²)
}

export function analyzeGeometry(geometry: THREE.BufferGeometry): ModelAnalysis {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox!;
  
  // Calculate bounding box dimensions in centimeters
  const dimensions = {
    x: (boundingBox.max.x - boundingBox.min.x) / 10, // convert to cm
    y: (boundingBox.max.y - boundingBox.min.y) / 10,
    z: (boundingBox.max.z - boundingBox.min.z) / 10
  };

  // Calculate volume and surface area in chunks to avoid memory issues
  let volume = 0;
  let surfaceArea = 0;
  
  const positions = geometry.getAttribute('position').array;
  const indices = geometry.index ? geometry.index.array : null;
  
  // Process in chunks of 1000 triangles
  const CHUNK_SIZE = 1000;
  
  if (indices) {
    // For indexed geometry
    for (let i = 0; i < indices.length; i += CHUNK_SIZE * 3) {
      const endIndex = Math.min(i + CHUNK_SIZE * 3, indices.length);
      for (let j = i; j < endIndex; j += 3) {
        const v1 = new THREE.Vector3(
          positions[indices[j] * 3],
          positions[indices[j] * 3 + 1],
          positions[indices[j] * 3 + 2]
        );
        const v2 = new THREE.Vector3(
          positions[indices[j + 1] * 3],
          positions[indices[j + 1] * 3 + 1],
          positions[indices[j + 1] * 3 + 2]
        );
        const v3 = new THREE.Vector3(
          positions[indices[j + 2] * 3],
          positions[indices[j + 2] * 3 + 1],
          positions[indices[j + 2] * 3 + 2]
        );
        
        volume += signedVolumeOfTriangle(v1, v2, v3);
        surfaceArea += triangleArea(v1, v2, v3);
      }
    }
  } else {
    // For non-indexed geometry
    for (let i = 0; i < positions.length; i += CHUNK_SIZE * 9) {
      const endIndex = Math.min(i + CHUNK_SIZE * 9, positions.length);
      for (let j = i; j < endIndex; j += 9) {
        const v1 = new THREE.Vector3(positions[j], positions[j + 1], positions[j + 2]);
        const v2 = new THREE.Vector3(positions[j + 3], positions[j + 4], positions[j + 5]);
        const v3 = new THREE.Vector3(positions[j + 6], positions[j + 7], positions[j + 8]);
        
        volume += signedVolumeOfTriangle(v1, v2, v3);
        surfaceArea += triangleArea(v1, v2, v3);
      }
    }
  }

  // Convert to appropriate units and take absolute values
  volume = Math.abs(volume) / 1000; // Convert to cm³
  surfaceArea = surfaceArea / 100;  // Convert to cm²

  return {
    volume,
    boundingBox: dimensions,
    surfaceArea
  };
}

function signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
  const v321 = p3.x * p2.y * p1.z;
  const v231 = p2.x * p3.y * p1.z;
  const v312 = p3.x * p1.y * p2.z;
  const v132 = p1.x * p3.y * p2.z;
  const v213 = p2.x * p1.y * p3.z;
  const v123 = p1.x * p2.y * p3.z;
  return (-v321 + v231 + v312 - v132 - v213 + v123) / 6.0;
}

function triangleArea(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
  const a = new THREE.Vector3().subVectors(p2, p1);
  const b = new THREE.Vector3().subVectors(p3, p1);
  const cross = new THREE.Vector3().crossVectors(a, b);
  return cross.length() / 2;
}