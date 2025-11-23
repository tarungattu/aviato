
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cloud, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import AviatorPlane from './AviatorPlane';
import { SectionId, WeatherType } from '../types';

interface WorldProps {
  activeSection: SectionId;
  isReducedMotion: boolean;
  isFlying: boolean;
  freeFlightMode: boolean;
  weather: WeatherType;
}

// [x, y, z] coordinates relative to the plane (Plane is at 0,0,0 in Portfolio Mode)
const CAMERA_POSITIONS: Record<SectionId, THREE.Vector3> = {
  home: new THREE.Vector3(0, 1, 9),
  experience: new THREE.Vector3(-8, 2, 4),
  skills: new THREE.Vector3(-6, 2, 6),
  projects: new THREE.Vector3(8, 3, 6),
  contact: new THREE.Vector3(-10, 3, 2),
};

// Weather Configuration
const WEATHER_CONFIGS = {
  day: {
    bg: '#38bdf8', // Light sky blue
    fogColor: '#bae6fd',
    fogDensity: 120, // Clearer view
    ambient: 0.8,
    directional: '#ffffff',
    directionalInt: 2.5,
    spot: '#ffffff',
    cloudColor: '#ffffff',
    starsOpacity: 0,
    cityEmissive: '#555555' // Less glow during day
  },
  sunset: {
    bg: '#7c2d12', // Deep orange/rust
    fogColor: '#fb923c', // Orange fog
    fogDensity: 80,
    ambient: 0.6,
    directional: '#fcd34d', // Amber sun
    directionalInt: 2.0,
    spot: '#c084fc', // Purple hues
    cloudColor: '#fed7aa', // Peachy clouds
    starsOpacity: 0.3,
    cityEmissive: '#fcd34d'
  },
  midnight: {
    bg: '#0f172a', // Original dark blue
    fogColor: '#0f172a',
    fogDensity: 50, // Darker/closer fog for atmosphere
    ambient: 0.2, // Dark ambient
    directional: '#fcd34d', // Moon/Street light
    directionalInt: 0.5,
    spot: '#3b82f6', // Blue spot
    cloudColor: '#334155', // Dark grey clouds
    starsOpacity: 1,
    cityEmissive: '#22d3ee' // Cyan neon
  },
  rainy: {
    bg: '#1e293b', // Dark Slate
    fogColor: '#1e293b',
    fogDensity: 40, // Dense
    ambient: 0.4,
    directional: '#94a3b8',
    directionalInt: 1.0,
    spot: '#64748b',
    cloudColor: '#475569',
    starsOpacity: 0,
    cityEmissive: '#38bdf8' // Blueish reflections
  },
  sakura: {
    bg: '#bae6fd', // Sky blue
    fogColor: '#e0f2fe', // Very light blue/white fog
    fogDensity: 70, 
    ambient: 0.8,
    directional: '#fff1f2', // Soft pinkish light
    directionalInt: 2.0,
    spot: '#fbcfe8',
    cloudColor: '#ffffff',
    starsOpacity: 0,
    cityEmissive: '#f472b6'
  }
};

// Helper component to lock objects to camera position (for Stars)
const FollowCamera = ({ children }: { children?: React.ReactNode }) => {
  const { camera } = useThree();
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(camera.position);
    }
  });
  return <group ref={ref}>{children}</group>;
};

