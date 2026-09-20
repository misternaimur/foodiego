"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface Object3DItem {
  mesh: THREE.Mesh;
  rotSpeedX: number;
  rotSpeedY: number;
  floatSpeed: number;
  floatAmp: number;
  floatOffset: number;
  initialY: number;
  initialX: number;
  initialZ: number;
}

interface LightState {
  light: THREE.Light;
  targetColor: THREE.Color;
  targetIntensity: number;
  currentColor: THREE.Color;
  currentIntensity: number;
}

interface ThemeConfig {
  ambientColor: number;
  ambientIntensity: number;
  pointLightColor: number;
  pointLightIntensity: number;
  directionalColor: number;
  directionalIntensity: number;
  objectColors: number[];
  buildObjects: () => { geometries: THREE.BufferGeometry[]; scales: number[] };
}

function makeStarShape(outerR: number, innerR: number, points: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const themes: Record<string, ThemeConfig> = {
  dashboard: {
    ambientColor: 0xf97316,
    ambientIntensity: 0.5,
    pointLightColor: 0x10b981,
    pointLightIntensity: 2.5,
    directionalColor: 0xfff7ed,
    directionalIntensity: 1.2,
    objectColors: [0xf97316, 0x10b981, 0xfbbf24, 0x3b82f6, 0x8b5cf6, 0xf43f5e],
    buildObjects: () => {
      const geoms: THREE.BufferGeometry[] = [];
      const scales: number[] = [];
      for (let i = 0; i < 8; i++) {
        const g = new THREE.CylinderGeometry(0.6, 0.6, 0.15, 32);
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.6);
      }
      for (let i = 0; i < 6; i++) {
        const g = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        geoms.push(g);
        scales.push(0.4 + Math.random() * 0.5);
      }
      for (let i = 0; i < 6; i++) {
        const shape = makeStarShape(0.6, 0.25, 5);
        const g = new THREE.ExtrudeGeometry(shape, {
          depth: 0.15,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05,
          bevelSegments: 2,
        });
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      return { geometries: geoms, scales };
    },
  },
  profile: {
    ambientColor: 0xf59e0b,
    ambientIntensity: 0.5,
    pointLightColor: 0xd97706,
    pointLightIntensity: 2.5,
    directionalColor: 0xfffbeb,
    directionalIntensity: 1.2,
    objectColors: [0xf59e0b, 0xd97706, 0xfbbf24, 0xb45309, 0x92400e, 0x78350f],
    buildObjects: () => {
      const geoms: THREE.BufferGeometry[] = [];
      const scales: number[] = [];
      for (let i = 0; i < 7; i++) {
        const top = new THREE.ConeGeometry(0.5, 0.45, 12);
        const bottom = new THREE.CylinderGeometry(0.35, 0.4, 0.35, 12);
        const g = new THREE.BufferGeometry();
        const pos1 = top.attributes.position;
        const pos2 = bottom.attributes.position;
        const vertices: number[] = [];
        const indices: number[] = [];
        for (let v = 0; v < pos1.count; v++) {
          vertices.push(pos1.getX(v), pos1.getY(v) + 0.25, pos1.getZ(v));
        }
        for (let v = 0; v < pos2.count; v++) {
          vertices.push(pos2.getX(v), pos2.getY(v) - 0.05, pos2.getZ(v));
        }
        for (let idx = 0; idx < top.index!.count; idx++) {
          indices.push(top.index!.getX(idx));
        }
        const bottomIdxOffset = pos1.count;
        for (let idx = 0; idx < bottom.index!.count; idx++) {
          indices.push(bottom.index!.getX(idx) + bottomIdxOffset);
        }
        const ringCount = 12;
        for (let r = 0; r < ringCount; r++) {
          const coneIdx = top.getAttribute("position")!.count - ringCount + r;
          const nextConeIdx = top.getAttribute("position")!.count - ringCount + ((r + 1) % ringCount);
          const cylIdx = bottomIdxOffset + 1 + r;
          const nextCylIdx = bottomIdxOffset + 1 + ((r + 1) % ringCount);
          indices.push(coneIdx, nextConeIdx, nextCylIdx);
          indices.push(coneIdx, nextCylIdx, cylIdx);
        }
        g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        g.setIndex(indices);
        g.computeVertexNormals();
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 4; i++) {
        const g = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
        geoms.push(g);
        scales.push(0.4 + Math.random() * 0.3);
      }
      for (let i = 0; i < 5; i++) {
        const shape = makeStarShape(0.5, 0.2, 6);
        const g = new THREE.ExtrudeGeometry(shape, {
          depth: 0.12,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.04,
          bevelSegments: 2,
        });
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.4);
      }
      return { geometries: geoms, scales };
    },
  },
  menu: {
    ambientColor: 0xef4444,
    ambientIntensity: 0.5,
    pointLightColor: 0xfbbf24,
    pointLightIntensity: 2.5,
    directionalColor: 0xfef2f2,
    directionalIntensity: 1.2,
    objectColors: [0xef4444, 0xfbbf24, 0xf97316, 0xf59e0b, 0xdc2626, 0xeab308],
    buildObjects: () => {
      const geoms: THREE.BufferGeometry[] = [];
      const scales: number[] = [];
      for (let i = 0; i < 6; i++) {
        const g = new THREE.SphereGeometry(0.5, 16, 16);
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 5; i++) {
        const g = new THREE.ConeGeometry(0.55, 0.9, 4);
        geoms.push(g);
        scales.push(0.4 + Math.random() * 0.4);
      }
      for (let i = 0; i < 6; i++) {
        const g = new THREE.TorusGeometry(0.4, 0.15, 12, 32);
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 5; i++) {
        const g = new THREE.IcosahedronGeometry(0.35, 0);
        geoms.push(g);
        scales.push(0.4 + Math.random() * 0.4);
      }
      return { geometries: geoms, scales };
    },
  },
  support: {
    ambientColor: 0x8b5cf6,
    ambientIntensity: 0.55,
    pointLightColor: 0xec4899,
    pointLightIntensity: 2.8,
    directionalColor: 0xfff7ed,
    directionalIntensity: 1.1,
    objectColors: [0x8b5cf6, 0xec4899, 0xf6a429, 0x15462d, 0xa78bfa, 0xf472b6],
    buildObjects: () => {
      const geoms: THREE.BufferGeometry[] = [];
      const scales: number[] = [];
      for (let i = 0; i < 5; i++) {
        const g = new THREE.IcosahedronGeometry(0.42, 0);
        geoms.push(g);
        scales.push(0.55 + Math.random() * 0.55);
      }
      for (let i = 0; i < 4; i++) {
        const g = new THREE.TorusKnotGeometry(0.34, 0.1, 96, 12);
        geoms.push(g);
        scales.push(0.45 + Math.random() * 0.45);
      }
      for (let i = 0; i < 4; i++) {
        const g = new THREE.OctahedronGeometry(0.36, 0);
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 3; i++) {
        const g = new THREE.TorusGeometry(0.38, 0.1, 12, 32);
        geoms.push(g);
        scales.push(0.55 + Math.random() * 0.45);
      }
      return { geometries: geoms, scales };
    },
  },
  orders: {
    ambientColor: 0x14b8a6,
    ambientIntensity: 0.5,
    pointLightColor: 0xf97316,
    pointLightIntensity: 2.5,
    directionalColor: 0xf0fdfa,
    directionalIntensity: 1.2,
    objectColors: [0x14b8a6, 0xf97316, 0x06b6d4, 0xfbbf24, 0x2dd4bf, 0xfb923c],
    buildObjects: () => {
      const geoms: THREE.BufferGeometry[] = [];
      const scales: number[] = [];
      for (let i = 0; i < 6; i++) {
        const g = new THREE.ConeGeometry(0.45, 0.55, 8);
        geoms.push(g);
        scales.push(0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 6; i++) {
        const g = new THREE.TorusGeometry(0.4, 0.12, 12, 32);
        geoms.push(g);
        scales.push(0.4 + Math.random() * 0.4);
      }
      for (let i = 0; i < 8; i++) {
        const g = new THREE.OctahedronGeometry(0.3, 0);
        geoms.push(g);
        scales.push(0.3 + Math.random() * 0.3);
      }
      return { geometries: geoms, scales };
    },
  },
};

function disposeGroup(group: THREE.Group) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

export default function Food3DBackground({ activeSection }: { activeSection?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number>(0);
  const currentGroupRef = useRef<THREE.Group | null>(null);
  const currentObjectsRef = useRef<Object3DItem[]>([]);
  const fadingOutGroupRef = useRef<THREE.Group | null>(null);
  const fadingOutObjectsRef = useRef<Object3DItem[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const transitionProgressRef = useRef(0);
  const transitionDurationRef = useRef(1.2);
  const isTransitioningRef = useRef(false);
  const lightsRef = useRef<LightState[]>([]);
  const isInitialMountRef = useRef(true);
  const currentThemeRef = useRef<string>("");

  const buildGroup = useCallback((section: string): { group: THREE.Group; objects: Object3DItem[]; lights: LightState[] } => {
    const theme = themes[section] || themes.dashboard;
    const group = new THREE.Group();
    const items: Object3DItem[] = [];

    const { geometries, scales } = theme.buildObjects();

    for (let i = 0; i < geometries.length; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: theme.objectColors[i % theme.objectColors.length],
        metalness: 0.15,
        roughness: 0.2,
        transmission: 0.9,
        opacity: 0.45,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.45,
        thickness: 0.5,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometries[i], mat);
      const scale = scales[i] || 0.5;
      mesh.scale.setScalar(scale);
      mesh.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12 - 3,
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(mesh);
      items.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.003 + Math.random() * 0.006,
        floatAmp: 0.3 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
        initialX: mesh.position.x,
        initialZ: mesh.position.z,
      });
    }

    const ambientLight = new THREE.AmbientLight(theme.ambientColor, 0);
    const dirLight = new THREE.DirectionalLight(theme.directionalColor, 0);
    dirLight.position.set(8, 15, 10);
    const pointLight = new THREE.PointLight(theme.pointLightColor, 0, 30);
    pointLight.position.set(-8, -6, 8);
    const pointLight2 = new THREE.PointLight(theme.objectColors[1] || 0xfbbf24, 0, 25);
    pointLight2.position.set(10, 8, -5);

    group.add(ambientLight, dirLight, pointLight, pointLight2);

    const lights: LightState[] = [
      {
        light: ambientLight,
        targetColor: new THREE.Color(theme.ambientColor),
        targetIntensity: theme.ambientIntensity,
        currentColor: new THREE.Color(theme.ambientColor),
        currentIntensity: 0,
      },
      {
        light: dirLight,
        targetColor: new THREE.Color(theme.directionalColor),
        targetIntensity: theme.directionalIntensity,
        currentColor: new THREE.Color(theme.directionalColor),
        currentIntensity: 0,
      },
      {
        light: pointLight,
        targetColor: new THREE.Color(theme.pointLightColor),
        targetIntensity: theme.pointLightIntensity,
        currentColor: new THREE.Color(theme.pointLightColor),
        currentIntensity: 0,
      },
      {
        light: pointLight2,
        targetColor: new THREE.Color(theme.objectColors[1] || 0xfbbf24),
        targetIntensity: 1.5,
        currentColor: new THREE.Color(theme.objectColors[1] || 0xfbbf24),
        currentIntensity: 0,
      },
    ];

    return { group, objects: items, lights };
  }, []);

  const transitionTo = useCallback(
    (section: string) => {
      const scene = sceneRef.current;
      if (!scene) return;

      if (currentThemeRef.current === section) return;

      const { group, objects, lights } = buildGroup(section);
      group.visible = false;
      for (let i = 0; i < objects.length; i++) {
        (objects[i].mesh.material as THREE.MeshPhysicalMaterial).opacity = 0;
      }
      scene.add(group);

      fadingOutGroupRef.current = currentGroupRef.current;
      fadingOutObjectsRef.current = currentObjectsRef.current;
      currentGroupRef.current = group;
      currentObjectsRef.current = objects;
      lightsRef.current = lights;
      currentThemeRef.current = section;
      transitionProgressRef.current = 0;
      isTransitioningRef.current = true;
    },
    [buildGroup],
  );

  useEffect(() => {
    if (!isInitialMountRef.current) return;
    isInitialMountRef.current = false;

    const container = containerRef.current;
    if (!container) return;

    const section = activeSection || "dashboard";

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 18;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const { group, objects, lights } = buildGroup(section);
    group.visible = true;
    scene.add(group);
    currentGroupRef.current = group;
    currentObjectsRef.current = objects;
    lightsRef.current = lights;
    currentThemeRef.current = section;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseRef.current.ty = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;

      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const group = currentGroupRef.current;
      if (group) {
        group.rotation.y = mouse.x * 0.2;
        group.rotation.x = -mouse.y * 0.15;
      }

      const items = currentObjectsRef.current;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y = item.initialY + Math.sin(elapsed * item.floatSpeed * 60 + item.floatOffset) * item.floatAmp;
        item.mesh.position.x = item.initialX + Math.cos(elapsed * item.floatSpeed * 40 + item.floatOffset) * 0.2;
      }

      if (isTransitioningRef.current) {
        transitionProgressRef.current = Math.min(transitionProgressRef.current + dt / transitionDurationRef.current, 1);
        const t = transitionProgressRef.current;
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        for (let i = 0; i < items.length; i++) {
          (items[i].mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.45 * ease;
        }
        group!.visible = true;

        const outGroup = fadingOutGroupRef.current;
        const outItems = fadingOutObjectsRef.current;
        if (outGroup && outItems) {
          const outEase = 1 - ease;
          for (let i = 0; i < outItems.length; i++) {
            (outItems[i].mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.45 * outEase;
          }
        }

        const lights = lightsRef.current;
        for (let i = 0; i < lights.length; i++) {
          const ls = lights[i];
          ls.light.color.lerp(ls.targetColor, 0.06);
          ls.light.intensity = ls.currentIntensity + (ls.targetIntensity - ls.currentIntensity) * ease;
          ls.currentIntensity = ls.light.intensity;
        }

        if (t >= 1) {
          isTransitioningRef.current = false;
          if (fadingOutGroupRef.current) {
            scene.remove(fadingOutGroupRef.current);
            disposeGroup(fadingOutGroupRef.current);
            fadingOutGroupRef.current = null;
            fadingOutObjectsRef.current = [];
          }
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          (items[i].mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.45;
        }

        const lights = lightsRef.current;
        for (let i = 0; i < lights.length; i++) {
          const ls = lights[i];
          ls.light.color.lerp(ls.targetColor, 0.06);
          ls.light.intensity = ls.currentIntensity + (ls.targetIntensity - ls.currentIntensity) * 0.06;
          ls.currentIntensity = ls.light.intensity;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      if (currentGroupRef.current) disposeGroup(currentGroupRef.current);
      if (fadingOutGroupRef.current) disposeGroup(fadingOutGroupRef.current);
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    };
  }, [activeSection, buildGroup]);

  useEffect(() => {
    if (!activeSection) return;
    transitionTo(activeSection);
  }, [activeSection, transitionTo]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ opacity: 0.6 }}
    />
  );
}
