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
    renderer.setClearColor(0x000000);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 3, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x888888, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Fonts
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('KITAJI', {
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

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff0 }); // 白色
      const text = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(text);

      // パーティクルシステムの作成
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // 複数のジオメトリを追加
      const geometries = [
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.OctahedronGeometry(0.3),
        new THREE.TetrahedronGeometry(0.3)
      ];

      const meshes: THREE.Mesh[] = [];

      const getRandomPositionX = (): number => {
        const sign = Math.random() < 0.5 ? -0.8 : 0.8;
        return sign * (1 + Math.random() * 4.5);
      };

      const getRandomPositionY = (): number => {
        const sign = Math.random() < 0.5 ? -0.3 : 0.3;
        return sign * (1 + Math.random() * 4.5);
      };

      for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshStandardMaterial({ 
          color: i % 2 === 0 ? 0xffffff : 0x808080,
          wireframe: Math.random() > 0.5,
          metalness: 0.5,
          roughness: 0.3
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = getRandomPositionX();
        mesh.position.y = getRandomPositionY();
        mesh.position.z = (Math.random() - 0.5) * 3;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.7 + 0.3;
        mesh.scale.set(scale, scale, scale);

        meshes.push(mesh);
        scene.add(mesh);
      }


      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // メッシュのアニメーション
        meshes.forEach((mesh, index) => {
          mesh.rotation.x = elapsedTime * 0.3 * (index % 2 === 0 ? 1 : -1);
          mesh.rotation.y = elapsedTime * 0.5 * (index % 2 === 0 ? 1 : -1);
          
          // 浮遊効果
          mesh.position.y += Math.sin(elapsedTime + index) * 0.001;
        });

        // パーティクルの回転
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.03;

        // テキストの微妙な動き
        text.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
        text.position.y = Math.sin(elapsedTime * 0.5) * 0.05;

        // ライトの動き
        pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 5;
        pointLight1.position.z = Math.cos(elapsedTime * 0.5) * 5;
        pointLight2.position.x = Math.cos(elapsedTime * 0.3) * 5;
        pointLight2.position.z = Math.sin(elapsedTime * 0.3) * 5;

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

  return <div ref={mountRef} className="fixed inset-0 w-full h-full -z-10" />;
};

export default Three;