// --- COMPONENT: PRECIPITATION (Rain/Petals) ---
const Precipitation = ({ type }: { type: 'rainy' | 'sakura' }) => {
  const { camera } = useThree();
  const count = type === 'rainy' ? 3000 : 1500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const prevCamPos = useRef(camera.position.clone());
  
  // Dimensions of the precipitation box around the camera
  const boxSize = { x: 120, y: 80, z: 120 };

  // Initial random positions relative to camera
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * boxSize.x,
      y: (Math.random() - 0.5) * boxSize.y,
      z: (Math.random() - 0.5) * boxSize.z,
      velocity: type === 'rainy' ? 1.5 + Math.random() : 0.1 + Math.random() * 0.1, // Slow falling petals
      drift: Math.random() * Math.PI, 
      driftSpeed: (Math.random() - 0.5) * (type === 'sakura' ? 0.08 : 0.05),
      rotationSpeed: (Math.random() - 0.5) * 0.2
    }));
  }, [type, count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const currentCamPos = camera.position;
    
    // Calculate how much the camera moved since last frame
    const deltaX = currentCamPos.x - prevCamPos.current.x;
    const deltaY = currentCamPos.y - prevCamPos.current.y;
    const deltaZ = currentCamPos.z - prevCamPos.current.z;
    
    prevCamPos.current.copy(currentCamPos);

    particles.forEach((p, i) => {
      // 1. Shift particle relative position inversely to camera movement
      p.x -= deltaX;
      p.y -= deltaY;
      p.z -= deltaZ;

      // 2. Physics: Vertical Fall
      p.y -= p.velocity;
      
      // 3. Drift (Wind effect)
      if (type === 'sakura') {
        p.x += Math.sin(time * 0.5 + p.drift) * 0.05 + p.driftSpeed;
        p.z += Math.cos(time * 0.3 + p.drift) * 0.05;
      }

      // 4. Wrap Around Logic
      const halfX = boxSize.x / 2;
      const halfY = boxSize.y / 2;
      const halfZ = boxSize.z / 2;

      if (p.x < -halfX) p.x += boxSize.x;
      if (p.x > halfX) p.x -= boxSize.x;

      if (p.y < -halfY) p.y += boxSize.y;
      if (p.y > halfY) p.y -= boxSize.y;

      if (p.z < -halfZ) p.z += boxSize.z;
      if (p.z > halfZ) p.z -= boxSize.z;
      
      // 5. Update Matrix
      dummy.position.set(
        currentCamPos.x + p.x,
        currentCamPos.y + p.y,
        currentCamPos.z + p.z
      );
      
      if (type === 'rainy') {
         dummy.rotation.set(0.2, 0, 0); 
      } else {
         // Fluttering rotation for petals
         dummy.rotation.set(
           time * 0.5 + p.drift, 
           time * 0.3 + p.rotationSpeed, 
           time * 0.2 + p.drift
         );
      }
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (type === 'rainy') {
      return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
           <cylinderGeometry args={[0.02, 0.02, 1.2]} />
           <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </instancedMesh>
      )
  }

  // Sakura Petals
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
       <planeGeometry args={[0.1, 0.1]} />
       <meshBasicMaterial color="#fbcfe8" side={THREE.DoubleSide} transparent opacity={0.9} /> 
    </instancedMesh>
  );
};


// --- COMPONENT: INFINITE CLOUDS (for Free Flight) ---
const InfiniteClouds = ({ weather }: { weather: WeatherType }) => {
  const { camera } = useThree();
  const count = 15; // Number of cloud clusters
  const spread = 200; // Spread area
  
  // Initial random positions
  const initialPositions = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * (spread / 4), // Flatter vertical spread
        (Math.random() - 0.5) * spread
      ),
      seed: Math.random()
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group[]>([]);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Check each cloud distance from camera
    cloudsRef.current.forEach((cloud, i) => {
      if (!cloud) return;
      
      const worldPos = new THREE.Vector3();
      cloud.getWorldPosition(worldPos);
      
      const distance = camera.position.distanceTo(worldPos);
      const direction = new THREE.Vector3().subVectors(worldPos, camera.position).normalize();
      const dot = camera.getWorldDirection(new THREE.Vector3()).dot(direction);

      // If cloud is far behind the camera (dot < 0 and distance > threshold), recycle it forward
      if (dot < -0.2 && distance > 50) {
        // Move cloud to front of camera + random offset
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        
        // New position: Camera Pos + (Forward * 100) + Random Spread
        const newPos = camera.position.clone()
          .add(forward.multiplyScalar(100 + Math.random() * 50))
          .add(new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * spread
          ));
          
        cloud.position.copy(newPos);
      }
    });
  });

  const config = WEATHER_CONFIGS[weather];

  return (
    <group ref={groupRef}>
      {initialPositions.map((data, i) => (
        <group 
          key={i} 
          position={data.position} 
          ref={(el) => { if (el) cloudsRef.current[i] = el; }}
        >
          <Cloud 
            opacity={weather === 'day' ? 0.6 : 0.3} 
            speed={0.4} 
            bounds={[20, 4, 10]} 
            segments={10} 
            seed={data.seed}
            color={config.cloudColor}
          />
        </group>
      ))}
    </group>
  );
};

