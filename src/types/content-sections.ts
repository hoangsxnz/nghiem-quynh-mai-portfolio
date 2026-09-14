import type { Metric, Picture, SectionMeta, Link } from '@content-types/content-atoms';

/* ---------- Phase 3 sections ---------- */

export interface Era {
  range: string;
  title: string;
  body: string;
}

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
  portrait: Picture;
  bio: string[];
  objective: { title: string; body: string };
  quote: string;
  touchpoints: { label: string; note: string }[];
  eras: Era[];
  experience: Job[];
  skillGroups: SkillGroup[];
  languages: { name: string; level: string }[];
  tools: string[];
  education: EducationEntry[];
}

export interface ContactCard {
  kind: 'email' | 'phone' | 'location' | 'linkedin';
  label: string;
  value: string;
  /** `null` renders as plain text; a `[PLACEHOLDER` value renders as text + a visible flag. */
  href: string | null;
}

export interface ContactContent {
  meta: SectionMeta;
  intro: string;
  cards: ContactCard[];
  cta: Link;
  closing: string;
  footer: string;
}

/* ---------- Phase 4 sections ---------- */

/** label + one-line note; used for pillars, value props and touchpoints. */
export interface LabelledNote {
  label: string;
  note: string;
}

export interface Industry {
  name: string;
  headline: string;
  insight: string;
  execution: string;
  tagline: string;
  /** Filename, or a `[PLACEHOLDER: ...]` string when no imagery exists yet. */
  image: string;
}

export interface BrandingContent {
  meta: SectionMeta;
  statement: string;
  pillars: LabelledNote[];
  industries: Industry[];
  valueProps: LabelledNote[];
  brandVoice: string;
  positioningProof: string;
}

export interface CaseStudy {
  title: string;
  challenge: string;
  solutions: { title: string; body: string }[];
  metrics: Metric[];
  gallery: Picture[];
  disclaimer?: string;
}

export interface WorkflowBlock {
  step: string;
  vi: string;
  body: string;
  image?: string;
}

export interface StrategyContent {
  meta: SectionMeta;
  framework: { code: string; title: string; body: string }[];
  workflow: WorkflowBlock[];
  caseStudy: CaseStudy;
}

export interface SeoContent {
  meta: SectionMeta;
  approach: { step: string; body: string }[];
  checklist: string[];
  example: {
    title: string;
    note: string;
    image: string;
    url: string;
    metrics: string;
  };
  secondExample: { title: string; image: string };
}

/* ---------- Phase 5 sections ---------- */

export interface SocialFormat {
  kind: string;
  vi: string;
  body: string;
  images: string[];
  /** Shown instead of images when `images` is empty. CV-sourced counts only. */
  fallback?: string;
}

export interface SocialContent {
  meta: SectionMeta;
  formats: SocialFormat[];
  community: CaseStudy;
  works: {
    title: string;
    items: Picture[];
    note: string;
  };
}

export interface UgcContent {
  meta: SectionMeta;
  belief: string;
  campaign: {
    name: string;
    industry: string;
    insight: string;
    mechanic: string[];
    contentLadder: { stage: string; body: string }[];
    /** Metric names only — never values. That is the line between method and claim. */
    measurement: string[];
    results: string;
    images: string[];
    imageNote: string;
  };
  guardrails: string[];
}

export interface AiFirstContent {
  meta: SectionMeta;
  tools: { name: string; use: string }[];
  workflow: { stage: string; human: string; ai: string }[];
  agent: { title: string; body: string; status: string };
  boundary: string;
  speedClaim: string;
}
