import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';

const LowPolyPlane: React.FC = () => {
  const engineRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    // Pulsing engine glow effect
    if (engineRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
      engineRef.current.scale.set(scale, scale, scale);
    }
  });

  const fuselageColor = "#1e293b"; // Dark slate
  const wingColor = "#334155";
  const accentColor = "#8b5cf6"; // Primary violet
  const glowColor = "#a855f7";
  const glassColor = "#0ea5e9"; // Sky blue for cockpit

  return (
    <group scale={[0.4, 0.4, 0.4]} rotation={[0, Math.PI, 0]}>
      {/* Main Fuselage - Sleek & Tapered */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.8, 5, 6]} />
        <meshStandardMaterial color={fuselageColor} roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Cockpit - Glass Bubble */}
      <mesh position={[0, 0.5, 0.5]} rotation={[-0.5, 0, 0]}>
        <capsuleGeometry args={[0.4, 1.5, 4, 8]} />
        <meshStandardMaterial color={glassColor} roughness={0.1} metalness={0.9} emissive={glassColor} emissiveIntensity={0.2} />
      </mesh>

      {/* Delta Wings */}
      <group position={[0, 0, 0.5]}>
        {/* Left Wing */}
        <mesh position={[-2, 0, 0.5]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[4, 0.1, 2.5]} />
          <meshStandardMaterial color={wingColor} roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Right Wing */}
        <mesh position={[2, 0, 0.5]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[4, 0.1, 2.5]} />
          <meshStandardMaterial color={wingColor} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Wing Tips / Stabilizers */}
      <mesh position={[3.8, 0.3, 1]}>
        <boxGeometry args={[0.2, 1.5, 1]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-3.8, 0.3, 1]}>
        <boxGeometry args={[0.2, 1.5, 1]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Rear Engines */}
      <group position={[0, 0.2, -2.5]}>
        <mesh position={[0.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 1.5, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 1.5, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        {/* Engine Glow */}
        <group ref={engineRef}>
          <mesh position={[0.8, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshBasicMaterial color={glowColor} />
          </mesh>
           <mesh position={[-0.8, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshBasicMaterial color={glowColor} />
          </mesh>
        </group>
      </group>

      {/* Aesthetic Lines/Details */}
      <mesh position={[0, 0.85, -1]}>
        <boxGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export default LowPolyPlane;