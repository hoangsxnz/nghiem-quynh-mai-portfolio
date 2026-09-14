import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLenis } from './lenis-setup';
import { initReveals } from './reveals';
import { initNavScroll } from './nav-scroll';
import { initParallax } from './parallax';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

// Everything that runs at any width, whenever motion is welcome.
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const { destroy } = createLenis();
  initReveals();
  initNavScroll();
  return () => destroy();
});

// Parallax alone sits behind the width condition. Keeping it in a separate query
// means crossing 768px only adds or reverts the scrub tweens — a single query
// holding both would tear down Lenis and re-split every headline on every resize.
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
  initParallax();
});
