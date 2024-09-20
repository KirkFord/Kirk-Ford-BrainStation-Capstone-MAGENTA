import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';
import * as THREE from 'three';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ThreeGallery.scss';

extend({ AsciiEffect });

const GalleryModel = () => {
  const { scene } = useGLTF('/assets/models/scene.gltf');
  return <primitive object={scene} />;
};

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


const ThreeGallery = () => {
  const controlsRef = useRef();

  useEffect(() => {
    const asciiCanvas = document.querySelector('canvas.ascii');
    if (asciiCanvas) {
      asciiCanvas.addEventListener('click', () => {
        if (controlsRef.current) {
          controlsRef.current.lock();
        }
      });
    }
  }, []);

  return (
    <div className="three-gallery-container">

      <div className="normal-render" style={{ backgroundColor: 'lightgray' }}>
      <Header />
        <Canvas>
          <ambientLight intensity={1.0} />
          <GalleryModel />
          <PlayerMovement />
          {/* <Floor /> */}
          <PointerLockControls ref={controlsRef} />
        </Canvas>
        <Footer />
      </div>
    </div>
  );
};

export default ThreeGallery;