'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { Text, Image } from "@react-three/drei";
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
    {/* ヘッダーラベル */}
    <Text position={[CX, 2.15, TZ]} fontSize={0.13} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.18}>
      HERO
    </Text>
    <Rule y={1.95} />

    {/* プロフィール画像（正方形、大きめ） */}
    <Image url={IMAGES[1]} position={[CX, 1.2, TZ]} scale={1.5} />

    {/* 名前 */}
    <Text position={[CX, 0.3, TZ]} fontSize={0.38} color={DARK}
      anchorX="center" anchorY="middle" letterSpacing={0.06}>
      KITAJI
    </Text>
    <Text position={[CX, -0.05, TZ]} fontSize={0.16} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.05}>
      Naoki Kitajima
    </Text>

    <Rule y={-0.28} />

    {/* 肩書き */}
    <Text position={[CX, -0.58, TZ]} fontSize={0.165} color={DARK}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={3.1} lineHeight={1.7}>
      {"Payment Infra SRE\n& Full-Stack Developer"}
    </Text>

    <Rule y={-1.1} />

    {/* キーワードタグ */}
    <Text position={[CX, -1.38, TZ]} fontSize={0.13} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.08}>
      {"SRE  ×  Full-Stack  ×  Creativity"}
    </Text>

    {/* フッター */}
    <Rule y={-1.72} />
    <Text position={[CX, -1.98, TZ]} fontSize={0.115} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      {"Tokyo / Japan  ·  2026"}
    </Text>
  </>
);

// ─── Page 1  –  Career ────────────────────────────────────────────────────
const AboutContent = () => (
  <>
    {/* ヘッダー */}
    <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
      anchorX="center" anchorY="middle" letterSpacing={0.06}>
      About
    </Text>
    <Rule y={1.85} />

    {/* 東京理科大学 */}
    <Text position={[0.35, 1.52, TZ]} fontSize={0.115} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.03}>
      2022.04
    </Text>
    <Text position={[0.35, 1.28, TZ]} fontSize={0.155} color={DARK}
      anchorX="left" anchorY="middle" maxWidth={2.9}>
      Tokyo University of Science
    </Text>
    <Text position={[0.35, 1.06, TZ]} fontSize={0.125} color={MID}
      anchorX="left" anchorY="middle">
      B.Eng. — Information Science
    </Text>

    <Rule y={0.82} />

    {/* TAIAN */}
    <Text position={[0.35, 0.58, TZ]} fontSize={0.115} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.03}>
      2024.07 – 2025.03
    </Text>
    <Text position={[0.35, 0.35, TZ]} fontSize={0.155} color={DARK}
      anchorX="left" anchorY="middle">
      TAIAN Inc.
    </Text>
    <Text position={[0.35, 0.13, TZ]} fontSize={0.125} color={MID}
      anchorX="left" anchorY="middle" maxWidth={2.9}>
      Frontend Engineer — BFF & UI
    </Text>

    <Rule y={-0.1} />

    {/* ZOZO */}
    <Text position={[0.35, -0.34, TZ]} fontSize={0.115} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.03}>
      2025.07 – 2026.03
    </Text>
    <Text position={[0.35, -0.57, TZ]} fontSize={0.155} color={DARK}
      anchorX="left" anchorY="middle">
      ZOZO Inc.
    </Text>
    <Text position={[0.35, -0.79, TZ]} fontSize={0.125} color={MID}
      anchorX="left" anchorY="middle" maxWidth={2.9}>
      Backend Eng. — Microservices
    </Text>

    <Rule y={-1.02} />

    {/* TripX / EasyX */}
    <Text position={[0.35, -1.26, TZ]} fontSize={0.115} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.03}>
      2025.07 – Present
    </Text>
    <Text position={[0.35, -1.49, TZ]} fontSize={0.155} color={DARK}
      anchorX="left" anchorY="middle">
      TripX / EasyX
    </Text>
    <Text position={[0.35, -1.71, TZ]} fontSize={0.125} color={MID}
      anchorX="left" anchorY="middle" maxWidth={2.9}>
      Full-Stack — AI Products
    </Text>

    <Rule y={-1.95} />
    <Text position={[CX, -2.15, TZ]} fontSize={0.105} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      4 experiences  ·  2022–present
    </Text>
  </>
);

// ─── Page 2  –  Skills: SRE / Infra ──────────────────────────────────────
const SkillsSREContent = () => (
  <>
    <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
      anchorX="center" anchorY="middle">
      Skills
    </Text>
    <Rule y={1.85} />
    <Text position={[CX, 1.55, TZ]} fontSize={0.2} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      SRE / Infrastructure
    </Text>
    <Rule y={1.25} />
    {['Kubernetes', 'Terraform', 'GCP', 'Prometheus', 'ArgoCD', 'Datadog'].map((s, i) => (
      <Text key={s}
        position={[CX, 0.82 - i * 0.46, TZ]}
        fontSize={0.21} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {s}
      </Text>
    ))}
    <Rule y={-1.95} />
    <Text position={[CX, -2.15, TZ]} fontSize={0.105} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      → see also: Development
    </Text>
  </>
);

