
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cloud, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import AviatorPlane from './AviatorPlane';
import { SectionId } from '../types';

interface WorldProps {
  activeSection: SectionId;
  isReducedMotion: boolean;
  isFlying: boolean;
}

// [x, y, z] coordinates relative to the plane (Plane is at 0,0,0)
// Adjusted for better visibility and framing on the left side of the screen
const CAMERA_POSITIONS: Record<SectionId, THREE.Vector3> = {
  home: new THREE.Vector3(0, 1, 9),           // Front view, centered
  experience: new THREE.Vector3(-8, 2, 4),    // Left Side view
  skills: new THREE.Vector3(-6, 2, 6),        // Front-Left quarter view (Hero angle)
  projects: new THREE.Vector3(8, 3, 6),       // Right-Front side view
  contact: new THREE.Vector3(-10, 3, 2),      // Profile/Side view (High contrast, safe framing)
};

const World: React.FC<WorldProps> = ({ activeSection, isReducedMotion, isFlying }) => {
  const { camera, mouse } = useThree();
  const planeGroup = useRef<THREE.Group>(null);
  
  // Vectors for smooth interpolation
  const vec = useMemo(() => new THREE.Vector3(), []);
  const lookAtVec = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // 1. Animate Plane tilting based on mouse (interaction enabled even at start)
    if (planeGroup.current) {
      const tiltX = isReducedMotion ? 0 : mouse.y * 0.2;
      const tiltZ = isReducedMotion ? 0 : -mouse.x * 0.4;
      
      // Smoothly interpolate rotation
      planeGroup.current.rotation.x = THREE.MathUtils.lerp(planeGroup.current.rotation.x, tiltX, 0.1);
      planeGroup.current.rotation.z = THREE.MathUtils.lerp(planeGroup.current.rotation.z, tiltZ, 0.1);
    }

    // 2. Determine Camera Target Position
    const targetPos = CAMERA_POSITIONS[activeSection];
    
    // Add subtle "flight wobble" to camera
    const time = state.clock.getElapsedTime();
    const flightWobble = isReducedMotion ? 0 : Math.sin(time * 0.5) * 0.3;
    
    // Move camera speed
    const speed = isReducedMotion ? 0.1 : 2.0 * delta;
    
    vec.set(targetPos.x, targetPos.y + flightWobble, targetPos.z);
    camera.position.lerp(vec, speed);
    
    // 3. Look At Logic
    // When UI is open (activeSection != home), we look at a point to the RIGHT.
    // Since the camera is generally centered or to the left/right, looking at X > 0
    // shifts the World origin (0,0,0) - where the plane is - to the LEFT side of the screen.
    // Reduced offset from 3.5 to 3.0 to ensure plane stays on screen.
    const xOffset = activeSection === 'home' ? 0 : 3.0;
    
    targetLookAt.set(xOffset, 0, 0);
    lookAtVec.lerp(targetLookAt, speed);
    camera.lookAt(lookAtVec);
  });

  return (
    <>
      {/* Atmosphere */}
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 10, 50]} />
      
      {/* Lighting - Boosted for better visibility */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fcd34d" castShadow />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#3b82f6" />
      <spotLight position={[0, 5, -10]} angle={0.6} penumbra={1} intensity={2} color="#ef4444" />
      {/* Rim light to separate plane from dark background */}
      <spotLight position={[-5, 5, 10]} angle={0.5} penumbra={1} intensity={1.2} color="#a78bfa" />

      {/* Stars Background */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={isFlying ? 1.5 : 0.3} />

      {/* Clouds - Raised y-position from -8 to -2 for better visibility */}
      <group position={[0, -2, 0]}>
         <Cloud opacity={0.4} speed={isFlying ? 0.8 : 0.2} bounds={[30, 2, 2]} segments={20} />
      </group>
      <group position={[0, 10, -5]}>
         <Cloud opacity={0.2} speed={isFlying ? 0.5 : 0.1} bounds={[20, 2, 2]} segments={10} color="#8b5cf6" />
      </group>

      {/* The Hero Plane */}
      <Float 
        speed={isReducedMotion ? 0 : 2} 
        rotationIntensity={isReducedMotion ? 0 : 0.4} 
        floatIntensity={isReducedMotion ? 0 : 0.5}
      >
        <group ref={planeGroup}>
          <AviatorPlane isFlying={isFlying} />
        </group>
      </Float>
    </>
  );
};

export default World;