// --- COMPONENT: SAKURA TREE ---
const SakuraTree: React.FC<{ position: [number, number, number], scaleFactor: number }> = ({ position, scaleFactor }) => {
    return (
        <group position={position} scale={[scaleFactor, scaleFactor, scaleFactor]}>
            {/* Trunk */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.4, 0.6, 4]} />
                <meshStandardMaterial color="#5d4037" roughness={0.9} />
            </mesh>
            {/* Foliage Clouds */}
            <mesh position={[0, 4.5, 0]}>
                <dodecahedronGeometry args={[2.5, 0]} />
                <meshStandardMaterial color="#fbcfe8" flatShading />
            </mesh>
            <mesh position={[1.5, 3.5, 0]}>
                <dodecahedronGeometry args={[1.8, 0]} />
                <meshStandardMaterial color="#f9a8d4" flatShading />
            </mesh>
            <mesh position={[-1.2, 4, 1]}>
                <dodecahedronGeometry args={[2.0, 0]} />
                <meshStandardMaterial color="#fce7f3" flatShading />
            </mesh>
        </group>
    );
}

// --- COMPONENT: INFINITE CITY / NATURE ---
const InfiniteCity = ({ weather }: { weather: WeatherType }) => {
  const { camera } = useThree();
  const chunkCount = 10;
  const chunkSpacing = 80;
  
  // Create randomized city blocks
  const chunks = useMemo(() => {
    return new Array(chunkCount).fill(0).map(() => {
      // Each chunk contains multiple buildings/trees
      const buildingCount = 6 + Math.floor(Math.random() * 4);
      const buildings = new Array(buildingCount).fill(0).map(() => ({
        pos: [
          (Math.random() - 0.5) * 80, // Wide spread X
          0,
          (Math.random() - 0.5) * 80  // Wide spread Z
        ] as [number, number, number],
        scale: [
          2 + Math.random() * 4,
          10 + Math.random() * 30, // Tall buildings
          2 + Math.random() * 4
        ] as [number, number, number],
        treeScale: 0.8 + Math.random() * 0.6
      }));
      return { buildings };
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const chunkRefs = useRef<THREE.Group[]>([]);

  useFrame(() => {
    if (!groupRef.current) return;

    chunkRefs.current.forEach((chunk, i) => {
      if (!chunk) return;
      const worldPos = new THREE.Vector3();
      chunk.getWorldPosition(worldPos);

      // Recycle chunks
      const dist = worldPos.distanceTo(camera.position);
      const direction = new THREE.Vector3().subVectors(worldPos, camera.position).normalize();
      const dot = camera.getWorldDirection(new THREE.Vector3()).dot(direction);

      if (dot < -0.2 && dist > 80) {
         const forward = new THREE.Vector3();
         camera.getWorldDirection(forward);
         // Place far ahead
         const newPos = camera.position.clone().add(forward.multiplyScalar(200 + Math.random() * 50));
         // Snap to ground level (-50 relative to plane)
         newPos.y = -50; 
         chunk.position.copy(newPos);
      }
    });
  });

  const config = WEATHER_CONFIGS[weather];
  const isDay = weather === 'day';
  const isSakura = weather === 'sakura';

  return (
    <group ref={groupRef}>
      {chunks.map((chunk, i) => (
        <group 
          key={i} 
          // Initial placement scattered ahead
          position={[0, -50, -i * chunkSpacing]} 
          ref={(el) => { if(el) chunkRefs.current[i] = el; }}
        >
          {chunk.buildings.map((b, bi) => {
             if (isSakura) {
                 return <SakuraTree key={bi} position={b.pos} scaleFactor={b.treeScale} />
             }
             return (
                <mesh key={bi} position={b.pos}>
                  <boxGeometry args={b.scale} />
                  <meshStandardMaterial 
                    color="#1e293b"
                    emissive={config.cityEmissive}
                    emissiveIntensity={isDay ? 0 : 0.5 + Math.random() * 0.5} 
                    roughness={0.2}
                  />
                </mesh>
             )
          })}
        </group>
      ))}
      
      {/* "Ground" Plane */}
       <mesh position={[0, -60, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial 
            color={isSakura ? "#dcfce7" : (weather === 'day' ? "#f1f5f9" : "#020617")} 
            roughness={0.9} 
          />
       </mesh>
    </group>
  );
};


// --- COMPONENT: FLIGHT CONTROLLER (Physics) ---
const FlightController = ({ children }: { children?: React.ReactNode }) => {
  const { camera } = useThree();
  const planeRef = useRef<THREE.Group>(null);
  
  // Physics state
  const speed = useRef(0.8);
  const position = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 1));
  
  // Inputs
  const keys = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === 'w' || k === 'W' || k === 'ArrowUp') keys.current.ArrowUp = true;
      if (k === 's' || k === 'S' || k === 'ArrowDown') keys.current.ArrowDown = true;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft') keys.current.ArrowLeft = true;
      if (k === 'd' || k === 'D' || k === 'ArrowRight') keys.current.ArrowRight = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === 'w' || k === 'W' || k === 'ArrowUp') keys.current.ArrowUp = false;
      if (k === 's' || k === 'S' || k === 'ArrowDown') keys.current.ArrowDown = false;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft') keys.current.ArrowLeft = false;
      if (k === 'd' || k === 'D' || k === 'ArrowRight') keys.current.ArrowRight = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    // 1. Handle Inputs -> Rotation
    const pitchSpeed = 1.5 * delta;
    const rollSpeed = 2.5 * delta;
    const yawSpeed = 0.8 * delta;

    // Pitch
    if (keys.current.ArrowUp) rotation.current.x -= pitchSpeed;
    if (keys.current.ArrowDown) rotation.current.x += pitchSpeed;

    // Roll & Yaw combined
    if (keys.current.ArrowLeft) {
      rotation.current.z += rollSpeed; // Roll Left
      rotation.current.y += yawSpeed; // Yaw Left
    }
    if (keys.current.ArrowRight) {
      rotation.current.z -= rollSpeed; // Roll Right
      rotation.current.y -= yawSpeed; // Yaw Right
    }

    // Auto-level roll slightly when no input
    if (!keys.current.ArrowLeft && !keys.current.ArrowRight) {
      rotation.current.z = THREE.MathUtils.lerp(rotation.current.z, 0, 2 * delta);
    }
    // Limit pitch
    rotation.current.x = THREE.MathUtils.clamp(rotation.current.x, -1, 1);

    // 2. Apply Rotation to Plane Group
    planeRef.current.rotation.x = rotation.current.x;
    planeRef.current.rotation.y = rotation.current.y;
    planeRef.current.rotation.z = rotation.current.z;

    // 3. Calculate Forward Vector based on Plane's rotation
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyEuler(rotation.current);
    forward.normalize();

    // 4. Move Position
    velocity.current.copy(forward).multiplyScalar(speed.current);
    position.current.add(velocity.current);
    planeRef.current.position.copy(position.current);

    // 5. Camera Follow Logic (Chase Camera)
    // Desired camera position: Behind and slightly above the plane
    // Since plane moves -Z, "behind" is +Z relative to plane
    const camOffset = new THREE.Vector3(0, 3, 10);
    camOffset.applyEuler(rotation.current); // Rotate offset to match plane
    const targetCamPos = position.current.clone().add(camOffset);
    
    // Smooth camera lerp
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(position.current);
  });

  return (
    <group ref={planeRef}>
      {children}
    </group>
  );
};

