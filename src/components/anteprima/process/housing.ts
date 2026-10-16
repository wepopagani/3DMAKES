import { Brush, Evaluator, ADDITION, SUBTRACTION, type CSGOperation } from "three-bvh-csg";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type HousingAsset = {
  geometry: THREE.BufferGeometry;
  layers: THREE.BufferGeometry[];
  points: Float32Array;
  pointRand: Float32Array;
  bounds: THREE.Box3;
  engraveY: number;
};

const POINT_COUNT = 2800;
const LAYER_COUNT = 192;

function cylinderY(radius: number, height: number, segments: number) {
  return new THREE.CylinderGeometry(radius, radius, height, segments);
}

function cylinderZ(radius: number, height: number, segments: number) {
  const geometry = cylinderY(radius, height, segments);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

function cylinderX(radius: number, height: number, segments: number) {
  const geometry = cylinderY(radius, height, segments);
  geometry.rotateZ(Math.PI / 2);
  return geometry;
}

function place(geometry: THREE.BufferGeometry, x: number, y: number, z: number) {
  const brush = new Brush(geometry);
  brush.position.set(x, y, z);
  brush.updateMatrixWorld();
  return brush;
}

function buildSolid() {
  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  let solid = place(new THREE.BoxGeometry(1.92, 0.16, 1.22), 0, 0.08, 0);
  const steps: Array<[THREE.BufferGeometry, CSGOperation, number, number, number]> = [
    [new THREE.BoxGeometry(1.42, 0.62, 0.88), ADDITION, 0, 0.47, -0.04],
    [cylinderZ(0.32, 0.5, 48), ADDITION, 0, 0.5, 0.52],
    [cylinderZ(0.16, 0.4, 36), SUBTRACTION, 0, 0.5, 0.7],
    [new THREE.BoxGeometry(0.62, 0.1, 0.36), SUBTRACTION, 0, 0.75, -0.12],
    [cylinderX(0.42, 2.2, 28), SUBTRACTION, 0, 1.12, 0.55],
    [cylinderX(0.085, 0.55, 22), SUBTRACTION, -0.78, 0.4, -0.05],
    [new THREE.BoxGeometry(0.5, 0.08, 0.18), SUBTRACTION, 0.15, 0.74, 0.22],
  ];

  for (const [geometry, operation, x, y, z] of steps) {
    solid = evaluator.evaluate(solid, place(geometry, x, y, z), operation);
    solid.updateMatrixWorld();
  }

  for (const [x, z] of [
    [0.76, 0.46],
    [0.76, -0.46],
    [-0.76, 0.46],
    [-0.76, -0.46],
  ] as const) {
    solid = evaluator.evaluate(solid, place(cylinderY(0.052, 0.3, 18), x, 0.08, z), SUBTRACTION);
    solid.updateMatrixWorld();
  }

  const geometry = solid.geometry.clone();
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox!.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.computeBoundingBox();
  return { geometry, evaluator };
}

type SlicePoint = { x: number; y: number; z: number; cut: boolean };
type CapLoop = Array<{ x: number; z: number }>;

const PLANE_EPS = 1e-6;

function cutAt(a: SlicePoint, b: SlicePoint, y: number): SlicePoint {
  const dy = b.y - a.y;
  const t = Math.abs(dy) < 1e-12 ? 0.5 : Math.min(1, Math.max(0, (y - a.y) / dy));
  return {
    x: a.x + (b.x - a.x) * t,
    y,
    z: a.z + (b.z - a.z) * t,
    cut: true,
  };
}

function clipPlane(poly: SlicePoint[], yPlane: number, keepAbove: boolean) {
  const out: SlicePoint[] = [];
  for (let index = 0; index < poly.length; index += 1) {
    const current = poly[index];
    const next = poly[(index + 1) % poly.length];
    const currentIn = keepAbove ? current.y >= yPlane - PLANE_EPS : current.y <= yPlane + PLANE_EPS;
    const nextIn = keepAbove ? next.y >= yPlane - PLANE_EPS : next.y <= yPlane + PLANE_EPS;
    if (currentIn && nextIn) out.push(next);
    else if (currentIn && !nextIn) out.push(cutAt(current, next, yPlane));
    else if (!currentIn && nextIn) {
      out.push(cutAt(current, next, yPlane));
      out.push(next);
    }
  }
  return out;
}

function cleanPolygon(poly: SlicePoint[]) {
  const out: SlicePoint[] = [];
  for (const point of poly) {
    const previous = out[out.length - 1];
    if (
      previous &&
      Math.abs(previous.x - point.x) < 1e-7 &&
      Math.abs(previous.y - point.y) < 1e-7 &&
      Math.abs(previous.z - point.z) < 1e-7
    ) {
      continue;
    }
    out.push(point);
  }
  if (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.abs(first.x - last.x) < 1e-7 && Math.abs(first.y - last.y) < 1e-7 && Math.abs(first.z - last.z) < 1e-7) out.pop();
  }
  return out;
}

