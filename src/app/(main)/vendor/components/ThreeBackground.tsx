"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const shapeConfig = [
  { type: "icosahedron", x: -2.2, y: 1.5, z: -3, scale: 0.6, speed: 0.3, color: "#10b981", opacity: 0.18 },
  { type: "torus", x: 2.0, y: 0.8, z: -2, scale: 0.55, speed: 0.4, color: "#f59e0b", opacity: 0.15 },
  { type: "octahedron", x: -1.5, y: -1.2, z: -4, scale: 0.45, speed: 0.35, color: "#8b5cf6", opacity: 0.14 },
  { type: "torus", x: 1.2, y: 1.8, z: -3, scale: 0.4, speed: 0.45, color: "#06b6d4", opacity: 0.12 },
  { type: "icosahedron", x: -2.8, y: -0.5, z: -2, scale: 0.35, speed: 0.25, color: "#10b981", opacity: 0.1 },
  { type: "octahedron", x: 2.8, y: -1.0, z: -3, scale: 0.3, speed: 0.5, color: "#f59e0b", opacity: 0.1 },
];

const starPositions = (() => {
  const count = 800;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
  }
  return arr;
})();

function Starfield({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02 + mouseX.current * 0.05;
      pointsRef.current.rotation.x = mouseY.current * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingShapes({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    shapeConfig.forEach((s, i) => {
      const ref = refs.current[i];
      if (ref) {
        ref.rotation.x = t * s.speed * 0.5;
        ref.rotation.y = t * s.speed;
        ref.position.x = s.x + mouseX.current * 0.4;
        ref.position.y = s.y + mouseY.current * 0.4;
        ref.position.z = s.z + Math.sin(t * s.speed + s.x) * 0.3;
      }
    });
  });

  const setRef = (el: THREE.Group | null, index: number) => {
    refs.current[index] = el;
  };

  return (
    <group>
      {shapeConfig.map((s, i) => {
        const geometry =
          s.type === "icosahedron" ? (
            <icosahedronGeometry args={[1, 1]} />
          ) : s.type === "octahedron" ? (
            <octahedronGeometry args={[1, 0]} />
          ) : (
            <torusGeometry args={[1, 0.35, 16, 50]} />
          );

        return (
          <group key={i} ref={(el) => setRef(el, i)} position={[s.x, s.y, s.z]} scale={s.scale}>
            <mesh>
              {geometry}
              <meshPhysicalMaterial
                transparent
                opacity={s.opacity}
                transmission={0.7}
                roughness={0.15}
                metalness={0.25}
                color={s.color}
                clearcoat={0.5}
                clearcoatRoughness={0.1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function MouseTracker({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return null;
}

export default function ThreeBackground() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <MouseTracker mouseX={mouseX} mouseY={mouseY} />
        <FloatingShapes mouseX={mouseX} mouseY={mouseY} />
        <Starfield mouseX={mouseX} mouseY={mouseY} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#10b981" />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#f59e0b" />
        <pointLight position={[0, 5, -5]} intensity={0.3} color="#8b5cf6" />
      </Canvas>
    </div>
  );
}
