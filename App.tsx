import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import World from './components/World';
import Overlay from './components/Overlay';
import { SectionId } from './types';

// Simple check for reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return prefersReducedMotion;
};

// Simple check for mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isFlying, setIsFlying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const isReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const handleStartFlight = () => {
    setIsFlying(true);
    setHasStarted(true);
    // Short delay to let propeller spin up before moving camera
    setTimeout(() => {
      setActiveSection('experience');
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections: SectionId[] = ['home', 'experience', 'skills', 'projects', 'contact'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = sections[(currentIndex + 1) % sections.length];
        setActiveSection(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = sections[(currentIndex - 1 + sections.length) % sections.length];
        setActiveSection(prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <div className="relative w-full h-screen bg-bgPrimary">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          <Suspense fallback={null}>
            <World 
              activeSection={activeSection} 
              isReducedMotion={isReducedMotion} 
              isFlying={isFlying || hasStarted}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Screen */}
      <Loader 
        containerStyles={{ background: '#0f172a' }} 
        innerStyles={{ background: '#1e293b', width: '200px' }} 
        barStyles={{ background: '#8b5cf6' }} 
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} 
        initialState={(active) => active} 
      />

      {/* DOM UI Layer */}
      <Overlay 
        activeSection={activeSection} 
        onNavigate={(section) => {
          setActiveSection(section);
          if (section !== 'home') setHasStarted(true);
        }} 
        isMobile={isMobile} 
        onStartFlight={handleStartFlight}
        hasStarted={hasStarted}
      />
    </div>
  );
};

export default App;