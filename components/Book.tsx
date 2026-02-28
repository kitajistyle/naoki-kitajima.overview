'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { Group } from "three";
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

// 画像なし・白紙（クリーム色）ページ
const Page = ({ index }: { index: number }) => {
  const zOffset = (IMAGES.length - index) * 0.02;

  return (
    <group position={[0, 0, zOffset]}>
      {/* Page front */}
      <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT - 0.2, PAGE_THICKNESS]} />
        <meshStandardMaterial color={PAGE_COLOR} />
      </mesh>

      {/* Page back */}
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

      {/* Back Cover Decoration: inner frame */}
      <mesh position={[BOOK_WIDTH / 2, 0, -BOOK_THICKNESS / 2 - 0.06]}>
        <planeGeometry args={[BOOK_WIDTH * 0.78, BOOK_HEIGHT * 0.82]} />
        <meshStandardMaterial color="#8D6E63" side={DoubleSide} />
      </mesh>

      {/* Back Cover: "Thank you for reading" text */}
      <Text
        position={[BOOK_WIDTH / 2, 0.5, -BOOK_THICKNESS / 2 - 0.12]}
        fontSize={0.22}
        color="#FFF8E7"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        rotation={[0, Math.PI, 0]}
      >
        Thank you{"\n"}for reading
      </Text>

      {/* Back Cover: KITAJI label */}
      <Text
        position={[BOOK_WIDTH / 2, -1.2, -BOOK_THICKNESS / 2 - 0.12]}
        fontSize={0.32}
        color="#D4A96A"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        rotation={[0, Math.PI, 0]}
      >
        KITAJI
      </Text>

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
            <Page index={i} />
          </group>
        ))}
      </group>
    </group>
  );
});