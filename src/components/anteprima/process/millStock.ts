import { MeshBVH } from "three-mesh-bvh";
import * as THREE from "three";
import type { HousingAsset } from "./housing";

const PASSES = 4;
const ROWS = 9;
const RADIUS = 0.108;
const PLUNGE = 0.07;

export type MillStock = {
  mesh: THREE.InstancedMesh;
  update: (progress: number) => void;
  toolAt: (progress: number) => THREE.Vector3;
};

type Sweep = { x0: number; x1: number; z: number; depth: number };

export function createMillStock(asset: HousingAsset): MillStock {
  const bounds = asset.bounds;
  const minX = bounds.min.x - 0.08;
  const maxX = bounds.max.x + 0.08;
  const minZ = bounds.min.z - 0.08;
  const maxZ = bounds.max.z + 0.08;
  const stockTop = bounds.max.y + 0.1;
  const stockBottom = bounds.min.y - 0.012;
  const cell = 0.026;
  const cols = Math.max(2, Math.ceil((maxX - minX) / cell));
  const gridRows = Math.max(2, Math.ceil((maxZ - minZ) / cell));
  const cellX = (maxX - minX) / cols;
  const cellZ = (maxZ - minZ) / gridRows;
  const count = cols * gridRows;

  const partTop = new Float32Array(count);
  const bvh = new MeshBVH(asset.geometry);
  const ray = new THREE.Ray();
  const origin = new THREE.Vector3();
  const down = new THREE.Vector3(0, -1, 0);
  for (let iz = 0; iz < gridRows; iz += 1) {
    for (let ix = 0; ix < cols; ix += 1) {
      origin.set(minX + (ix + 0.5) * cellX, stockTop + 1, minZ + (iz + 0.5) * cellZ);
      ray.set(origin, down);
      const hit = bvh.raycastFirst(ray, THREE.FrontSide);
      partTop[iz * cols + ix] = hit ? hit.point.y : Number.NEGATIVE_INFINITY;
    }
  }

  const geometry = new THREE.BoxGeometry(cellX, 1, cellZ);
  geometry.translate(0, 0.5, 0);
  const material = new THREE.MeshStandardMaterial({
    color: "#c2ae90",
    roughness: 0.58,
    metalness: 0.48,
    envMapIntensity: 0.35,
    transparent: true,
    opacity: 0,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  mesh.visible = false;
  mesh.matrixAutoUpdate = false;

  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  const matrix = new THREE.Matrix4();
  const tool = new THREE.Vector3();

  const lapDepth = (lap: number) => THREE.MathUtils.lerp(stockTop, stockBottom + 0.004, (lap + 1) / PASSES);

  const sweepOf = (lap: number, row: number, local: number): Sweep => {
    const forward = lap % 2 === 0;
    const zRow = forward ? row : ROWS - 1 - row;
    const leftToRight = (zRow + (forward ? 0 : 1)) % 2 === 0;
    const z = THREE.MathUtils.lerp(minZ, maxZ, (zRow + 0.5) / ROWS);
    const start = leftToRight ? minX : maxX;
    const end = leftToRight ? maxX : minX;
    return {
      x0: start,
      x1: THREE.MathUtils.lerp(start, end, local),
      z,
      depth: lapDepth(lap),
    };
  };

  const surfaceAt = (x: number, z: number) => {
    const ix = Math.floor((x - minX) / cellX);
    const iz = Math.floor((z - minZ) / cellZ);
    if (ix < 0 || iz < 0 || ix >= cols || iz >= gridRows) return stockBottom;
    const value = partTop[iz * cols + ix];
    return Number.isFinite(value) ? value : stockBottom;
  };

  const poseAt = (progress: number) => {
    const laps = Math.min(0.999999, Math.max(0, progress)) * PASSES;
    const lap = Math.min(PASSES - 1, Math.floor(laps));
    const frac = laps - lap;
    const depth = lapDepth(lap);
    const previous = lap === 0 ? stockTop + 0.09 : lapDepth(lap - 1);
    if (frac < PLUNGE) {
      const start = sweepOf(lap, 0, 0);
      const y = THREE.MathUtils.lerp(previous, depth, frac / PLUNGE);
      tool.set(start.x0, Math.max(y, surfaceAt(start.x0, start.z) + 0.012), start.z);
      return tool;
    }
    const raster = (frac - PLUNGE) / (1 - PLUNGE);
    const along = raster * ROWS;
    const row = Math.min(ROWS - 1, Math.floor(along));
    const local = along >= ROWS ? 1 : along - row;
    const sweep = sweepOf(lap, row, local);
    tool.set(sweep.x1, Math.max(depth, surfaceAt(sweep.x1, sweep.z) + 0.012), sweep.z);
    return tool;
  };

  const reaches = (x: number, z: number, sweep: Sweep) => {
    const left = Math.min(sweep.x0, sweep.x1);
    const right = Math.max(sweep.x0, sweep.x1);
    const nearest = Math.min(right, Math.max(left, x));
    return (x - nearest) * (x - nearest) + (z - sweep.z) * (z - sweep.z) <= RADIUS * RADIUS;
  };

  const cutDepth = (x: number, z: number, progress: number) => {
    const laps = Math.min(0.999999, Math.max(0, progress)) * PASSES;
    const lapNow = Math.min(PASSES - 1, Math.floor(laps));
    const frac = laps - Math.floor(laps);
    let deepest = stockTop;

    const applySweep = (sweep: Sweep) => {
      if (reaches(x, z, sweep)) deepest = Math.min(deepest, sweep.depth);
    };

    for (let lap = 0; lap <= lapNow; lap += 1) {
      const complete = lap < lapNow || frac >= 0.999;
      const raster = complete ? 1 : Math.max(0, (frac - PLUNGE) / (1 - PLUNGE));
      if (!complete && frac < PLUNGE) {
        const start = sweepOf(lap, 0, 0);
        const previous = lap === 0 ? stockTop + 0.09 : lapDepth(lap - 1);
        start.depth = THREE.MathUtils.lerp(previous, lapDepth(lap), frac / PLUNGE);
        start.x1 = start.x0;
        if (reaches(x, z, start)) deepest = Math.min(deepest, start.depth);
        continue;
      }
      const start = sweepOf(lap, 0, 0);
      start.x1 = start.x0;
      applySweep(start);
      const covered = complete ? ROWS : Math.min(ROWS, raster * ROWS);
      const fullRows = Math.floor(covered);
      const partial = covered - fullRows;
      for (let row = 0; row < fullRows && row < ROWS; row += 1) applySweep(sweepOf(lap, row, 1));
      if (!complete && partial > 0 && fullRows < ROWS) applySweep(sweepOf(lap, fullRows, partial));
    }

    return deepest;
  };

  const update = (progress: number) => {
    let index = 0;
    for (let iz = 0; iz < gridRows; iz += 1) {
      for (let ix = 0; ix < cols; ix += 1) {
        const x = minX + (ix + 0.5) * cellX;
        const z = minZ + (iz + 0.5) * cellZ;
        const floor = Number.isFinite(partTop[index]) ? partTop[index] : stockBottom;
        const top = Math.max(floor, cutDepth(x, z, progress));
        if (top <= floor + 0.01) {
          scale.set(0, 0, 0);
          position.set(x, stockBottom, z);
        } else {
          scale.set(1, top - stockBottom, 1);
          position.set(x, stockBottom, z);
        }
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
        index += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  update(0);
  return { mesh, update, toolAt: poseAt };
}
