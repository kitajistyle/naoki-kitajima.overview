import React from 'react';

const Section = ({
  className,
  children,
  align = "center"
}: {
  className?: string;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) => {
  // Base classes for mobile (centered) -> md: classes for desktop overrides
  let alignClass = "justify-center items-center text-center px-6";

  if (align === "left") {
    alignClass = "justify-center md:justify-start items-center px-6 md:pl-20 text-center md:text-left";
  }
  if (align === "right") {
    alignClass = "justify-center md:justify-end items-center px-6 md:pr-20 text-center md:text-right";
  }

  return (
    <section className={`h-screen w-full flex ${alignClass} pointer-events-none relative ${className}`}>
      {/* 
        Increased background opacity on mobile for better readability over the 3D element 
        Adjusted width to be responsive
      */}
      <div className="pointer-events-auto bg-white/40 md:bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-xl border border-white/20 w-full max-w-xs md:max-w-lg">
        {children}
      </div>
    </section>
  );
};

export const UI = () => {
  return (
    <div className="relative w-full z-10">

      {/* SECTION 1: Intro */}
      <Section className="h-[150vh]">
        <h1 className="text-5xl md:text-8xl text-slate-800 font-bold mb-4 serif">
          栞への想い
        </h1>
        <p className="text-lg md:text-xl text-slate-900">いつもありがとう</p>
        <p className="mt-8 text-sm animate-bounce text-slate-700">スクロールして開く</p>
      </Section>

      {/* SECTION 2: Spacer */}
      <div className="h-[200vh]"></div>

      {/* SECTION 3: Profile */}
      <Section align="right" className="h-[150vh]">
        <h2 className="text-3xl md:text-4xl text-slate-800 serif mb-4">尾崎栞</h2>
        <div className="text-slate-900 text-sm md:text-base space-y-3">
          <p className="font-semibold text-slate-800">スターバックス アトレ秋葉原アトレ１店</p>
          <p className="leading-relaxed">
            いつも笑顔で頑張っているしおりん<br />
            時々ふざけて、時々強気で、<br />
            でもいつも優しくて、<br />
            そして何より、可愛い！！
          </p>
          <p className="text-xs text-slate-700 italic">そんなしおりんがみんな大好きです</p>
        </div>
      </Section>

      {/* SECTION 4: Pages */}
      <div className="h-[400vh] w-full relative pointer-events-none">
        {/* Adjusted sticky positioning for mobile */}
        <div className="sticky top-4 left-4 md:top-1/2 md:-translate-y-1/2 md:left-20 max-w-[180px] md:max-w-xs pointer-events-auto p-3 md:p-4 rounded-lg bg-white/30 md:bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
          <h3 className="text-2xl md:text-3xl text-slate-800 serif mb-2 md:mb-4">思い出📸</h3>
          <p className="text-slate-900 mb-2 text-sm md:text-base">一緒に過ごしたキラキラな時間が、<br />このページにギュッと詰まってます✨</p>
          <p className="text-xs text-slate-700">スクロールでめくってね〜</p>
        </div>
      </div>

      {/* SECTION 5: Thank You */}
      <Section className="h-[100vh]">
        <h2 className="text-4xl md:text-7xl text-slate-800 serif mb-6">
          ありがとう
        </h2>
        <p className="text-base md:text-lg text-slate-900 max-w-md mx-auto leading-relaxed">
          どつけ！！<br />
          かませ！！<br />
          ぶっ飛ばせ！！<br />
          <span className="block mt-4 text-slate-800 font-semibold"> お前は最高のバリスタだ！！</span>
        </p>
        <button
          className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors pointer-events-auto text-sm md:text-base"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          もう一度見る
        </button>
      </Section>
    </div>
  );
};