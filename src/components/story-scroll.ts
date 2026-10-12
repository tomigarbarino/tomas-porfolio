/** Keep chapter art and its internal steps on the same unobscured reading line. */
export function storyReadingLine(story: Element | null): number {
  const fallback = window.innerWidth <= 800 ? Math.min(window.innerHeight * .65, 380) : window.innerHeight * .4;
  if (window.innerWidth > 800) return fallback;
  const visual = story?.querySelector<HTMLElement>(".origin-story__visual");
  if (!visual || getComputedStyle(visual).position !== "sticky") return fallback;
  return Math.min(window.innerHeight - 48, Math.max(fallback, visual.getBoundingClientRect().bottom + 24));
}
