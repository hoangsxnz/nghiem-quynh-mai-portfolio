import type { Picture, SectionMeta, Link } from '@content-types/content-atoms';

/* ---------- Shared atoms for the Pika project group ---------- */

/** label + one-line note; used for pillars and value props. */
export interface LabelledNote {
  label: string;
  note: string;
}

/** A button that opens one of the source Google files. */
export interface FileLink {
  label: string;
  href: string;
  /** Short line telling the reader what they will see after clicking. */
  note: string;
}

/** Screenshot of a real artefact plus the caption that names what it shows. */
export interface Evidence {
  src: string;
  alt: string;
  caption: string;
  /** Rendered width; sheet extracts ask for 760, phone screenshots for 300. */
  width?: number;
}

/* ---------- About & cover ---------- */

export interface Job {
  period: string;
  company: string;
  role: string;
  bullets: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface EducationEntry {
  year: string;
  title: string;
  note: string;
  kind: 'degree' | 'cert';
}

export interface AboutContent {
  meta: SectionMeta;
  /** Two stacked polaroids, left column of the lead block. */
  portraits: Picture[];
  objective: { title: string; body: string[] };
  quote: string;
  experience: Job[];
  education: EducationEntry[];
  skillGroups: SkillGroup[];
  languages: { name: string; level: string }[];
  tools: string[];
}

/* ---------- Pika: Branding, Strategy, Ads ---------- */

export interface BrandingContent {
  meta: SectionMeta;
  statement: string;
  positioning: LabelledNote[];
  brandVoice: LabelledNote[];
  evidence: Evidence[];
  file: FileLink;
}

/** One link in the Direction → Plan → Pillar → Angle → Calendar → KPI → Đo lường chain. */
export interface StrategyStep {
  step: string;
  vi: string;
  body: string;
}

export interface StrategyContent {
  meta: SectionMeta;
  intro: string;
  chain: StrategyStep[];
  evidence: Evidence[];
  file: FileLink;
}

export interface AdsContent {
  meta: SectionMeta;
  intro: string;
  approach: LabelledNote[];
  evidence: Evidence[];
  file: FileLink;
}

/* ---------- Pika: Social & Community ---------- */

export interface SocialBlock {
  title: string;
  body: string;
  images: Picture[];
  links?: Link[];
  /** Overlap the images instead of listing them, for a block whose pictures are
      two halves of one continuous screenshot. Desktop only. */
  stack?: boolean;
}

export interface SocialContent {
  meta: SectionMeta;
  channel: { name: string; handle: string; href: string; note: string };
  blocks: SocialBlock[];
  stats: Evidence;
  statsNote: string;
  community: { title: string; body: string; evidence: Evidence; file: FileLink };
}

/* ---------- Pika: UGC ---------- */

export interface UgcFact {
  label: string;
  value: string;
  file?: FileLink;
}

export interface UgcChannel {
  name: string;
  platform: 'Facebook' | 'TikTok';
  href: string;
  image: Picture;
}

export interface UgcContent {
  meta: SectionMeta;
  intro: string;
  facts: UgcFact[];
  evidence: Evidence[];
  channels: UgcChannel[];
}

/* ---------- AI First & Contact ---------- */

export interface AiFirstContent {
  meta: SectionMeta;
  tools: { name: string; use: string }[];
  workflow: { stage: string; human: string; ai: string }[];
  agents: { title: string; body: string; items: { name: string; note: string }[] };
  boundary: string;
}

export interface ContactCard {
  kind: 'email' | 'phone' | 'location' | 'linkedin';
  label: string;
  value: string;
  /** `null` renders as plain text instead of a link. */
  href: string | null;
}

export interface ContactContent {
  /** No section header here, so only the anchor id and the screen-reader title. */
  meta: { id: string; title: string };
  intro: string;
  cards: ContactCard[];
  cta: Link;
  closing: string;
  footer: string;
}
