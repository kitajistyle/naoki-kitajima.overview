'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { useSettings } from "@/contexts/SettingsContext";
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
const HeroContent = () => {
  const { t } = useSettings();
  return (
    <>
      <Text position={[CX, 2.15, TZ]} fontSize={0.13} color={ACC}
        anchorX="center" anchorY="middle" letterSpacing={0.18}>
        {t('book.hero.label')}
      </Text>
      <Rule y={1.95} />

      <Image url={IMAGES[1]} position={[CX, 1.2, TZ]} scale={1.5} />

      <Text position={[CX, 0.3, TZ]} fontSize={0.38} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.06}>
        {t('book.hero.name')}
      </Text>
      <Text position={[CX, -0.05, TZ]} fontSize={0.16} color={MID}
        anchorX="center" anchorY="middle" letterSpacing={0.05}>
        {t('book.hero.fullname')}
      </Text>

      <Rule y={-0.28} />

      <Text position={[CX, -0.58, TZ]} fontSize={0.165} color={DARK}
        anchorX="center" anchorY="middle" textAlign="center"
        maxWidth={3.1} lineHeight={1.7}>
        {t('book.hero.role')}
      </Text>

      <Rule y={-1.1} />

      <Text position={[CX, -1.38, TZ]} fontSize={0.13} color={ACC}
        anchorX="center" anchorY="middle" letterSpacing={0.08}>
        {t('book.hero.tagline')}
      </Text>

      <Rule y={-1.72} />
      <Text position={[CX, -1.98, TZ]} fontSize={0.115} color={MID}
        anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {t('book.hero.location')}
      </Text>
    </>
  );
};

// ─── Page 1  –  Career ────────────────────────────────────────────────────
const AboutContent = () => {
  const { t } = useSettings();
  return (
    <>
      <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
        anchorX="center" anchorY="middle" letterSpacing={0.06}>
        {t('book.about.title')}
      </Text>
      <Rule y={1.85} />

      <Text position={[0.35, 1.52, TZ]} fontSize={0.115} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.03}>
        {t('book.career.edu.date')}
      </Text>
      <Text position={[0.35, 1.28, TZ]} fontSize={0.155} color={DARK}
        anchorX="left" anchorY="middle" maxWidth={2.9}>
        {t('book.career.edu.name')}
      </Text>
      <Text position={[0.35, 1.06, TZ]} fontSize={0.125} color={MID}
        anchorX="left" anchorY="middle">
        {t('book.career.edu.dept')}
      </Text>

      <Rule y={0.82} />

      <Text position={[0.35, 0.58, TZ]} fontSize={0.115} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.03}>
        {t('book.career.taian.date')}
      </Text>
      <Text position={[0.35, 0.35, TZ]} fontSize={0.155} color={DARK}
        anchorX="left" anchorY="middle">
        {t('book.career.taian.name')}
      </Text>
      <Text position={[0.35, 0.13, TZ]} fontSize={0.125} color={MID}
        anchorX="left" anchorY="middle" maxWidth={2.9}>
        {t('book.career.taian.role')}
      </Text>

      <Rule y={-0.1} />

      <Text position={[0.35, -0.34, TZ]} fontSize={0.115} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.03}>
        {t('book.career.zozo.date')}
      </Text>
      <Text position={[0.35, -0.57, TZ]} fontSize={0.155} color={DARK}
        anchorX="left" anchorY="middle">
        {t('book.career.zozo.name')}
      </Text>
      <Text position={[0.35, -0.79, TZ]} fontSize={0.125} color={MID}
        anchorX="left" anchorY="middle" maxWidth={2.9}>
        {t('book.career.zozo.role')}
      </Text>

      <Rule y={-1.02} />

      <Text position={[0.35, -1.26, TZ]} fontSize={0.115} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.03}>
        {t('book.career.tripx.date')}
      </Text>
      <Text position={[0.35, -1.49, TZ]} fontSize={0.155} color={DARK}
        anchorX="left" anchorY="middle">
        {t('book.career.tripx.name')}
      </Text>
      <Text position={[0.35, -1.71, TZ]} fontSize={0.125} color={MID}
        anchorX="left" anchorY="middle" maxWidth={2.9}>
        {t('book.career.tripx.role')}
      </Text>

      <Rule y={-1.95} />
      <Text position={[CX, -2.15, TZ]} fontSize={0.105} color={MID}
        anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {t('book.career.summary')}
      </Text>
    </>
  );
};