// --- COMPONENT: STANDARD PORTFOLIO LOGIC ---
const PortfolioController = ({ 
  children, 
  activeSection, 
  isReducedMotion, 
  mouse 
}: { 
  children?: React.ReactNode, 
  activeSection: SectionId, 
  isReducedMotion: boolean,
  mouse: THREE.Vector2
}) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Vectors for smooth interpolation
  const vec = useMemo(() => new THREE.Vector3(), []);
  const lookAtVec = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const tiltX = isReducedMotion ? 0 : mouse.y * 0.2;
      const tiltZ = isReducedMotion ? 0 : -mouse.x * 0.4;
      
      // Smoothly interpolate rotation (Static Plane tilt)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltZ, 0.1);
    }

    // Camera Navigation Logic
    const targetPos = CAMERA_POSITIONS[activeSection];
    const time = state.clock.getElapsedTime();
    const flightWobble = isReducedMotion ? 0 : Math.sin(time * 0.5) * 0.3;
    const speed = isReducedMotion ? 0.1 : 2.0 * delta;
    
    vec.set(targetPos.x, targetPos.y + flightWobble, targetPos.z);
    camera.position.lerp(vec, speed);
    
    // Look At Logic
    const xOffset = activeSection === 'home' ? 0 : 3.0;
    targetLookAt.set(xOffset, 0, 0);
    lookAtVec.lerp(targetLookAt, speed);
    camera.lookAt(lookAtVec);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
       {/* Float animation applied only in portfolio mode */}
       <Float 
        speed={isReducedMotion ? 0 : 2} 
        rotationIntensity={isReducedMotion ? 0 : 0.4} 
        floatIntensity={isReducedMotion ? 0 : 0.5}
      >
        {children}
      </Float>
    </group>
  );
};