function faceNormal(a: SlicePoint, b: SlicePoint, c: SlicePoint) {
  const ux = b.x - a.x;
  const uy = b.y - a.y;
  const uz = b.z - a.z;
  const vx = c.x - a.x;
  const vy = c.y - a.y;
  const vz = c.z - a.z;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz);
  if (length < 1e-12) return null;
  return [nx / length, ny / length, nz / length] as const;
}

function emitFan(poly: SlicePoint[], positions: number[], normals: number[]) {
  for (let index = 1; index < poly.length - 1; index += 1) {
    const a = poly[0];
    const b = poly[index];
    const c = poly[index + 1];
    const normal = faceNormal(a, b, c);
    if (!normal) continue;
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    normals.push(normal[0], normal[1], normal[2], normal[0], normal[1], normal[2], normal[0], normal[1], normal[2]);
  }
}

function collectCaps(poly: SlicePoint[], yPlane: number, segments: number[]) {
  for (let index = 0; index < poly.length; index += 1) {
    const a = poly[index];
    const b = poly[(index + 1) % poly.length];
    if (Math.abs(a.y - yPlane) > 1e-5 || Math.abs(b.y - yPlane) > 1e-5) continue;
    if (!a.cut && !b.cut) continue;
    if (Math.hypot(a.x - b.x, a.z - b.z) < 1e-6) continue;
    segments.push(a.x, a.z, b.x, b.z);
  }
}

function signedArea(loop: CapLoop) {
  let area = 0;
  for (let index = 0; index < loop.length; index += 1) {
    const current = loop[index];
    const next = loop[(index + 1) % loop.length];
    area += current.x * next.z - next.x * current.z;
  }
  return area * 0.5;
}

function orientLoop(loop: CapLoop, counterclockwise: boolean) {
  return signedArea(loop) > 0 === counterclockwise ? loop : [...loop].reverse();
}

function centroid(loop: CapLoop) {
  let x = 0;
  let z = 0;
  for (const point of loop) {
    x += point.x;
    z += point.z;
  }
  return { x: x / loop.length, z: z / loop.length };
}

function pointInLoop(point: { x: number; z: number }, loop: CapLoop) {
  let inside = false;
  for (let index = 0, previous = loop.length - 1; index < loop.length; previous = index, index += 1) {
    const current = loop[index];
    const prior = loop[previous];
    const crosses = current.z > point.z !== prior.z > point.z;
    if (crosses && point.x < ((prior.x - current.x) * (point.z - current.z)) / (prior.z - current.z) + current.x) inside = !inside;
  }
  return inside;
}

