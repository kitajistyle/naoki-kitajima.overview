"use strict";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

const Loading: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // canvasを取得
    const canvas = canvasRef.current;

    // シーン
    const scene = new THREE.Scene();

    // サイズ
    const sizes = {
      width: innerWidth,
      height: innerHeight
    };

    // カメラ
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );

    // レンダラー
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // ボックスジオメトリー
    const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const boxMaterial = new THREE.MeshLambertMaterial({
      color: "#808080"
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-1, 0, -3);
    box.rotation.set(10, 10, 10);
    scene.add(box);

    // フォントロード
    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Loading", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(0, 0, -5);

      scene.add(text);
    });

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // アニメーション
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      box.rotation.x = elapsedTime;
      box.rotation.y = elapsedTime;
      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    // ブラウザのリサイズ処理
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  }, []);

  return <canvas ref={canvasRef} id="canvas"></canvas>;
};

export default Loading;
