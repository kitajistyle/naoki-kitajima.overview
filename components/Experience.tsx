import React, { useLayoutEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Book, BookRef } from "./Book";
import { Particles } from "./Particles";

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const bookRef = useRef<BookRef>(null);
  const sceneRef = useRef<Group>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    // Determine if mobile view
    const isMobile = window.innerWidth < 768;

    if (!bookRef.current?.group || !bookRef.current.coverFront) return;

    // Use gsap.context for proper cleanup and scoping in React
    // Removed sceneRef from context scope because it is a THREE.Group, not a DOM element, causing querySelectorAll error
    const ctx = gsap.context(() => {
      const book = bookRef.current!.group!;
      const cover = bookRef.current!.coverFront!;
      const pages = bookRef.current!.pages;

      // Master Timeline linked to scroll
      tl.current = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      /**
       * SECTION 1: Book Pops Out (0% - 15%)
       * Desktop Target Scale: 1
       * Mobile Target Scale: 0.6
       * Enhanced with dramatic bounce and rotation
       */
      const targetScale = isMobile ? 0.6 : 1;

      // Dramatic pop-out with stronger bounce
      tl.current.fromTo(
        book.position,
        { z: -15, y: -8, x: 0 },
        { z: 0, y: 0, x: 0, duration: 2.5, ease: "back.out(2.5)" }
      );

      // Scale with extra bounce
      tl.current.fromTo(
        book.scale,
        { x: 0, y: 0, z: 0 },
        { x: targetScale, y: targetScale, z: targetScale, duration: 2.5, ease: "back.out(2.5)" },
        "<"
      );

      // Add spinning entrance
      tl.current.fromTo(
        book.rotation,
        { y: Math.PI * 4, x: Math.PI },
        { y: 0, x: 0, duration: 2.5, ease: "back.out(2)" },
        "<"
      );

      /**
       * SECTION 2: Float, 360 Rotate, Open (15% - 35%)
       */
      const sec2Duration = 4;

      tl.current.to(book.rotation, {
        y: Math.PI * 2,
        duration: sec2Duration,
        ease: "power2.inOut",
      });

      tl.current.to(book.rotation, {
        x: 0.2,
        duration: sec2Duration,
        ease: "power1.inOut"
      }, "<");

      tl.current.to(cover.rotation, {
        y: -Math.PI + 0.1,
        duration: 2,
        ease: "power2.inOut"
      }, "-=2");

      // Shift logic: Desktop shift right (x:1), Mobile stay center (x:0)
      tl.current.to(book.position, {
        x: isMobile ? 0 : 1,
        duration: 2,
        ease: "power2.out"
      }, "<");


      /**
       * SECTION 3: Profile Display (35% - 50%)
       * Zoom in close to show the right page prominently
       * Desktop: Zoom close (z:3) and shift right (x:2) to focus on right page
       * Mobile: Strong zoom (z:6) and shift left (x:-1) to center the right page
       */
      tl.current.to(book.position, {
        z: isMobile ? 8.5 : 3,
        x: isMobile ? -1 : -1,
        duration: 3,
        ease: "power1.inOut"
      });

      // Adjust rotation to better show the right page
      tl.current.to(book.rotation, {
        x: 0.15,
        y: Math.PI * 2 - 0.2,
        duration: 3,
        ease: "power1.inOut"
      }, "<");



      /**
       * SECTION 4: Page Turning (50% - 90%)
       * Each page turns one at a time with scroll
       */
      const pagesToTurn = pages.slice(0, pages.length - 1);

      pagesToTurn.forEach((page, index) => {
        tl.current?.to(page.rotation, {
          y: -Math.PI + 0.15,
          duration: 2,
          ease: "power2.inOut",
        }, `>-0.5`); // Sequential page turning with slight overlap
      });

      /**
       * SECTION 5: Thank You (90% - 100%)
       */
      tl.current.to(book.rotation, {
        x: -0.2,
        y: Math.PI * 2 + 0.3,
        duration: 3,
        ease: "power2.out"
      });
      tl.current.to(book.position, {
        z: isMobile ? -1 : 1.5, // Mobile needs to zoom out more
        x: 0,
        duration: 3,
        ease: "power2.out"
      }, "<");

    }); // removed sceneRef

    return () => {
      ctx.revert(); // Clean up GSAP context
      if (tl.current) tl.current.kill();
    };
  }, []);

  return (
    <group ref={sceneRef}>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
      />

      {/* Dramatic Spotlight for pop effect */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={2}
        color="#ffd700"
      />

      {/* Rim light for depth */}
      <pointLight position={[-5, 3, -5]} intensity={1} color="#88ccff" />

      <Environment preset="city" />

      {/* Particle Effects */}
      <Particles count={150} />

      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.2, 0.2]}
      >
        <Book ref={bookRef} />
      </Float>


    </group>
  );
};