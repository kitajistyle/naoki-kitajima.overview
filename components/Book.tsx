'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { Group } from "three";
import {
  BOOK_WIDTH, BOOK_HEIGHT, BOOK_THICKNESS,
  PAGE_THICKNESS, COVER_COLOR, PAGE_COLOR, IMAGES
} from "../constants";

interface BookProps { }
export interface BookRef {
  group: Group | null;
  coverFront: Group | null;
  pages: Group[];
}

// ─── Design tokens ─────────────────────────────────────────────────────────
const CX = BOOK_WIDTH / 2;              // page horizontal center
const TZ = PAGE_THICKNESS / 2 + 0.006; // just above front face
const ACC = "#B45309";  // amber-700
const DARK = "#1E293B";  // slate-800
const MID = "#64748B";  // slate-500
const DIM = "#CBD5E1";  // slate-300 (dividers)

/** Thin horizontal rule */
const Rule = ({ y }: { y: number }) => (
  <mesh position={[CX, y, TZ]}>
    <boxGeometry args={[2.8, 0.012, 0.001]} />
    <meshBasicMaterial color={DIM} />
  </mesh>
);

// ─── Page 0  –  Hero ──────────────────────────────────────────────────────
const HeroContent = () => (
  <>
    <Text position={[CX, 1.65, TZ]} fontSize={0.44} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.1}>
      KITAJI
    </Text>
    <Text position={[CX, 1.18, TZ]} fontSize={0.17} color={DARK}
      anchorX="center" anchorY="middle" letterSpacing={0.06}
      maxWidth={3.0} textAlign="center">
      Full-Stack Software Engineer
    </Text>
    <Rule y={0.78} />
    <Text position={[CX, 0.3, TZ]} fontSize={0.155} color={DARK}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={3.0} lineHeight={1.8}>
      {"Payment Infrastructure SRE\n& Full-Stack Developer\nat a Mega-Venture"}
    </Text>
    <Rule y={-0.45} />
    <Text position={[CX, -0.95, TZ]} fontSize={0.14} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.05}
      textAlign="center" maxWidth={3.0} lineHeight={1.8}>
      {"SRE  x  Full-Stack\nx  Creativity"}
    </Text>
  </>
);

// ─── Page 1  –  About ─────────────────────────────────────────────────────
const AboutContent = () => (
  <>
    <Text position={[CX, 1.75, TZ]} fontSize={0.34} color={DARK}
      anchorX="center" anchorY="middle">
      About
    </Text>
    <Rule y={1.3} />
    <Text position={[CX, 0.92, TZ]} fontSize={0.17} color={ACC}
      anchorX="center" anchorY="middle" textAlign="center" maxWidth={3.0}>
      Payment Infrastructure SRE
    </Text>
    <Rule y={0.55} />
    <Text position={[CX, -0.22, TZ]} fontSize={0.138} color={MID}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={3.0} lineHeight={1.75}>
      {"SRE at a major tech company,\nensuring payment infrastructure\nreliability & security.\n\nFull-stack from frontend\nto backend."}
    </Text>
  </>
);

// ─── Page 2  –  Skills: SRE / Infra ──────────────────────────────────────
const SkillsSREContent = () => (
  <>
    <Text position={[CX, 1.75, TZ]} fontSize={0.34} color={DARK}
      anchorX="center" anchorY="middle">
      Skills
    </Text>
    <Rule y={1.3} />
    <Text position={[CX, 0.92, TZ]} fontSize={0.18} color={ACC}
      anchorX="center" anchorY="middle">
      SRE / Infra
    </Text>
    <Rule y={0.57} />
    {['Kubernetes', 'Terraform', 'GCP', 'Prometheus', 'ArgoCD', 'Datadog'].map((s, i) => (
      <Text key={s}
        position={[CX, 0.22 - i * 0.33, TZ]}
        fontSize={0.175} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.03}>
        {s}
      </Text>
    ))}
  </>
);

// ─── Page 3  –  Skills: Development ──────────────────────────────────────
const SkillsDevContent = () => (
  <>
    <Text position={[CX, 1.75, TZ]} fontSize={0.34} color={DARK}
      anchorX="center" anchorY="middle">
      Skills
    </Text>
    <Rule y={1.3} />
    <Text position={[CX, 0.92, TZ]} fontSize={0.18} color={ACC}
      anchorX="center" anchorY="middle">
      Development
    </Text>
    <Rule y={0.57} />
    {['Go', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker'].map((s, i) => (
      <Text key={s}
        position={[CX, 0.22 - i * 0.33, TZ]}
        fontSize={0.175} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.03}>
        {s}
      </Text>
    ))}
  </>
);

