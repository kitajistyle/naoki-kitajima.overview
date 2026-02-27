'use client';

import React from 'react';

const Section = ({
  className,
  children,
  align = "center",
  compact = false
}: {
  className?: string;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  compact?: boolean;
}) => {
  let alignClass = "justify-center items-center text-center px-4";

  if (align === "left") {
    alignClass = "justify-center md:justify-start items-center px-4 md:pl-12 text-center md:text-left";
  }
  if (align === "right") {
    alignClass = "justify-center md:justify-end items-center px-4 md:pr-12 text-center md:text-right";
  }

  return (
    <section className={`h-screen w-full flex ${alignClass} pointer-events-none relative ${className}`}>
      <div className={`pointer-events-auto bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10 ${compact ? 'max-w-[200px] md:max-w-xs' : 'max-w-[280px] md:max-w-sm'}`}>
        {children}
      </div>
    </section>
  );
};

const SkillTag = ({ skill }: { skill: string }) => (
  <span className="px-2 py-1 bg-slate-800/70 text-white text-xs rounded-full">
    {skill}
  </span>
);

export const UI = () => {
  return (
    <div className="relative w-full z-10">
      {/* SECTION 1: Spacer - Book pops out and opens (0-35%) */}
      <div className="h-[200vh]"></div>

      {/* SECTION 3: About - Profile display (35-50%) */}
      <Section align="right" className="h-[150vh]" compact>
        <h2 className="text-lg md:text-xl text-slate-800 font-bold mb-2">About</h2>
        <p className="text-xs text-amber-700 font-medium mb-2">Payment Infrastructure SRE</p>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
          メガベンチャーにて決済基盤のSREを担当。<br />
          フロントからバックエンドまで<br />
          一気通貫で開発可能。
        </p>
      </Section>

      {/* SECTION 4: Pages turning - Skills & Lifestyle (50-90%) */}
      <div className="h-[400vh] w-full relative pointer-events-none">
        <div className="sticky top-4 left-4 md:top-8 md:left-12 max-w-[180px] md:max-w-[220px] pointer-events-auto p-3 rounded-lg bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
          <h3 className="text-lg text-slate-800 font-bold mb-2">Skills</h3>
          <p className="text-xs text-slate-600 mb-3">スクロールでページをめくってね</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-amber-700 font-medium mb-1">SRE</p>
              <div className="flex flex-wrap gap-1">
                <SkillTag skill="K8s" />
                <SkillTag skill="GCP" />
                <SkillTag skill="Terraform" />
              </div>
            </div>
            <div>
              <p className="text-xs text-amber-700 font-medium mb-1">Dev</p>
              <div className="flex flex-wrap gap-1">
                <SkillTag skill="Go" />
                <SkillTag skill="TypeScript" />
                <SkillTag skill="React" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Contact (90-100%) */}
      <Section className="h-screen" compact>
        <h2 className="text-xl md:text-2xl text-slate-800 font-bold mb-3">
          Contact
        </h2>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors pointer-events-auto text-xs inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
        <button
          className="mt-4 text-slate-500 hover:text-slate-700 transition-colors pointer-events-auto text-xs underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </button>
      </Section>
    </div>
  );
};
