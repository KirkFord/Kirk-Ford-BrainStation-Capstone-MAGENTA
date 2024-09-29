import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ThreeGallery.scss';

const GalleryModel = ({ setHoveredArt, exhibitsData, setTooltipPosition }) => {
  const { scene } = useGLTF('/assets/models/magenta.gltf');
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, mouse } = useThree();
  const previousHoveredRef = useRef(null);

  useFrame(() => {
    if (!scene || !exhibitsData) return;

    raycasterRef.current.setFromCamera(mouse, camera);
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      // console.log('Raycasting hit:', hoveredObject.name);

      if (hoveredObject.name.startsWith('frame_') && hoveredObject.material && hoveredObject.material.map) {
        // console.log('Material map found on frame:', hoveredObject.name);

        const textureName = hoveredObject.material.map.name || '';
        // console.log('Texture name:', textureName);

        const hoveredArtwork = exhibitsData.artworks.find((artwork) => {
          return artwork.files.original.some((file) => {
            const baseFileName = file.split('.')[0];
            return textureName.startsWith(baseFileName);
          });
        });

        if (hoveredArtwork) {
          setHoveredArt({
            title: hoveredArtwork.title,
            description: hoveredArtwork.description,
            medium: hoveredArtwork.medium,
            altText: hoveredArtwork.altText,
            artsyAltText: hoveredArtwork.artsyAltText,
          });

          const canvasRect = document.querySelector('canvas').getBoundingClientRect();
          setTooltipPosition({
            left: `${mouse.x * canvasRect.width / 2 + canvasRect.width / 2}px`,
            top: `${-mouse.y * canvasRect.height / 2 + canvasRect.height / 2}px`,
          });

          previousHoveredRef.current = hoveredObject;
        } else {
          setHoveredArt(null);
        }
      } else {
        setHoveredArt(null);
      }
    } else {
      setHoveredArt(null);
    }
  });

  return <primitive object={scene} />;
};

const Tooltip = ({ artwork, position = { top: '0px', left: '0px' } }) => {
  if (!artwork) return null;

  return (
    <div
      className="tooltip"
      style={{
        top: position.top,
        left: position.left,
        position: 'absolute',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      <h3>{artwork.title}</h3>
      <p><strong>Medium/Tools/Transformative Process:</strong> {artwork.medium}</p>
      <p><strong>Description:</strong> {artwork.description}</p>
      <p><strong>Literal Description:</strong> {artwork.altText}</p>
      <p><strong>Artist's Description:</strong> {artwork.artsyAltText}</p>
    </div>
  );
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
  camera.position.y = 2;

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    canJump: false,
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setMovement((prev) => ({ ...prev, canJump: false }));
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [movement]);

  useFrame((_, delta) => {
    const forwardVector = new THREE.Vector3();
    camera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();

    const sideVector = new THREE.Vector3();
    sideVector.crossVectors(forwardVector, camera.up).normalize();

    if (movement.forward || movement.backward) {
      const moveZ = movement.forward ? 1 : -1;
      camera.position.add(forwardVector.multiplyScalar(moveZ * delta * 5));
    }

    if (movement.left || movement.right) {
      const moveX = movement.left ? -1 : 1;
      camera.position.add(sideVector.multiplyScalar(moveX * delta * 5));
    }

    camera.position.y = 2;
  });

  return null;
};

const ThreeGalleryCanvas = ({ hideBlocker }) => {
  const [hoveredArt, setHoveredArt] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '0px', left: '0px' });
  const [exhibitsData, setExhibitsData] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    fetch('/assets/exhibits/exhibits.json')
      .then((response) => response.json())
      .then((data) => setExhibitsData(data));
  }, []);

  if (!exhibitsData) return <div>Loading...</div>;

  return (
    <>
      <Canvas onClick={() => hideBlocker()} style={{ pointerEvents: hideBlocker ? 'auto' : 'none' }}>
        <PointerLockControls ref={controlsRef} />
        <ambientLight intensity={1.0} />
        <Physics>
          <GalleryModel setHoveredArt={setHoveredArt} exhibitsData={exhibitsData} setTooltipPosition={setTooltipPosition} />
          <PlayerMovement />
          <Floor />
        </Physics>
      </Canvas>
      {hoveredArt && <Tooltip artwork={hoveredArt} position={tooltipPosition} />}
    </>
  );
};

const ThreeGallery = () => {
  const [blockerVisible, setBlockerVisible] = useState(true);
  const [hoveredArt, setHoveredArt] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '0px', left: '0px' });

  const hideBlocker = () => {
    setBlockerVisible(false);
  };

  return (
    <div className="three-gallery-container">
      <Header />
      {blockerVisible && (
        <div id="blocker" onClick={hideBlocker}>
          <div id="instructions">
            <p style={{ fontSize: '36px' }}>Click to play</p>
            <p>Move: WASD<br />Look: MOUSE<br />Lock Mouse: LEFT CLICK<br />Free Mouse: ESCAPE KEY</p>
          </div>
        </div>
      )}
      <div className="normal-render" style={{ backgroundColor: 'lightgray' }}>
        <ThreeGalleryCanvas hideBlocker={hideBlocker} />
      </div>
      <Footer />
    </div>
  );
};

export default ThreeGallery;
