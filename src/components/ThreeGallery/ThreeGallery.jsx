import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei'; // Import useGLTF from drei
import { Physics, usePlane } from '@react-three/cannon';
import { PositionalAudio, VideoTexture, TextureLoader, CanvasTexture, AudioListener, ClampToEdgeWrapping } from 'three';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Tooltip from '../ToolTip/ToolTip';
import './ThreeGallery.scss';

const GalleryModel = ({ setHoveredArt, exhibitsData }) => {
  const { scene } = useGLTF('/assets/models/scene.gltf'); // Load the GLTF gallery model
  const [loadedTextures, setLoadedTextures] = useState([]);
  const listenerRef = useRef(null); // Ref for AudioListener
  const [userInteracted, setUserInteracted] = useState(false); // Track if user interacted

  useEffect(() => {
    console.log('Loaded exhibitsData:', exhibitsData);

    // Load image, audio, and video textures for artworks
    const textures = exhibitsData.artworks.map((artwork, index) => {
      if (artwork?.original_type === 'image') {
        return new Promise((resolve) => {
          const loader = new TextureLoader();
          loader.load(
            `/assets/exhibits/exhibit-1/${artwork.files.original[0]}`, // Use the first image as texture
            (texture) => {
              console.log(`Loaded image texture for artwork: ${artwork.files.original[0]}`);
              resolve(texture);
            },
            undefined,
            (err) => {
              console.error(`Error loading image texture for artwork at index ${index}:`, err);
              resolve(null);
            }
          );
        });
      } else if (artwork?.original_type === 'video') {
        const video = document.createElement('video');
        video.src = `/assets/exhibits/exhibit-1/${artwork.files.original[0]}`; // Use the first video
        video.loop = true;
        video.muted = true;
        video.setAttribute('playsinline', true);

        const videoTexture = new VideoTexture(video);
        videoTexture.wrapS = videoTexture.wrapT = ClampToEdgeWrapping;

        // Wait for user interaction to play the video
        video.play().catch(() => {
          console.warn(`Video play failed; waiting for user interaction.`);
        });

        return videoTexture;
      }
      return null;
    });

    // Wait for all textures to load and then store them in state
    Promise.all(textures).then((loadedTextures) => {
      console.log("All textures loaded:", loadedTextures);
      setLoadedTextures(loadedTextures);
    });
  }, [exhibitsData, userInteracted]);

  useEffect(() => {
    if (loadedTextures.length === 0) return;

    const placeholderTexture = new TextureLoader().load('/assets/placeholder.jpg');
    placeholderTexture.wrapS = placeholderTexture.wrapT = ClampToEdgeWrapping;
    placeholderTexture.repeat.set(1, 1);

    console.log("Loaded textures:", loadedTextures);
    console.log("Scene objects:", scene);

    // Apply the textures to corresponding frames
    scene.traverse((child) => {
      if (!child.isMesh) return;

      const frameIndexMatch = child.name.match(/frame_(\d+)/);
      if (frameIndexMatch) {
        const frameIndex = parseInt(frameIndexMatch[1], 10) - 1; // Frame index adjustment

        console.log(`Processing frame: ${child.name}, expected artwork index: ${frameIndex}`);

        // Only apply textures if the frame index is within the artworks range
        if (frameIndex >= 0 && frameIndex < exhibitsData.artworks.length) {
          const artwork = exhibitsData.artworks[frameIndex];
          const artworkTexture = loadedTextures[frameIndex];

          if (artwork && artworkTexture) {
            console.log(`Applying texture for artwork: ${artwork.title}, to frame: ${child.name}`);

            if (artwork.original_type === 'image') {
              artworkTexture.wrapS = artworkTexture.wrapT = ClampToEdgeWrapping;
              child.material.map = artworkTexture;
              child.material.needsUpdate = true;
            } else if (artwork.original_type === 'video') {
              child.material.map = artworkTexture;
              child.material.needsUpdate = true;
            }
          }
        } else {
          // Apply placeholder texture for frames that don't have corresponding artworks
          console.warn(`No artwork for frame ${child.name}, applying placeholder.`);
          child.material.map = placeholderTexture;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, loadedTextures]);

  // Handle resuming the AudioContext after user gesture
  useEffect(() => {
    const handleUserGesture = () => {
      setUserInteracted(true);

      if (!listenerRef.current) {
        listenerRef.current = new AudioListener();
      }

      if (listenerRef.current.context.state !== 'running') {
        listenerRef.current.context.resume().then(() => {
          console.log('AudioContext resumed after user interaction.');
        });
      }
    };

    window.addEventListener('click', handleUserGesture);

    return () => {
      window.removeEventListener('click', handleUserGesture);
    };
  }, []);

  return (
    <>
      <primitive object={scene} />
      {listenerRef.current && <primitive object={listenerRef.current} />}
    </>
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
  camera.position.y = 2; // Set initial y position

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    canJump: false,
  });

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

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
          if (movement.canJump) velocity.y += 350;
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
    // Create a forward vector based on the camera's direction but only in the XZ plane (ignores Y-axis)
    const forwardVector = new THREE.Vector3();
    camera.getWorldDirection(forwardVector);
    forwardVector.y = 0; // Zero out the y component to lock vertical movement
    forwardVector.normalize();

    // Create a side vector (left/right movement) only in the XZ plane
    const sideVector = new THREE.Vector3();
    sideVector.crossVectors(forwardVector, camera.up).normalize(); // Cross product to get side vector

    // Handle forward/backward movement along the horizontal plane
    if (movement.forward || movement.backward) {
      const moveZ = movement.forward ? 1 : -1; // 1 for forward, -1 for backward
      camera.position.add(forwardVector.multiplyScalar(moveZ * delta * 5)); // Adjust speed here
    }

    // Handle left/right movement along the horizontal plane
    if (movement.left || movement.right) {
      const moveX = movement.left ? -1 : 1; // Correct the direction: -1 for left, 1 for right
      camera.position.add(sideVector.multiplyScalar(moveX * delta * 5)); // Adjust speed here
    }

    // Lock the y position to 2 to prevent falling below or rising above a fixed height
    camera.position.y = 2; // You can adjust this height if needed
  });

  return null;
};

const ThreeGalleryCanvas = ({ hideBlocker }) => {
  const [hoveredArt, setHoveredArt] = useState(null);
  const [exhibitsData, setExhibitsData] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    fetch('/assets/exhibits/exhibits.json')
      .then((response) => response.json())
      .then((data) => setExhibitsData(data));
  }, []);

  if (!exhibitsData) return <div>Loading...</div>;

  return (
    <Canvas
      onClick={() => hideBlocker()} // Hide blocker when Canvas is clicked
      style={{ pointerEvents: hideBlocker ? 'auto' : 'none' }} // Disable pointer events when blocker is visible
    >
      <PointerLockControls ref={controlsRef} />
      <ambientLight intensity={1.0} />
      <Physics>
        <GalleryModel setHoveredArt={setHoveredArt} exhibitsData={exhibitsData} />
        <PlayerMovement />
        <Floor />
      </Physics>
    </Canvas>
  );
};

const ThreeGallery = () => {
  const [blockerVisible, setBlockerVisible] = useState(true);

  const hideBlocker = () => {
    setBlockerVisible(false);
  };

  return (
    <div className="three-gallery-container">
      <Header />
      {blockerVisible && (
        <div id="blocker" onClick={hideBlocker}> {/* Dismiss blocker on click */}
          <div id="instructions">
            <p style={{ fontSize: '36px' }}>Click to play</p>
            <p>Move: WASD<br />Jump: SPACE<br />Look: MOUSE</p>
          </div>
        </div>
      )}
      <div className="tooltip-container">
        <Tooltip />
      </div>
      <div className="normal-render" style={{ backgroundColor: 'lightgray' }}>
        <ThreeGalleryCanvas hideBlocker={hideBlocker} />
      </div>
      <Footer />
    </div>
  );
};

export default ThreeGallery;
