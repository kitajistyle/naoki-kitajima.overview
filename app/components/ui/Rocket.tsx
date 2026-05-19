export function Rocket() {
  return (
    <div className="[perspective:700px] flex items-center justify-center w-full h-full">
      <div className="[transform:rotateX(15deg)rotateY(-28deg)]">
        <div className="relative flex flex-col items-center">

          {/* Nose cone */}
          <div className="relative w-10 h-9 flex-shrink-0">
            <div className="absolute inset-0 bg-zinc-300 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />
            <div className="absolute inset-0 bg-zinc-500 [clip-path:polygon(50%_0%,100%_100%,112%_100%)]" />
          </div>

          {/* Body */}
          <div className="relative w-10 h-[100px] bg-zinc-200">
            {/* Right face (3D depth) */}
            <div className="absolute inset-y-0 left-full w-3 bg-zinc-500" />
            {/* Porthole window */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-sky-400 ring-2 ring-zinc-400" />
            {/* Right side of window (3D depth) */}
            <div className="absolute top-5 left-[calc(50%+12px)] w-3 h-5 rounded-r-full bg-sky-700/60" />
            {/* Accent stripe */}
            <div className="absolute bottom-7 inset-x-0 h-1.5 bg-zinc-400" />
            {/* Left fin */}
            <div className="absolute bottom-0 -left-7 w-8 h-14 bg-zinc-300 [clip-path:polygon(100%_0%,100%_100%,0%_100%)]" />
            {/* Right fin (in shadow) */}
            <div className="absolute bottom-0 -right-4 w-5 h-14 bg-zinc-600 [clip-path:polygon(0%_0%,0%_100%,100%_100%)]" />
          </div>

          {/* Exhaust nozzle */}
          <div className="relative w-8 h-3 flex-shrink-0">
            <div className="absolute inset-0 bg-zinc-400 [clip-path:polygon(5%_0%,95%_0%,80%_100%,20%_100%)]" />
            <div className="absolute inset-0 bg-zinc-600 [clip-path:polygon(95%_0%,112%_0%,96%_100%,80%_100%)]" />
          </div>

          {/* Flame */}
          <div className="relative -mt-0.5 flex flex-col items-center">
            <div className="w-6 h-12 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500/0 [clip-path:polygon(0%_0%,100%_0%,50%_100%)] animate-pulse" />
            <div className="w-3.5 h-8 -mt-7 bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300/0 [clip-path:polygon(0%_0%,100%_0%,50%_100%)] animate-pulse [animation-delay:150ms]" />
          </div>

        </div>
      </div>
    </div>
  )
}
