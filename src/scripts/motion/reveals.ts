import { gsap } from 'gsap';
import { splitWords } from './split-words';

/**
 * Every tween is `gsap.to(..., { opacity: 1 })` against the CSS pre-state, never
 * `gsap.from`: `from` would re-hide an element that is already visible if this
 * script runs late.
 */
export function initReveals(): void {
  // Hero is above the fold on every load, so it plays immediately rather than
  // waiting for a scroll that may never come.
  const hero = document.querySelectorAll<HTMLElement>('#hero [data-reveal]');
  if (hero.length) {
    gsap.timeline().to(hero, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
    });
  }

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 110,
      rotate: 4,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (group.closest('#hero')) return;
    const children = group.querySelectorAll('[data-reveal]');
    if (!children.length) return; // a group can legitimately hold none
    gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
    });
  });

  // Anything tagged for reveal that no group owns.
  gsap.utils
    .toArray<HTMLElement>('[data-reveal]')
    .filter((el) => !el.closest('#hero') && !el.closest('[data-reveal-group]'))
    .forEach((el) =>
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    );
}
