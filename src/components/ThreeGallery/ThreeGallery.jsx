import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';
import * as THREE from 'three';
import './ThreeGallery.scss';

// Extend AsciiEffect for usage in the canvas
extend({ AsciiEffect });

const GalleryModel = () => {
  const { scene } = useGLTF('/models/scene.gltf');
  return <primitive object={scene} />;
};

// Floor component to prevent falling through the ground
const Floor = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

// Custom movement logic (WASD based on camera direction)
const PlayerMovement = () => {
  const { camera } = useThree();
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const speed = 5;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, left: true }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    frontVector.set(0, 0, Number(movement.backward) - Number(movement.forward));
    sideVector.set(Number(movement.right) - Number(movement.left), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta);

    camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(direction.z));
    camera.position.add(camera.getWorldDirection(new THREE.Vector3()).cross(camera.up).multiplyScalar(direction.x));
  });

  return null;
};


const AsciiRenderer = () => {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef();
  
    useEffect(() => {
      // Set up ASCII effect
      const asciiEffect = new AsciiEffect(gl, '.:-=+*#%@', { invert: true, resolution: 0.2 });
      asciiEffect.setSize(size.width, size.height);
  
      // Hide the WebGL canvas (so only ASCII is visible)
      // gl.domElement.style.display = 'none';
  
      // Add ASCII effect canvas to the DOM
      const asciiCanvas = asciiEffect.domElement;
      document.body.appendChild(asciiCanvas);
  
      // Handle resize events
      const handleResize = () => {
        asciiEffect.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
  
      // Render loop
      const render = () => {
        asciiEffect.render(scene, camera);
      };
      gl.setAnimationLoop(render);
  
      // Clean up on unmount
      return () => {
        asciiEffect.domElement.remove();
        gl.setAnimationLoop(null);
        window.removeEventListener('resize', handleResize);
      };
    }, [gl, scene, camera, size]);
  
    return null;
  };
  
  // Main ThreeGallery component with PointerLockControls
  const ThreeGallery = () => {
    const controlsRef = useRef();
  
    // PointerLock click handler
    useEffect(() => {
      const asciiCanvas = document.querySelector('canvas.ascii');
      if (asciiCanvas) {
        asciiCanvas.addEventListener('click', () => {
          if (controlsRef.current) {
            controlsRef.current.lock(); // Lock the pointer when clicking the ASCII canvas
          }
        });
      }
    }, []);
  
    return (
      <div style={{ height: '100vh', width: '50vw'}}>
        <Canvas>
          <ambientLight intensity={1.0} />
          {/* <pointLight position={[10, 10, 10]} /> */}
  
          <GalleryModel />
  
          {/* ASCII Renderer */}
          <AsciiRenderer />
  
          {/* Pointer Lock Controls */}
          <PlayerMovement></PlayerMovement>
          <PointerLockControls ref={controlsRef} />
        </Canvas>
      </div>
    );
  };
  
  export default ThreeGallery;