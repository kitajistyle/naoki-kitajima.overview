import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full" />
      
      <div className="z-10 text-center px-6 animate-fade-in-up">
        <h2 className="text-indigo-400 font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-6 font-bold opacity-80">
          Portfolio Project
        </h2>
        <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
          Coming Soon
        </h1>
        <div className="w-12 h-[1px] bg-indigo-500/50 mx-auto mb-8" />
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="https://github.com/kitajistyle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/10 overflow-hidden"
            >
              <span className="relative z-10">Check GitHub</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <p className="text-white/40 text-sm font-sans italic">
              Stay tuned for something exciting.
            </p>
        </div>
      </div>
      
      {/* Visual background details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Footer info */}
      <div className="absolute bottom-12 text-white/20 text-xs font-sans tracking-[0.2em] uppercase">
          &copy; 2024 Naoki Kitajima
      </div>
    </main>
  );
}
