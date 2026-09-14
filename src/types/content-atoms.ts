/**
 * Content contracts for every `src/data/*.json` file.
 * Shared atoms live at the top; each phase appends its own section interface below.
 * Nobody edits an interface another phase declared.
 */

/* ---------- Shared atoms ---------- */

export interface Sticker {
  label: string;
  tone?: 'red' | 'maroon';
}

export interface Picture {
  /** Filename inside `src/assets/images/`, resolved by `@lib/image-map`. */
  src: string;
  alt: string;
  caption?: string;
  tilt?: 1 | 2 | 3 | 4;
  /** Overrides the polaroid default width; charts use 720. */
  width?: number;
}

export interface Metric {
  value: string;
  label: string;
  note?: string;
}

export interface SectionMeta {
  id: string;
  /** Two-digit index rendered in the sticker, e.g. "01". */
  index: string;
  title: string;
  subtitle?: string;
}

export interface Link {
  label: string;
  href: string;
}

/* ---------- Phase 1 sections ---------- */

export interface SiteMeta {
  title: string;
  description: string;
  /** Filename inside `src/assets/images/`. */
  ogImage: string;
}

export interface NavContent {
  brand: string;
  items: { id: string; label: string }[];
}

export interface HeroContent {
  name: string;
  role: string;
  tagline: string[];
  oneLiner: string;
  stamp: string;
  photo: Picture;
  scrollCue: string;
  quickLinks: Link[];
}

