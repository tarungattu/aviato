
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface AviatorPlaneProps {
  isFlying: boolean;
}

const AviatorPlane: React.FC<AviatorPlaneProps> = ({ isFlying }) => {
  const propRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (propRef.current) {
      // Rotate propeller: faster if "flying", slower if idle
      const speed = isFlying ? 25 : 3;
      propRef.current.rotation.z += speed * delta;
    }
  });

  const colors = {
    fuselage: "#e2e8f0", // Slate-200
    cockpit: "#1e293b",  // Slate-800
    wings: "#ef4444",    // Red-500
    struts: "#475569",   // Slate-600
    prop: "#78350f",     // Brown
    metal: "#94a3b8",    // Slate-400
    tires: "#0f172a",    // Slate-900
  };

  // Increased scale from 0.4 to 0.5 for better presence
  return (
    <group scale={[0.5, 0.5, 0.5]}>
      {/* --- FUSELAGE GROUP --- */}
      <group>
        {/* Engine Cowling (Front) */}
        <mesh position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.5, 16]} />
          <meshStandardMaterial color={colors.wings} roughness={0.3} />
        </mesh>
        
        {/* Main Body */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.8, 2.5, 16]} />
          <meshStandardMaterial color={colors.fuselage} roughness={0.5} />
        </mesh>

        {/* Tail Cone (Tapered) */}
        <mesh position={[0, 0, -2.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.2, 3, 16]} />
          <meshStandardMaterial color={colors.fuselage} roughness={0.5} />
        </mesh>

        {/* Cockpit Cutout area (Visual only) */}
        <mesh position={[0, 0.6, 0.2]}>
           <boxGeometry args={[0.9, 0.3, 1.2]} />
           <meshStandardMaterial color={colors.cockpit} />
        </mesh>
         {/* Pilot Windshield */}
        <mesh position={[0, 0.95, 0.8]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.65, 0.4, 0.1]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
        </mesh>
      </group>


      {/* --- WINGS (Biplane) --- */}
      <group position={[0, 0.1, 1.2]}>
        {/* Top Wing (Swept slightly back for style) */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[9, 0.15, 2]} />
          <meshStandardMaterial color={colors.wings} />
        </mesh>
        {/* Bottom Wing */}
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[7, 0.15, 1.8]} />
          <meshStandardMaterial color={colors.wings} />
        </mesh>

        {/* Wing Struts (N-shape or straight) */}
        {[-2.5, 2.5].map((x, i) => (
          <group key={i} position={[x, 0.4, 0]}>
             <mesh position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
               <cylinderGeometry args={[0.04, 0.04, 2.4]} />
               <meshStandardMaterial color={colors.struts} />
             </mesh>
             <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
               <cylinderGeometry args={[0.04, 0.04, 2.4]} />
               <meshStandardMaterial color={colors.struts} />
             </mesh>
          </group>
        ))}
      </group>


      {/* --- TAIL SECTION --- */}
      <group position={[0, 0.2, -3.5]}>
        {/* Vertical Stabilizer */}
        <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.15, 1.8, 1.2]} />
            <meshStandardMaterial color={colors.wings} />
        </mesh>
        <mesh position={[0, 0.8, 0.61]} rotation={[0,0,0]}>
            <boxGeometry args={[0.16, 1.8, 0.1]} />
            <meshStandardMaterial color={colors.fuselage} /> {/* Rudder Hinge visual */}
        </mesh>
        
        {/* Horizontal Stabilizer */}
        <mesh position={[0, 0.2, 0.2]}>
            <boxGeometry args={[3.2, 0.15, 1.2]} />
            <meshStandardMaterial color={colors.wings} />
        </mesh>
      </group>


      {/* --- PROPELLER --- */}
      <group position={[0, 0, 3.0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.4, 0.6, 16]} />
          <meshStandardMaterial color={colors.metal} metalness={0.8} roughness={0.2} />
        </mesh>
        <group ref={propRef}>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[4.2, 0.3, 0.05]} />
            <meshStandardMaterial color={colors.prop} />
          </mesh>
          <mesh position={[0, 0, -0.2]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[4.2, 0.3, 0.05]} />
            <meshStandardMaterial color={colors.prop} />
          </mesh>
          {/* Prop tips */}
          <mesh position={[2, 0, -0.19]}>
             <boxGeometry args={[0.2, 0.31, 0.06]} />
             <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[-2, 0, -0.19]}>
             <boxGeometry args={[0.2, 0.31, 0.06]} />
             <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      </group>


      {/* --- LANDING GEAR --- */}
      <group position={[0, -0.8, 1.8]}>
        {/* Main Strut Bridge */}
        <mesh position={[0, -0.2, 0]}>
           <boxGeometry args={[2, 0.1, 0.2]} />
           <meshStandardMaterial color={colors.struts} />
        </mesh>
        {/* Angled Supports */}
        <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -0.5]}>
           <cylinderGeometry args={[0.06, 0.06, 1.2]} />
           <meshStandardMaterial color={colors.struts} />
        </mesh>
        <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, 0.5]}>
           <cylinderGeometry args={[0.06, 0.06, 1.2]} />
           <meshStandardMaterial color={colors.struts} />
        </mesh>

        {/* Wheels */}
        {[-1.1, 1.1].map((x) => (
          <group key={x} position={[x, -0.3, 0]} rotation={[Math.PI/2, 0, 0]}>
            <mesh>
               <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
               <meshStandardMaterial color={colors.tires} />
            </mesh>
            <mesh>
               <cylinderGeometry args={[0.15, 0.15, 0.21, 16]} />
               <meshStandardMaterial color={colors.metal} />
            </mesh>
          </group>
        ))}
        
        {/* Tail Wheel */}
        <group position={[0, 0.4, -5]}>
           <mesh position={[0, -0.4, 0]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6]} />
              <meshStandardMaterial color={colors.struts} />
           </mesh>
           <mesh position={[0, -0.7, 0.1]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color={colors.tires} />
           </mesh>
        </group>
      </group>

    </group>
  );
};

export default AviatorPlane;
