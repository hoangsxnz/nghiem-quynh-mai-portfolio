/**
 * Wraps each word of a plain-text heading in `.word > .word-inner` so the inner
 * span can slide up from behind the clipped outer one.
 *
 * Nodes are built with createElement/textContent, never innerHTML, so JSON copy
 * can never be parsed as markup. Only use on headings whose content is plain text.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  // Screen readers announce the whole heading from the label; the generated
  // spans are hidden so the name is not read out one word per node.
  el.setAttribute('aria-label', text);
  el.textContent = '';

  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const outer = document.createElement('span');
      outer.className = 'word';
      outer.setAttribute('aria-hidden', 'true');

      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word;

      outer.append(inner);
      el.append(outer, document.createTextNode(' '));
      return inner;
    });
}