function stitchLoops(segments: number[]) {
  const quantize = 8000;
  const keyOf = (x: number, z: number) => `${Math.round(x * quantize)}_${Math.round(z * quantize)}`;
  const count = segments.length / 4;
  const starts = new Map<string, number[]>();
  const startKeys: string[] = [];
  const endKeys: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const start = keyOf(segments[index * 4], segments[index * 4 + 1]);
    const end = keyOf(segments[index * 4 + 2], segments[index * 4 + 3]);
    startKeys.push(start);
    endKeys.push(end);
    const list = starts.get(start);
    if (list) list.push(index);
    else starts.set(start, [index]);
  }

  const used = new Uint8Array(count);
  const loops: CapLoop[] = [];
  let open = 0;
  for (let start = 0; start < count; start += 1) {
    if (used[start]) continue;
    const loop: CapLoop = [];
    let current = start;
    let closed = false;
    for (let guard = 0; guard <= count; guard += 1) {
      if (used[current]) break;
      used[current] = 1;
      loop.push({ x: segments[current * 4], z: segments[current * 4 + 1] });
      if (endKeys[current] === startKeys[start]) {
        closed = true;
        break;
      }
      const candidates = starts.get(endKeys[current]);
      const next = candidates?.find((candidate) => !used[candidate]);
      if (next === undefined) break;
      current = next;
    }
    if (closed && loop.length >= 3 && Math.abs(signedArea(loop)) > 1e-6) loops.push(loop);
    else open += 1;
  }
  return { loops, open };
}

function emitCap(loops: CapLoop[], y: number, upward: boolean, positions: number[], normals: number[]) {
  if (loops.length === 0) return;
  const nodes = loops.map((loop) => ({
    loop,
    area: Math.abs(signedArea(loop)),
    parent: -1,
    children: [] as number[],
  }));

  for (let index = 0; index < nodes.length; index += 1) {
    const center = centroid(nodes[index].loop);
    let parent = -1;
    let parentArea = Infinity;
    for (let other = 0; other < nodes.length; other += 1) {
      if (other === index || nodes[other].area <= nodes[index].area + 1e-6) continue;
      if (nodes[other].area < parentArea && pointInLoop(center, nodes[other].loop)) {
        parent = other;
        parentArea = nodes[other].area;
      }
    }
    nodes[index].parent = parent;
    if (parent >= 0) nodes[parent].children.push(index);
  }

  const normalY = upward ? 1 : -1;
  const add = (outer: CapLoop, holes: CapLoop[]) => {
    if (outer.length < 3) return;
    const contour = outer.map((point) => new THREE.Vector2(point.x, point.z));
    const holeContours = holes.filter((hole) => hole.length >= 3).map((hole) => hole.map((point) => new THREE.Vector2(point.x, point.z)));
    let faces: number[][] = [];
    try {
      faces = THREE.ShapeUtils.triangulateShape(contour, holeContours);
    } catch {
      return;
    }
    const flat = [outer, ...holes.filter((hole) => hole.length >= 3)].flat();
    for (const face of faces) {
      const a = flat[face[0]];
      const b = flat[face[1]];
      const c = flat[face[2]];
      if (!a || !b || !c) continue;
    // Positive XZ area produces a downward normal, so upward caps flip the winding.
    const second = normalY > 0 ? c : b;
    const third = normalY > 0 ? b : c;
      positions.push(a.x, y, a.z, second.x, y, second.z, third.x, y, third.z);
      normals.push(0, normalY, 0, 0, normalY, 0, 0, normalY, 0);
    }
  };

  const walk = (index: number) => {
    const node = nodes[index];
    add(
      orientLoop(node.loop, true),
      node.children.map((child) => orientLoop(nodes[child].loop, false))
    );
    for (const child of node.children) {
      for (const island of nodes[child].children) walk(island);
    }
  };

  for (let index = 0; index < nodes.length; index += 1) {
    if (nodes[index].parent < 0) walk(index);
  }
}