// ─── Page 3  –  Skills: Development ──────────────────────────────────────
const SkillsDevContent = () => (
  <>
    <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
      anchorX="center" anchorY="middle">
      Skills
    </Text>
    <Rule y={1.85} />
    <Text position={[CX, 1.55, TZ]} fontSize={0.2} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      Development
    </Text>
    <Rule y={1.25} />
    {['Go', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker'].map((s, i) => (
      <Text key={s}
        position={[CX, 0.82 - i * 0.46, TZ]}
        fontSize={0.21} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {s}
      </Text>
    ))}
    <Rule y={-1.95} />
    <Text position={[CX, -2.15, TZ]} fontSize={0.105} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      → see also: SRE / Infra
    </Text>
  </>
);

// ─── Page 4  –  Lifestyle / Hobbies ──────────────────────────────────────
const HobbiesContent = () => (
  <>
    <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
      anchorX="center" anchorY="middle">
      Lifestyle
    </Text>
    <Rule y={1.85} />

    {/* Coffee セクション */}
    <Text position={[CX, 1.55, TZ]} fontSize={0.22} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.05}>
      ☕  Coffee
    </Text>
    <Image url={IMAGES[2]} position={[CX, 0.78, TZ]} scale={1.2} />
    <Text position={[CX, 0.05, TZ]} fontSize={0.12} color={MID}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={3.0} lineHeight={1.65}>
      {"Specialty coffee enthusiast.\nHandcrafting one perfect cup every morning."}
    </Text>

    <Rule y={-0.3} />

    {/* Dance セクション */}
    <Text position={[CX, -0.6, TZ]} fontSize={0.22} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.05}>
      🕺  Dance
    </Text>
    <Image url={IMAGES[3]} position={[CX, -1.3, TZ]} scale={1.2} />
    <Text position={[CX, -1.88, TZ]} fontSize={0.115} color={MID}
      anchorX="center" anchorY="middle" textAlign="center"
      maxWidth={3.0}>
      {"Street dancer — logic meets rhythm."}
    </Text>

    <Rule y={-2.1} />

    {/* Thank you */}
    <Text position={[CX, -2.28, TZ]} fontSize={0.13} color={ACC}
      anchorX="center" anchorY="middle" letterSpacing={0.06}>
      {"Thank you for reading  ✦"}
    </Text>
  </>
);


// ─── Page 5  –  Contact ──────────────────────────────────────────────────
const ContactContent = () => (
  <>
    <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
      anchorX="center" anchorY="middle">
      Contact
    </Text>
    <Rule y={1.85} />

    <Text position={[CX, 1.45, TZ]} fontSize={0.14} color={MID}
      anchorX="center" anchorY="middle" textAlign="center" maxWidth={2.8}>
      {"Feel free to reach out!"}
    </Text>

    <Rule y={1.1} />

    {/* X */}
    <Text position={[0.45, 0.7, TZ]} fontSize={0.17} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.04}>
      X (Twitter)
    </Text>
    <Text position={[0.45, 0.46, TZ]} fontSize={0.14} color={DARK}
      anchorX="left" anchorY="middle">
      @kitajistyle
    </Text>

    <Rule y={0.22} />

    {/* GitHub */}
    <Text position={[0.45, -0.02, TZ]} fontSize={0.17} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.04}>
      GitHub
    </Text>
    <Text position={[0.45, -0.26, TZ]} fontSize={0.14} color={DARK}
      anchorX="left" anchorY="middle">
      github.com/kitajistyle
    </Text>

    <Rule y={-0.5} />

    {/* LinkedIn */}
    <Text position={[0.45, -0.74, TZ]} fontSize={0.17} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.04}>
      LinkedIn
    </Text>
    <Text position={[0.45, -0.98, TZ]} fontSize={0.14} color={DARK}
      anchorX="left" anchorY="middle" maxWidth={2.8}>
      linkedin.com/in/kitajistyle
    </Text>

    <Rule y={-1.22} />

    {/* Qiita */}
    <Text position={[0.45, -1.46, TZ]} fontSize={0.17} color={ACC}
      anchorX="left" anchorY="middle" letterSpacing={0.04}>
      Qiita
    </Text>
    <Text position={[0.45, -1.7, TZ]} fontSize={0.14} color={DARK}
      anchorX="left" anchorY="middle">
      qiita.com/kitajistyle
    </Text>

    <Rule y={-1.95} />
    <Text position={[CX, -2.2, TZ]} fontSize={0.12} color={MID}
      anchorX="center" anchorY="middle" letterSpacing={0.04}>
      {"↓ Click the icons below ↓"}
    </Text>
  </>
);

const PAGE_CONTENTS = [
  HeroContent,
  AboutContent,
  SkillsSREContent,
  SkillsDevContent,
  HobbiesContent,
  ContactContent,
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