const World: React.FC<WorldProps> = ({ activeSection, isReducedMotion, isFlying, freeFlightMode, weather }) => {
  const { mouse } = useThree();
  
  const wConfig = WEATHER_CONFIGS[weather];

  return (
    <>
      {/* Atmosphere */}
      <color attach="background" args={[wConfig.bg]} />
      {/* Dynamic fog based on mode */}
      <fog attach="fog" args={[wConfig.fogColor, 10, freeFlightMode ? wConfig.fogDensity : 50]} />
      
      {/* Lighting - Adjusted based on Weather */}
      <ambientLight intensity={wConfig.ambient} />
      <directionalLight position={[10, 10, 5]} intensity={wConfig.directionalInt} color={wConfig.directional} castShadow />
      
      {/* Additional point lights for drama in midnight mode */}
      <pointLight position={[-10, -5, -10]} intensity={0.8} color={wConfig.spot} />
      <spotLight position={[0, 5, -10]} angle={0.6} penumbra={1} intensity={1.5} color={wConfig.spot} />

      {/* Stars Background - Opacity controlled by weather */}
      <FollowCamera>
         {wConfig.starsOpacity > 0 && (
           <Stars 
             radius={100} 
             depth={50} 
             count={weather === 'midnight' ? 7000 : 2000} 
             factor={4} 
             saturation={0} 
             fade 
             speed={isFlying ? 1.5 : 0.3} 
           />
         )}
      </FollowCamera>

      {/* --- RENDER MODES --- */}
      
      {freeFlightMode ? (
        // === FREE FLIGHT MODE ===
        <>
          {(weather === 'rainy' || weather === 'sakura') && <Precipitation type={weather} />}
          <InfiniteClouds weather={weather} />
          <InfiniteCity weather={weather} />
          <FlightController>
            {/* Fix: Rotate plane 180 deg to face direction of travel (-Z) */}
            <group rotation={[0, Math.PI, 0]}>
              <AviatorPlane isFlying={true} />
            </group>
          </FlightController>
        </>
      ) : (
        // === PORTFOLIO MODE (Static) ===
        <>
           {/* Static Clouds for Portfolio Background */}
          <group position={[0, -2, 0]}>
            <Cloud opacity={0.4} speed={isFlying ? 0.8 : 0.2} bounds={[30, 2, 2]} segments={20} color={wConfig.cloudColor} />
          </group>
          <group position={[0, 10, -5]}>
            <Cloud opacity={0.2} speed={isFlying ? 0.5 : 0.1} bounds={[20, 2, 2]} segments={10} color={wConfig.spot} />
          </group>

          <PortfolioController activeSection={activeSection} isReducedMotion={isReducedMotion} mouse={mouse}>
            <AviatorPlane isFlying={isFlying} />
          </PortfolioController>
        </>
      )}
    </>
  );
};

export default World;