// ─── Page 4  –  Lifestyle / Hobbies ──────────────────────────────────────
const HobbiesContent = () => (
  <>
    <Text position={[CX, 1.75, TZ]} fontSize={0.34} color={DARK}
      anchorX="center" anchorY="middle">
      Lifestyle
    </Text>
    <Rule y={1.3} />
    <Text position={[CX, 0.9, TZ]} fontSize={0.22} color={ACC}
      anchorX="center" anchorY="middle">
      Coffee
    </Text>
    <Text position={[CX, 0.52, TZ]} fontSize={0.135} color={MID}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={2.8} lineHeight={1.65}>
      {"Specialty coffee enthusiast.\nHandcrafting one perfect cup\nevery morning."}
    </Text>
    <Rule y={0.02} />
    <Text position={[CX, -0.42, TZ]} fontSize={0.22} color={ACC}
      anchorX="center" anchorY="middle">
      Dance
    </Text>
    <Text position={[CX, -0.88, TZ]} fontSize={0.135} color={MID}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={2.8} lineHeight={1.65}>
      {"Street dancer — logic meets rhythm.\nAnother form of creative\nexpression beyond code."}
    </Text>
  </>
);

const PAGE_CONTENTS = [
  HeroContent,
  AboutContent,
  SkillsSREContent,
  SkillsDevContent,
  HobbiesContent,
];

// ─── Page mesh ────────────────────────────────────────────────────────────
const Page = ({ index }: { index: number }) => {
  const zOffset = (IMAGES.length - index) * 0.02;
  const Content = PAGE_CONTENTS[index];

  return (
    <group position={[0, 0, zOffset]}>
      {/* Front face (cream) */}
      <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT - 0.2, PAGE_THICKNESS]} />
        <meshStandardMaterial color={PAGE_COLOR} />
      </mesh>

      {/* Back face */}
      <mesh position={[BOOK_WIDTH / 2, 0, -PAGE_THICKNESS / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[BOOK_WIDTH - 0.4, BOOK_HEIGHT - 0.6]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Page content */}
      {Content && <Content />}
    </group>
  );
};

// ─── Book ─────────────────────────────────────────────────────────────────
export const Book = forwardRef<BookRef, BookProps>((props, ref) => {
  const groupRef = React.useRef<Group>(null);
  const coverFrontRef = React.useRef<Group>(null);
  const pagesRefs = React.useRef<Group[]>([]);

  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get coverFront() { return coverFrontRef.current; },
    get pages() { return pagesRefs.current; },
  }));

  return (
    <group ref={groupRef} {...props}>
      {/* Spine */}
      <mesh position={[0, 0, -BOOK_THICKNESS / 2]}>
        <boxGeometry args={[BOOK_THICKNESS, BOOK_HEIGHT, BOOK_THICKNESS + 0.1]} />
        <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
      </mesh>

      {/* Back Cover */}
      <mesh position={[BOOK_WIDTH / 2, 0, -BOOK_THICKNESS / 2]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.1]} />
        <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
      </mesh>
      <mesh position={[BOOK_WIDTH / 2, 0, -BOOK_THICKNESS / 2 - 0.06]}>
        <planeGeometry args={[BOOK_WIDTH * 0.78, BOOK_HEIGHT * 0.82]} />
        <meshStandardMaterial color="#8D6E63" side={DoubleSide} />
      </mesh>
      <Text position={[BOOK_WIDTH / 2, 0.5, -BOOK_THICKNESS / 2 - 0.12]}
        fontSize={0.22} color="#FFF8E7"
        anchorX="center" anchorY="middle" letterSpacing={0.06}
        rotation={[0, Math.PI, 0]}>
        {"Thank you for reading"}
      </Text>
      <Text position={[BOOK_WIDTH / 2, -1.2, -BOOK_THICKNESS / 2 - 0.12]}
        fontSize={0.32} color="#D4A96A"
        anchorX="center" anchorY="middle" letterSpacing={0.1}
        rotation={[0, Math.PI, 0]}>
        KITAJI
      </Text>

      {/* Front Cover */}
      <group ref={coverFrontRef} position={[0, 0, BOOK_THICKNESS / 2]}>
        <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.1]} />
          <meshStandardMaterial color={COVER_COLOR} roughness={0.4} />
        </mesh>
        <mesh position={[BOOK_WIDTH / 2, 0, 0.06]}>
          <planeGeometry args={[BOOK_WIDTH * 0.6, BOOK_HEIGHT * 0.8]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
        <Text position={[BOOK_WIDTH / 2, 0.8, 0.12]}
          fontSize={0.42} color="#FFF8E7"
          anchorX="center" anchorY="middle" letterSpacing={0.08}>
          KITAJI
        </Text>
        <Text position={[BOOK_WIDTH / 2, 0.2, 0.12]}
          fontSize={0.18} color="#D4A96A"
          anchorX="center" anchorY="middle" letterSpacing={0.12}>
          Portfolio
        </Text>
      </group>

      {/* Pages */}
      <group position={[0.1, 0, (BOOK_THICKNESS / 2) - 0.15]}>
        {IMAGES.map((_, i) => (
          <group key={i} ref={(el) => { if (el) pagesRefs.current[i] = el; }}>
            <Page index={i} />
          </group>
        ))}
      </group>
    </group>
  );
});