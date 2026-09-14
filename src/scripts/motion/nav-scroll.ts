import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNavScroll(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -120', // never hide while the hero is still on screen
    end: 'max',
    onUpdate: ({ direction }) => nav.classList.toggle('is-hidden', direction === 1),
    onLeaveBack: () => nav.classList.remove('is-hidden'),
  });
}
