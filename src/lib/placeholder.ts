/**
 * A JSON value the owner still has to supply. Such a value must never reach an
 * `href`, a `src` or a metric's big number — it renders as a visible flag instead.
 */
export const isPlaceholder = (v: string | null | undefined): boolean =>
  typeof v === 'string' && v.trimStart().startsWith('[PLACEHOLDER');