function sliceLayers(geometry: THREE.BufferGeometry) {
  const welded = mergeVertices(geometry, 1e-5);
  const source = welded.index ? welded.toNonIndexed() : welded;
  const attribute = source.getAttribute("position");
  const bounds = geometry.boundingBox!;
  const height = (bounds.max.y - bounds.min.y) / LAYER_COUNT;
  const overlap = Math.min(height * 0.12, 0.00045);
  const triangles: Array<{ minY: number; maxY: number; points: SlicePoint[] }> = [];

  for (let index = 0; index < attribute.count; index += 3) {
    const points: SlicePoint[] = [0, 1, 2].map((offset) => ({
      x: attribute.getX(index + offset),
      y: attribute.getY(index + offset),
      z: attribute.getZ(index + offset),
      cut: false,
    }));
    const minY = Math.min(points[0].y, points[1].y, points[2].y);
    const maxY = Math.max(points[0].y, points[1].y, points[2].y);
    triangles.push({ minY, maxY, points });
  }

  const layers: THREE.BufferGeometry[] = [];
  for (let index = 0; index < LAYER_COUNT; index += 1) {
    const slabBottom = bounds.min.y + height * index - (index === 0 ? 0 : overlap);
    const slabTop = bounds.min.y + height * (index + 1) + (index === LAYER_COUNT - 1 ? 0 : overlap);
    const positions: number[] = [];
    const normals: number[] = [];
    const bottomSegments: number[] = [];
    const topSegments: number[] = [];

    for (const triangle of triangles) {
      if (triangle.maxY < slabBottom || triangle.minY > slabTop) continue;
      let polygon = triangle.points;
      if (triangle.minY < slabBottom) polygon = cleanPolygon(clipPlane(polygon, slabBottom, true));
      if (polygon.length < 3) continue;
      if (triangle.maxY > slabTop) polygon = cleanPolygon(clipPlane(polygon, slabTop, false));
      if (polygon.length < 3) continue;
      emitFan(polygon, positions, normals);
      collectCaps(polygon, slabBottom, bottomSegments);
      collectCaps(polygon, slabTop, topSegments);
    }

    emitCap(stitchLoops(bottomSegments).loops, slabBottom, false, positions, normals);
    emitCap(stitchLoops(topSegments).loops, slabTop, true, positions, normals);
    if (positions.length < 9) continue;

    const layer = new THREE.BufferGeometry();
    layer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    layer.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    layer.computeBoundingSphere();
    layers.push(layer);
  }

  return layers;
}

function samplePoints(geometry: THREE.BufferGeometry) {
  const mesh = new THREE.Mesh(geometry);
  const sampler = new MeshSurfaceSampler(mesh).build();
  const points = new Float32Array(POINT_COUNT * 3);
  const pointRand = new Float32Array(POINT_COUNT);
  const sample = new THREE.Vector3();

  for (let index = 0; index < POINT_COUNT; index += 1) {
    sampler.sample(sample);
    points[index * 3] = sample.x;
    points[index * 3 + 1] = sample.y;
    points[index * 3 + 2] = sample.z;
    pointRand[index] = Math.random();
  }

  return { points, pointRand };
}

function engraveHeight(geometry: THREE.BufferGeometry) {
  const mesh = new THREE.Mesh(geometry);
  const ray = new THREE.Raycaster(new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, -1, 0));
  const hit = ray.intersectObject(mesh)[0];
  return hit ? hit.point.y + 0.004 : geometry.boundingBox!.max.y - 0.02;
}

let cached: HousingAsset | null = null;

export function getHousingAsset(): HousingAsset {
  if (cached) return cached;

  try {
    const { geometry } = buildSolid();
    const layers = sliceLayers(geometry);
    const { points, pointRand } = samplePoints(geometry);
    cached = {
      geometry,
      layers: layers.length > 0 ? layers : [geometry],
      points,
      pointRand,
      bounds: geometry.boundingBox!.clone(),
      engraveY: engraveHeight(geometry),
    };
    return cached;
  } catch (error) {
    console.error("Housing CSG failed", error);
    const geometry = new THREE.BoxGeometry(1.5, 0.7, 1);
    geometry.computeBoundingBox();
    const { points, pointRand } = samplePoints(geometry);
    cached = {
      geometry,
      layers: [geometry],
      points,
      pointRand,
      bounds: geometry.boundingBox!.clone(),
      engraveY: geometry.boundingBox!.max.y + 0.004,
    };
    return cached;
  }
}
