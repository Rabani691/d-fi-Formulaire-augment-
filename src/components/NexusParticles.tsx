"use client";

import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function NexusParticles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  return (
    <div className="nexus-particles">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.3} />
        <Points positions={positions} stride={3}>
          <PointMaterial
            size={0.05}
            transparent
            depthWrite={false}
            sizeAttenuation
            color="#22c55e"
          />
        </Points>
      </Canvas>
    </div>
  );
}