// ─── Page 2  –  Skills ────────────────────────────────────────────────────────
const SkillsDevContent = () => {
  const { t } = useSettings();
  return (
    <>
      <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
        anchorX="center" anchorY="middle">
        {t('book.skills.title')}
      </Text>
      <Rule y={1.85} />
      <Text position={[CX, 1.55, TZ]} fontSize={0.2} color={ACC}
        anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {t('book.skills.dev.section')}
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
    </>
  );
};



// ─── Page 4  –  Lifestyle / Hobbies ──────────────────────────────────────
const HobbiesContent = () => {
  const { t } = useSettings();
  return (
    <>
      <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
        anchorX="center" anchorY="middle">
        {t('book.lifestyle.title')}
      </Text>
      <Rule y={1.85} />

      <Text position={[CX, 1.55, TZ]} fontSize={0.22} color={ACC}
        anchorX="center" anchorY="middle" letterSpacing={0.05}>
        {t('book.lifestyle.coffee.title')}
      </Text>
      <Image url={IMAGES[2]} position={[CX, 0.78, TZ]} scale={1.2} />
      <Text position={[CX, 0.05, TZ]} fontSize={0.12} color={MID}
        anchorX="center" anchorY="middle" textAlign="center"
        maxWidth={3.0} lineHeight={1.65}>
        {t('book.lifestyle.coffee.desc')}
      </Text>

      <Text position={[CX, -0.3, TZ]} fontSize={0.22} color={ACC}
        anchorX="center" anchorY="middle" letterSpacing={0.05}>
        {t('book.lifestyle.dance.title')}
      </Text>
      <Image url={IMAGES[3]} position={[CX, -1.1, TZ]} scale={1.2} />
      <Text position={[CX, -1.88, TZ]} fontSize={0.115} color={MID}
        anchorX="center" anchorY="middle" textAlign="center"
        maxWidth={3.0}>
        {t('book.lifestyle.dance.desc')}
      </Text>
    </>
  );
};


// ─── Page 5  –  Contact ──────────────────────────────────────────────────
const ContactContent = () => {
  const { t } = useSettings();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Text position={[CX, 2.15, TZ]} fontSize={0.36} color={DARK}
        anchorX="center" anchorY="middle">
        {t('book.contact.title')}
      </Text>
      <Rule y={1.85} />

      <Text position={[CX, 1.45, TZ]} fontSize={0.14} color={MID}
        anchorX="center" anchorY="middle" textAlign="center" maxWidth={2.8}>
        {t('book.contact.message')}
      </Text>

      <Rule y={1.1} />

      <Text position={[0.45, 0.7, TZ]} fontSize={0.17} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.04}>
        {t('book.contact.x')}
      </Text>
      <Text position={[0.45, 0.46, TZ]} fontSize={0.14} color={DARK}
        anchorX="left" anchorY="middle">
        @kitajistyle
      </Text>

      <Rule y={0.22} />

      <Text position={[0.45, -0.02, TZ]} fontSize={0.17} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.04}>
        {t('book.contact.github')}
      </Text>
      <Text position={[0.45, -0.26, TZ]} fontSize={0.14} color={DARK}
        anchorX="left" anchorY="middle">
        github.com/kitajistyle
      </Text>

      <Rule y={-0.5} />

      <Text position={[0.45, -0.74, TZ]} fontSize={0.17} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.04}>
        {t('book.contact.linkedin')}
      </Text>
      <Text position={[0.45, -0.98, TZ]} fontSize={0.14} color={DARK}
        anchorX="left" anchorY="middle" maxWidth={2.8}>
        linkedin.com/in/kitajistyle
      </Text>

      <Rule y={-1.22} />

      <Text position={[0.45, -1.46, TZ]} fontSize={0.17} color={ACC}
        anchorX="left" anchorY="middle" letterSpacing={0.04}>
        {t('book.contact.qiita')}
      </Text>
      <Text position={[0.45, -1.7, TZ]} fontSize={0.14} color={DARK}
        anchorX="left" anchorY="middle">
        qiita.com/kitajistyle
      </Text>

      <Rule y={-1.95} />
      {isMobile && (
        <Text position={[CX, -2.2, TZ]} fontSize={0.12} color={MID}
          anchorX="center" anchorY="middle" letterSpacing={0.04}>
          {t('book.contact.hint')}
        </Text>
      )}
    </>
  );
};

const PAGE_CONTENTS = [
  HeroContent,
  AboutContent,
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