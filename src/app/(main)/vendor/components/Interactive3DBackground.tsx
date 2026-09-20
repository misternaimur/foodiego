"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Octahedron, Torus, TorusKnot } from "@react-three/drei";
import { usePathname, useSearchParams } from "next/navigation";
import * as THREE from "three";

const themes = {
  dashboard: {
    primary: "#10b981",
    secondary: "#f59e0b",
    tertiary: "#34d399",
    background: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.14), transparent 34%), radial-gradient(circle at 80% 10%, rgba(245,158,11,0.12), transparent 30%), #faf8f5",
  },
  profile: {
    primary: "#d97706",
    secondary: "#f59e0b",
    tertiary: "#fbbf24",
    background: "radial-gradient(circle at 20% 20%, rgba(217,119,6,0.14), transparent 34%), radial-gradient(circle at 80% 10%, rgba(251,191,36,0.12), transparent 30%), #fffaf0",
  },
  menu: {
    primary: "#e11d48",
    secondary: "#f97316",
    tertiary: "#fb7185",
    background: "radial-gradient(circle at 20% 20%, rgba(225,29,72,0.12), transparent 34%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.12), transparent 30%), #fff7ed",
  },
  orders: {
    primary: "#06b6d4",
    secondary: "#14b8a6",
    tertiary: "#22d3ee",
    background: "radial-gradient(circle at 20% 20%, rgba(6,182,212,0.12), transparent 34%), radial-gradient(circle at 80% 10%, rgba(20,184,166,0.12), transparent 30%), #f0fdfa",
  },
  support: {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    tertiary: "#a78bfa",
    background: "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.12), transparent 34%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.1), transparent 30%), #faf5ff",
  },
};

type ThemeName = keyof typeof themes;

function getTheme(pathname: string, tab: string | null): ThemeName {
  if (pathname.includes("/vendor/profile")) return "profile";
  if (tab === "menu") return "menu";
  if (tab === "orders") return "orders";
  if (tab === "support") return "support";
  return "dashboard";
}

const mouseRef = { x: 0, y: 0 };

function SceneObjects({ themeName }: { themeName: ThemeName }) {
  const groupRef = useRef<THREE.Group>(null);
  const theme = themes[themeName];

  useFrame(() => {
    const elapsed = performance.now() * 0.001;
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.035 + mouseRef.x * 0.08;
      groupRef.current.rotation.x = mouseRef.y * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        <Icosahedron args={[1.1, 1]} position={[-3.2, 1.2, -3]} scale={0.72}>
          <meshPhysicalMaterial color={theme.primary} transparent opacity={0.16} roughness={0.18} metalness={0.2} clearcoat={0.8} />
        </Icosahedron>
      </Float>
      <Float speed={1.1} rotationIntensity={0.7} floatIntensity={0.9}>
        <Torus args={[1, 0.28, 16, 64]} position={[3.2, 1.6, -2.6]} scale={0.72}>
          <meshPhysicalMaterial color={theme.secondary} transparent opacity={0.15} roughness={0.2} metalness={0.2} clearcoat={0.8} />
        </Torus>
      </Float>
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <Octahedron args={[1, 0]} position={[-2.2, -1.6, -4]} scale={0.58}>
          <meshPhysicalMaterial color={theme.tertiary} transparent opacity={0.13} roughness={0.22} metalness={0.2} clearcoat={0.8} />
        </Octahedron>
      </Float>
      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={0.8}>
        <TorusKnot args={[0.72, 0.18, 128, 16]} position={[2.3, -1.2, -3.4]} scale={0.72}>
          <meshPhysicalMaterial color={theme.primary} transparent opacity={0.12} roughness={0.2} metalness={0.2} clearcoat={0.8} />
        </TorusKnot>
      </Float>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.7}>
        <Icosahedron args={[0.7, 0]} position={[0.1, 2.2, -4.4]} scale={0.52}>
          <meshPhysicalMaterial color={theme.secondary} transparent opacity={0.1} roughness={0.2} metalness={0.2} clearcoat={0.8} />
        </Icosahedron>
      </Float>
    </group>
  );
}

export default function Interactive3DBackground() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const themeName = getTheme(pathname, tab);
  const theme = themes[themeName];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ background: theme.background }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 4, 5]} intensity={1.2} color={theme.primary} />
        <pointLight position={[-4, -3, 4]} intensity={0.8} color={theme.secondary} />
        <SceneObjects themeName={themeName} />
      </Canvas>
    </div>
  );
}
