/**
 * Single resolver from a JSON filename to an Astro `ImageMetadata`.
 * JSON stores only `"work-watch-photo.png"`; markup never imports an asset directly.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.png',
  { eager: true },
);

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

/** Throws at compile time so a typo in JSON fails loudly, never ships a broken <img>. */
export function image(name: string): ImageMetadata {
  const found = byName.get(name);
  if (!found) throw new Error(`Unknown image "${name}" — check src/data/*.json`);
  return found;
}
