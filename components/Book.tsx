'use client';

import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import { useTexture, Text } from "@react-three/drei";
import { Vector3, Euler, DoubleSide, Group } from "three";
import { BOOK_WIDTH, BOOK_HEIGHT, BOOK_THICKNESS, PAGE_THICKNESS, COVER_COLOR, PAGE_COLOR, IMAGES } from "../constants";

interface BookProps {
  // Props can be added here if needed
}

// Internal interface for the Book Ref accessible by GSAP
export interface BookRef {
  group: Group | null;
  coverFront: Group | null;
  pages: Group[];
}

const Page = ({ index, textureUrl }: { index: number; textureUrl: string }) => {
  const texture = useTexture(textureUrl);

  // Set texture to cover the square area (center crop)
  texture.repeat.set(1, 1);
  texture.center.set(0.5, 0.5);

  // Z-offset to prevent z-fighting when pages are stacked
  // We reverse the index for z-offset so the first page is on top
  const zOffset = (IMAGES.length - index) * 0.02;

  // Square dimensions for the image
  const imageSize = Math.min(BOOK_WIDTH - 0.4, BOOK_HEIGHT - 0.6);

  return (
    <group position={[0, 0, zOffset]}>
      {/* Page mesh structure: Pivot is at x=0. The visual mesh is offset by width/2 */}
      <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT - 0.2, PAGE_THICKNESS]} />
        <meshStandardMaterial color={PAGE_COLOR} />
      </mesh>

      {/* Image Plane on the front of the page - Square */}
      <mesh position={[BOOK_WIDTH / 2, 0, PAGE_THICKNESS / 2 + 0.001]} rotation={[0, 0, 0]}>
        <planeGeometry args={[imageSize, imageSize]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Back of page (optional text or texture) */}
      <mesh position={[BOOK_WIDTH / 2, 0, -PAGE_THICKNESS / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[BOOK_WIDTH - 0.4, BOOK_HEIGHT - 0.6]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
};

export const Book = forwardRef<BookRef, BookProps>((props, ref) => {
  const groupRef = React.useRef<Group>(null);
  const coverFrontRef = React.useRef<Group>(null);
  const pagesRefs = React.useRef<Group[]>([]);

  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get coverFront() { return coverFrontRef.current; },
    get pages() { return pagesRefs.current; }
  }));

  return (
    <group ref={groupRef} {...props}>
      {/* Spine (Static relative to book group) */}
      <mesh position={[0, 0, -BOOK_THICKNESS / 2]}>
        <boxGeometry args={[BOOK_THICKNESS, BOOK_HEIGHT, BOOK_THICKNESS + 0.1]} />
        <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
      </mesh>

      {/* Back Cover (Static relative to book group base) */}
      <mesh position={[BOOK_WIDTH / 2, 0, -BOOK_THICKNESS / 2]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.1]} />
        <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
      </mesh>

      {/* Front Cover Group (Rotates) */}
      {/* Pivot is at 0,0,0 (spine edge) */}
      <group ref={coverFrontRef} position={[0, 0, BOOK_THICKNESS / 2]}>
        <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.1]} />
          <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
        </mesh>
        {/* Cover Title Decoration */}
        <mesh position={[BOOK_WIDTH / 2, 0, 0.06]}>
          <planeGeometry args={[BOOK_WIDTH * 0.6, BOOK_HEIGHT * 0.8]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>

        {/* Cover Title Text */}
        <Text
          position={[BOOK_WIDTH / 2, 0.8, 0.12]}
          fontSize={0.42}
          color="#FFF8E7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          KITAJI
        </Text>
        <Text
          position={[BOOK_WIDTH / 2, 0.2, 0.12]}
          fontSize={0.18}
          color="#D4A96A"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          Portfolio
        </Text>
      </group>

      {/* Pages Group */}
      <group position={[0.1, 0, (BOOK_THICKNESS / 2) - 0.15]}>
        {IMAGES.map((img, i) => (
          // Each page is a group centered at the spine for rotation
          <group
            key={i}
            ref={(el) => {
              if (el) pagesRefs.current[i] = el;
            }}
          >
            <Page index={i} textureUrl={img} />
          </group>
        ))}
      </group>
    </group>
  );
});