# Page Server Component Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove `'use client'` from `app/page.tsx` by extracting all client-side logic into a new `PortfolioClient` component.

**Architecture:** `page.tsx` becomes a pure Server Component that renders a single `<PortfolioClient />`. All interactive logic (Lenis smooth scroll, GSAP registration, dynamic Scene import) moves into `PortfolioClient.tsx` which carries the `'use client'` directive. No other files are changed.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, GSAP, Lenis

---

### Task 1: Create `components/PortfolioClient.tsx`

**Files:**
- Create: `components/PortfolioClient.tsx`

**Step 1: Create the file with all current `page.tsx` client logic**

The content is almost identical to the current `page.tsx`. Two things change:
1. The function is renamed from `Home` to `PortfolioClient` and named-exported.
2. The Lenis RAF cleanup bug is fixed: the ticker callback must be stored in a variable so the same reference can be removed.

```tsx
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';
import { UI } from '@/components/UI';
import { ContactSection } from '@/components/UI';
import { SettingsToggle } from '@/components/SettingsToggle';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-[#f3f4f6] dark:bg-[#1a1a2e]" />
  ),
});

export function PortfolioClient() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Store the callback reference so we can remove it in cleanup
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <>
      <SettingsToggle />
      <Scene cameraSettings={{ position: [0, 0, 12], fov: 35 }} />
      <UI />
      <ContactSection />
    </>
  );
}
```

**Step 2: Verify the file exists and TypeScript is satisfied**

Run: `cd /Users/na/ghq/github.com/kitajistyle/naoki-kitajima.overview && npx tsc --noEmit`
Expected: no errors related to `PortfolioClient.tsx`

**Step 3: Commit**

```bash
git add components/PortfolioClient.tsx
git commit -m "feat: extract PortfolioClient component with Lenis RAF fix"
```

---

### Task 2: Convert `app/page.tsx` to Server Component

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace the entire file content**

```tsx
import { PortfolioClient } from '@/components/PortfolioClient';

export default function Home() {
  return <PortfolioClient />;
}
```

No `'use client'`, no hooks, no dynamic imports — just a Server Component that renders the client boundary.

**Step 2: Run TypeScript check**

Run: `cd /Users/na/ghq/github.com/kitajistyle/naoki-kitajima.overview && npx tsc --noEmit`
Expected: exit 0, no errors

**Step 3: Run lint**

Run: `cd /Users/na/ghq/github.com/kitajistyle/naoki-kitajima.overview && npm run lint`
Expected: no errors or warnings

**Step 4: Build to confirm no SSR / bundling issues**

Run: `cd /Users/na/ghq/github.com/kitajistyle/naoki-kitajima.overview && npm run build`
Expected: build completes successfully. The build output should show `○ /` (static) for the home route, not `λ` (dynamic/server), because the page has no server-side data fetching.

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: convert page.tsx to Server Component"
```

---

## Verification Checklist

After both tasks:

- [ ] `app/page.tsx` has no `'use client'` directive
- [ ] `app/page.tsx` has no React hook imports
- [ ] `components/PortfolioClient.tsx` exists with `'use client'`
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Dev server shows the portfolio correctly (`npm run dev` and visit `http://localhost:3000`)
- [ ] Smooth scroll still works
- [ ] 3D book animation still works
- [ ] Theme/language toggles still work
