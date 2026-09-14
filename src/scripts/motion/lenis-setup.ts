import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis runs off the GSAP ticker (`autoRaf: false`) so the two never drive
 * separate RAF loops and scrub animations stay in sync with the scroll position.
 */
export function createLenis(): { lenis: Lenis; destroy: () => void } {
  const lenis = new Lenis({ lerp: 0.1, duration: 1.2, autoRaf: false });

  const raf = (time: number) => lenis.raf(time * 1000); // ticker is seconds, Lenis wants ms
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  document.documentElement.classList.add('lenis');

  const onClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')!.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 }); // clears the sticky nav
    // Lenis alone would scroll but leave focus on the nav, stranding keyboard users.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  document.addEventListener('click', onClick);

  return {
    lenis,
    destroy() {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    },
  };
}
