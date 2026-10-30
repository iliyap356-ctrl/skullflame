"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";
import { Mark, RING_ROLL, RING_TILT, STAR_PINCH, STAR_RAYS } from "./Logo";

const RING_RADIUS = 1.3;
const STAR_DEPTH = 0.34;
const STAR_FALLOFF = 0.75; // как быстро звезда истончается от центра к кончикам лучей
const RIM = 0.06; // ширина скругления по краю
const OUTLINE_STEPS = 64; // точек контура на промежуток между лучами
const RADIAL_STEPS = 48; // колец от центра к краю

// Звезда — одна гладкая поверхность: толщина зависит только от расстояния до центра
// (толстая середина, тонкие кончики) и плавно скругляется у края, поэтому нет швов между лучами
function buildStar(THREE: typeof Three) {
  const dir = (deg: number, len: number) => {
    const a = (deg * Math.PI) / 180;
    return new THREE.Vector2(Math.cos(a) * len, Math.sin(a) * len);
  };

  const outline: Three.Vector2[] = [];
  STAR_RAYS.forEach((ray, k) => {
    const next = STAR_RAYS[(k + 1) % STAR_RAYS.length];
    const nextAngle = next.angle > ray.angle ? next.angle : next.angle + 360;
    const curve = new THREE.QuadraticBezierCurve(
      dir(ray.angle, ray.length * RING_RADIUS),
      dir((ray.angle + nextAngle) / 2, STAR_PINCH * RING_RADIUS),
      dir(nextAngle, next.length * RING_RADIUS),
    );
    for (let i = 0; i < OUTLINE_STEPS; i++) outline.push(curve.getPoint(i / OUTLINE_STEPS));
  });

  const n = outline.length;
  const positions: number[] = [];
  const indices: number[] = [];
  const edgeDistance = (x: number, y: number) => {
    let min = Infinity;
    for (const p of outline) min = Math.min(min, (p.x - x) ** 2 + (p.y - y) ** 2);
    return Math.sqrt(min);
  };
  const height = (x: number, y: number) => {
    const body = Math.exp(-(x * x + y * y) / (STAR_FALLOFF * STAR_FALLOFF));
    const t = Math.min(1, edgeDistance(x, y) / RIM);
    return STAR_DEPTH * body * Math.sqrt(1 - (1 - t) ** 2);
  };

  // Высоты считаем один раз и используем для лица и спины
  const rings: number[][] = [];
  for (let r = 1; r <= RADIAL_STEPS; r++) {
    const u = 1 - (1 - r / RADIAL_STEPS) ** 2; // кольца гуще у края, где скругление
    const ring: number[] = [];
    for (const p of outline) ring.push(p.x * u, p.y * u, height(p.x * u, p.y * u));
    rings.push(ring);
  }

  for (const side of [1, -1]) {
    const center = positions.length / 3;
    positions.push(0, 0, side * STAR_DEPTH);
    const ring0 = positions.length / 3;
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i += 3) positions.push(ring[i], ring[i + 1], side * ring[i + 2]);
    }
    const at = (r: number, i: number) => ring0 + (r - 1) * n + (i % n);
    for (let i = 0; i < n; i++) {
      if (side > 0) indices.push(center, at(1, i), at(1, i + 1));
      else indices.push(center, at(1, i + 1), at(1, i));
    }
    for (let r = 1; r < RADIAL_STEPS; r++) {
      for (let i = 0; i < n; i++) {
        const a = at(r, i);
        const b = at(r, i + 1);
        const c = at(r + 1, i);
        const d = at(r + 1, i + 1);
        if (side > 0) indices.push(a, c, b, b, c, d);
        else indices.push(a, b, c, b, d, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Окружение — симметричный градиент «небо — горизонт — пол», как у классического хрома:
// яркий верх, мягкая линия горизонта, светло-серый низ без провалов в черноту
function buildEnvironment(THREE: typeof Three, renderer: Three.WebGLRenderer) {
  const env = new THREE.Scene();
  const dome = new THREE.SphereGeometry(10, 64, 32);
  const pos = dome.getAttribute("position");
  const colors: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const h = pos.getY(i) / 10;
    const v = h >= 0 ? 0.3 + 2.7 * Math.min(1, h / 0.55) : 0.03 + 0.6 * Math.min(1, -h / 0.6);
    colors.push(v, v, v * 1.03);
  }
  dome.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  env.add(
    new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })),
  );
  // Небольшой яркий софтбокс сверху-спереди по центру даёт чёткий блик
  const softbox = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 48),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(8, 8, 8), side: THREE.DoubleSide }),
  );
  softbox.position.set(0, 3.2, 7);
  softbox.lookAt(0, 0, 0);
  env.add(softbox);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.015);
  pmrem.dispose();
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as Three.Material).dispose();
    }
  });
  return target;
}

export function ChromeStar({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const host = wrap.current;
      if (disposed || !host) return;

      let renderer: Three.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // без WebGL остаётся плоский SVG-знак
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.className = "absolute inset-0 size-full";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const envTarget = buildEnvironment(THREE, renderer);
      scene.environment = envTarget.texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0, 6.4);

      // Звезда и кольцо — матовый серый
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x8e8e94,
        metalness: 0.25,
        roughness: 0.6,
      });

      const root = new THREE.Group();
      scene.add(root);

      const starGeometry = buildStar(THREE);
      const star = new THREE.Mesh(starGeometry, material);
      root.add(star);

      const ringGeometry = new THREE.TorusGeometry(RING_RADIUS, 0.05, 48, 256);
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.rotation.x = Math.PI / 2 - RING_TILT;
      const ringPivot = new THREE.Group();
      ringPivot.rotation.z = (RING_ROLL * Math.PI) / 180;
      ringPivot.add(ring);
      root.add(ringPivot);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height || 1;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pointer = { x: 0, y: 0 };
      const tilt = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!still) window.addEventListener("pointermove", onPointer, { passive: true });

      const start = performance.now();
      let raf = 0;
      let visible = true;
      const frame = (now: number) => {
        const t = (now - start) / 1000;
        if (still) {
          star.rotation.y = 0.25;
        } else {
          // Появление: знак раскручивается и вырастает, дальше мягко покачивается за курсором
          const intro = Math.min(1, t / 1.6);
          const ease = 1 - Math.pow(1 - intro, 3);
          root.scale.setScalar(0.55 + 0.45 * ease);
          tilt.x += (pointer.y * 0.12 - tilt.x) * 0.05;
          tilt.y += (pointer.x * 0.18 - tilt.y) * 0.05;
          root.rotation.x = tilt.x;
          root.rotation.y = tilt.y;
          star.rotation.y = (1 - ease) * -2.4 + Math.sin(t * 0.5) * 0.3;
        }
        renderer.render(scene, camera);
        if (visible && !still) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      const io = new IntersectionObserver(([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (visible && !was && !still) raf = requestAnimationFrame(frame);
      });
      io.observe(host);

      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        starGeometry.dispose();
        ringGeometry.dispose();
        material.dispose();
        envTarget.dispose();
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={wrap} className={`relative ${className ?? ""}`}>
      <Mark
        id="hero"
        className={`absolute inset-0 size-full transition-opacity duration-500 ${ready ? "opacity-0" : ""}`}
      />
    </div>
  );
}
