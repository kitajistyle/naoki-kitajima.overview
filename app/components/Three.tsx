"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';

const Three: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.5, 100);
    const setCameraPosition = () => {
      camera.position.set(0, -0.5, Math.max(3000/sizes.width, 3));
    };
    setCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xdcdcdc);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;  // 慣性を無効化
    controls.enableZoom = false;     // ズームを無効化
    controls.enableRotate = false;   // 回転を無効化
    controls.enablePan = false;      // パン操作を無効化
    

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(0, 3, 5);
    scene.add(directionalLight);

    // Fonts
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('naoki kitajima', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0x99FF33 }); // 黄緑色
      const text = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(text);

      const boxGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 }); // 緑色

      const getRandomPositionX = (): number => {
        const sign = Math.random() < 0.5 ? -0.8 : 0.8;
        return sign * (1 + Math.random() * 4.5);
      };

      const getRandomPositionY = (): number => {
        const sign = Math.random() < 0.5 ? -0.3 : 0.3;
        return sign * (1 + Math.random() * 4.5);
      };

      for (let i = 0; i < 20; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        box.position.x = getRandomPositionX();
        box.position.y = getRandomPositionY();

        box.rotation.set(20, 20, 20);
        box.rotation.x = Math.random() * Math.PI;
        box.rotation.y = Math.random() * Math.PI;

        const clock = new THREE.Clock();

        const tick = () => {
          const elapsedTime = clock.getElapsedTime();
          box.rotation.x = elapsedTime;
          box.rotation.y = elapsedTime;
          window.requestAnimationFrame(tick);
          renderer.render(scene, camera);
        };
        tick();

        const scale = Math.random();
        box.scale.set(scale, scale, scale);

        scene.add(box);
      }


      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    });

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      setCameraPosition();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="flex-1 max-w-full max-h-full" />;
};

export default Three;

