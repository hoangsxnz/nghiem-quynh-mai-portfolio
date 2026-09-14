import { gsap } from 'gsap';

/** Desktop only — called from the width-gated matchMedia query. */
export function initParallax(): void {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const raw = Number(el.dataset.parallax) || 0.1;
    // clamp, not Math.min: phase 5 passes negative values for alternating columns.
    const amount = gsap.utils.clamp(-12, 12, raw * 100);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}
