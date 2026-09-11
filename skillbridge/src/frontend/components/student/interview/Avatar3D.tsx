'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function StylizedAIHead({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Floating animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05;
    }

    // Audio reactive mouth animation
    if (mouthRef.current) {
      if (isSpeaking) {
        // Pulse the mouth height based on a fast sine wave
        const speakingValue = (Math.sin(time * 25) * 0.5 + 0.5) * (Math.sin(time * 10) * 0.5 + 0.5);
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.2 + speakingValue * 2.5, 0.3);
        
        // Pulse emissive intensity
        const mat = mouthRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 2 + speakingValue * 3, 0.3);
      } else {
        // Idle closed mouth
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.2, 0.15);
        const mat = mouthRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.5, 0.15);
      }
    }

    // Subtle eye blinking
    if (eyeLeftRef.current && eyeRightRef.current) {
      // Blink roughly every 4 seconds
      const blink = Math.sin(time * 1.5) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y, blink, 0.3);
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, blink, 0.3);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Head Casting */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.4, 1.2]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>

      {/* Face Screen */}
      <mesh position={[0, 0, 0.61]} receiveShadow>
        <planeGeometry args={[1.0, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Left Eye */}
      <mesh ref={eyeLeftRef} position={[-0.25, 0.2, 0.62]}>
        <capsuleGeometry args={[0.08, 0.1, 4, 8]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#6366f1" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>

      {/* Right Eye */}
      <mesh ref={eyeRightRef} position={[0.25, 0.2, 0.62]}>
        <capsuleGeometry args={[0.08, 0.1, 4, 8]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#6366f1" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>

      {/* Mouth (Audio Reactive) */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.62]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6" 
          emissiveIntensity={0.5} 
          toneMapped={false} 
        />
      </mesh>
      
      {/* Neck/Base */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function Avatar3D({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[-2, 1, -2]} intensity={1} color="#6366f1" />
        
        <React.Suspense fallback={null}>
          <StylizedAIHead isSpeaking={isSpeaking} />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={5} blur={2} far={4} color="#000000" />
        </React.Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.2}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minAzimuthAngle={-0.4}
          maxAzimuthAngle={0.4}
        />
      </Canvas>
    </div>
  );
}
