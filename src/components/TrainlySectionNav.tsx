"use client";

import { useEffect, useState } from "react";

type CaseSection = { id: string; label: string };

export function TrainlySectionNav({ sections }: { sections: readonly CaseSection[] }) {
  const [current, setCurrent] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections.flatMap(section => {
      const element = document.getElementById(section.id);
      return element ? [element] : [];
    });

    function syncHash() {
      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
      catch { return; }
      const sectionId = target?.closest<HTMLElement>(".td-section")?.id;
      if (sectionId && sections.some(section => section.id === sectionId)) setCurrent(sectionId);
    }

    function syncVisibleSection() {
      const readingLine = window.innerHeight * .18;
      const positions = elements.map(element => ({ id: element.id, bounds: element.getBoundingClientRect() }));
      const reading = positions.find(({ bounds }) => bounds.top <= readingLine && bounds.bottom > readingLine);
      if (reading) { setCurrent(reading.id); return; }
      const next = positions.find(({ bounds }) => bounds.top > readingLine && bounds.top < window.innerHeight * .4);
      if (next) setCurrent(next.id);
    }

    let observer: IntersectionObserver | null = null;
    function observeReadingBand() {
      observer?.disconnect();
      // Use viewport-height pixels: IO percentage margins resolve against width.
      observer = new IntersectionObserver(syncVisibleSection, {
        rootMargin: `-${Math.round(window.innerHeight * .18)}px 0px -${Math.round(window.innerHeight * .6)}px 0px`,
        threshold: 0,
      });
      elements.forEach(element => observer!.observe(element));
      syncVisibleSection();
    }
    // Observe a reading band instead of driving scroll or rewriting the hash.
    observeReadingBand();
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("resize", observeReadingBand);
    return () => {
      observer?.disconnect();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("resize", observeReadingBand);
    };
  }, [sections]);

  return <nav aria-label="Case study sections">
    <p>Inside the case</p>
    {sections.map((section, index) => <a
      key={section.id}
      href={`#${section.id}`}
      aria-current={current === section.id ? "location" : undefined}
      onClick={() => setCurrent(section.id)}
    ><span>0{index + 1}</span>{section.label}<i aria-hidden="true">↗</i></a>)}
  </nav>;
}
