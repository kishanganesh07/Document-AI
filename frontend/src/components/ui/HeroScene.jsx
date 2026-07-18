import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sphere, Center } from '@react-three/drei';
import * as THREE from 'three';

function SceneCore() {
  const meshRef = useRef();
  
  // Rotate slowly over time
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
      
      // Mouse interaction
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
      meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={1}
      floatingRange={[-0.1, 0.1]}
    >
      <Center>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 0]} />
          <MeshDistortMaterial 
            color="#00e476"
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2.5}
            wireframe={true}
          />
        </mesh>
        
        {/* Inner core */}
        <Sphere args={[0.7, 32, 32]}>
          <meshStandardMaterial 
            color="#00ff85"
            emissive="#00e476"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </Sphere>
      </Center>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#e5c364" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#b1ccc3" />
        <Environment preset="city" />
        
        <SceneCore />
      </Canvas>
    </div>
  );
}
