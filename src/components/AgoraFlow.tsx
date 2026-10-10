"use client";

import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";

type NodeName = "requirement" | "evidence" | "review" | "voice";
type Detail = "evidence" | "review";
type Point = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number };

const connections: { from: NodeName; to: NodeName }[] = [
  { from: "requirement", to: "evidence" },
  { from: "evidence", to: "review" },
  { from: "voice", to: "evidence" },
];

function overlaps(a: Box, b: Box) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function endpoint(box: Box, toward: Point): Point {
  const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const ratio = 1 / Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2));
  return { x: center.x + dx * ratio, y: center.y + dy * ratio };
}

function crossesBox(start: Point, end: Point, box: Box) {
  // Clip the segment against each slab. Hide a line obscured by another node,
  // rather than letting its arrow appear to name an unrelated destination.
  let near = 0;
  let far = 1;
  for (const [origin, delta, min, max] of [
    [start.x, end.x - start.x, box.left - 3, box.right + 3],
    [start.y, end.y - start.y, box.top - 3, box.bottom + 3],
  ]) {
    if (Math.abs(delta) < .001) {
      if (origin < min || origin > max) return false;
      continue;
    }
    const a = (min - origin) / delta;
    const b = (max - origin) / delta;
    near = Math.max(near, Math.min(a, b));
    far = Math.min(far, Math.max(a, b));
    if (near > far) return false;
  }
  return true;
}

export function AgoraFlow() {
  const flowRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const markerId = `${id}-agora-arrow`;
  const [hovered, setHovered] = useState<Detail | null>(null);
  const [focused, setFocused] = useState<Detail | null>(null);
  const [pinned, setPinned] = useState<Detail | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const active = dismissed ? null : hovered ?? focused ?? pinned;

  useEffect(() => {
    const flow = flowRef.current;
    const svg = svgRef.current;
    if (!flow || !svg) return;
    const nodes = Array.from(flow.querySelectorAll<HTMLElement>("[data-agora-node]"));
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-agora-edge]"));
    let frame = 0;
    let disposed = false;

    function measure() {
      frame = 0;
      const area = svg!.getBoundingClientRect();
      if (!area.width || !area.height) return;
      const boxes = new Map<NodeName, Box>();
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        boxes.set(node.dataset.agoraNode as NodeName, {
          left: rect.left - area.left, right: rect.right - area.left,
          top: rect.top - area.top, bottom: rect.bottom - area.top,
          width: rect.width, height: rect.height,
        });
      }
      // Read all rectangles first; the SVG and nodes share the same moving group.
      // A group translation cancels out of these relative coordinates.
      svg!.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);
      connections.forEach(({ from, to }, index) => {
        const source = boxes.get(from)!;
        const target = boxes.get(to)!;
        const other = Array.from(boxes.entries()).filter(([name]) => name !== from && name !== to).map(([, box]) => box);
        const start = endpoint(source, { x: target.left + target.width / 2, y: target.top + target.height / 2 });
        const end = endpoint(target, { x: source.left + source.width / 2, y: source.top + source.height / 2 });
        const hidden = !source.width || !source.height || !target.width || !target.height || overlaps(source, target)
          || Math.hypot(end.x - start.x, end.y - start.y) < 10
          || other.some(box => overlaps(source, box) || overlaps(target, box) || crossesBox(start, end, box));
        const path = paths[index];
        path.setAttribute("visibility", hidden ? "hidden" : "visible");
        if (!hidden) path.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
      });
    }

    function schedule() {
      if (!disposed && !frame) frame = requestAnimationFrame(measure);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(flow);
    nodes.forEach(node => observer.observe(node));
    flow.addEventListener("tg-artifact-move", schedule);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      flow.removeEventListener("tg-artifact-move", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  function focus(detail: Detail) {
    setFocused(detail);
    setDismissed(false);
  }

  function blur(event: FocusEvent<HTMLElement>, detail: Detail) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(current => current === detail ? null : current);
    }
  }

  function pin(detail: Detail) {
    if (pinned === detail) {
      setPinned(null);
      setDismissed(true);
    } else {
      setPinned(detail);
      setDismissed(false);
    }
  }

  return (
    <div className="agora-flow-motion" data-scroll-depth="-24">
      <figure ref={flowRef} className="agora-flow" data-drag-frame data-drag-boundary aria-labelledby={`${id}-flow-label`} onKeyDown={event => {
        if (event.key !== "Escape") return;
        setPinned(null);
        setDismissed(true);
      }}>
        <ArtifactDrag label="Move the complete Agora flow" />
        <figcaption className="agora-flow__caption" id={`${id}-flow-label`}>
          <span>Illustrative product flow</span>
          <span className="agora-flow__caption-note">Criteria / context / review</span>
        </figcaption>
        <svg ref={svgRef} className="agora-flow__connections" aria-hidden="true" focusable="false">
          <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 6 3 L 0 6" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker></defs>
          {connections.map(({ from, to }) => <path key={`${from}-${to}`} className="agora-flow__connector" data-agora-edge={`${from}-${to}`} data-active={active !== null && (active === from || active === to)} markerEnd={`url(#${markerId})`} visibility="hidden" />)}
        </svg>
        <div className="agora-flow__grid">
          <section className="agora-flow__node agora-flow__node--requirement" data-drag-frame data-agora-node="requirement" aria-labelledby="agora-requirement">
            <p className="agora-flow__eyebrow">01 / Define</p>
            <h4 id="agora-requirement">Role criteria</h4>
            <p className="agora-flow__description">The search and its role criteria.</p>
            <ul><li>Search context</li><li>Role criteria</li></ul>
            <ArtifactDrag label="Move Role criteria node" />
          </section>
          <section className="agora-flow__node agora-flow__node--evidence" data-drag-frame data-agora-node="evidence" data-detail-active={active === "evidence"} aria-labelledby="agora-evidence" onPointerEnter={event => {
            if (event.pointerType === "mouse") { setHovered("evidence"); setDismissed(false); }
          }} onPointerLeave={() => setHovered(current => current === "evidence" ? null : current)} onFocusCapture={() => focus("evidence")} onBlurCapture={event => blur(event, "evidence")}>
            <p className="agora-flow__eyebrow">02 / Connect</p>
            <h4 id="agora-evidence">Evidence</h4>
            <p className="agora-flow__description">Jev / CV matching against each criterion.</p>
            <ul><li>Criterion-level evidence</li><li>Interview context</li></ul>
            <button className="agora-flow__inspect" type="button" aria-controls={`${id}-evidence-detail`} aria-expanded={active === "evidence"} aria-pressed={pinned === "evidence"} onClick={() => pin("evidence")}>Inspect evidence <span aria-hidden="true">+</span></button>
            <ArtifactDrag label="Move Evidence node" />
          </section>
          <section className="agora-flow__node agora-flow__node--review" data-drag-frame data-agora-node="review" data-detail-active={active === "review"} aria-labelledby="agora-review" onPointerEnter={event => {
            if (event.pointerType === "mouse") { setHovered("review"); setDismissed(false); }
          }} onPointerLeave={() => setHovered(current => current === "review" ? null : current)} onFocusCapture={() => focus("review")} onBlurCapture={event => blur(event, "review")}>
            <p className="agora-flow__eyebrow">03 / Review</p>
            <h4 id="agora-review">Recruiter review</h4>
            <p className="agora-flow__description">Candidate context in the backoffice.</p>
            <ul><li>Ranking + history</li><li>Talent pool</li></ul>
            <button className="agora-flow__inspect" type="button" aria-controls={`${id}-review-detail`} aria-expanded={active === "review"} aria-pressed={pinned === "review"} onClick={() => pin("review")}>Inspect review <span aria-hidden="true">+</span></button>
            <ArtifactDrag label="Move Recruiter review node" />
          </section>
          <section className="agora-flow__node agora-flow__node--voice" data-drag-frame data-agora-node="voice" aria-labelledby="agora-voice">
            <p className="agora-flow__eyebrow">AI agents / Candidate experience</p>
            <div className="agora-flow__voice-title"><h4 id="agora-voice">Voice interview</h4><span className="agora-flow__voice-mark" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
            <p className="agora-flow__description">Automated technical interviews with AI agents.</p>
            <ArtifactDrag label="Move Voice interview node" />
          </section>
        </div>
        <p className="agora-flow__note">Role criteria → Evidence → Recruiter review. Voice interview connects to Evidence.</p>
        <div className="agora-flow__details">
          <div className="agora-flow__detail agora-flow__detail--idle" data-visible={active === null} aria-hidden={active !== null} inert={active !== null}>
            <p className="agora-flow__detail-label">Inside the decision</p>
            <h5>What happens when requirements are missing?</h5>
            <p>Inspect Evidence or Recruiter review to follow the guardrail. Focus or hover to preview; tap to keep a note open. Escape closes it.</p>
            <p className="agora-flow__detail-limit">Illustrative explanation / no real CV, candidate record or live data.</p>
          </div>
          <div id={`${id}-evidence-detail`} className="agora-flow__detail" role="region" aria-labelledby={`${id}-evidence-title`} data-visible={active === "evidence"} aria-hidden={active !== "evidence"} inert={active !== "evidence"}>
            <p className="agora-flow__detail-label">Evidence / illustrative explanation</p>
            <h5 id={`${id}-evidence-title`}>Missing input cannot support a rejection.</h5>
            <p>With no structured skills in the search, the matcher has no requirements to compare. The guardrail routes that search to human review instead of treating missing context as a candidate score.</p>
            <p className="agora-flow__detail-limit">No structured skills → human review. This diagram explains the rule; it does not display a real CV or a live result.</p>
          </div>
          <div id={`${id}-review-detail`} className="agora-flow__detail" role="region" aria-labelledby={`${id}-review-title`} data-visible={active === "review"} aria-hidden={active !== "review"} inert={active !== "review"}>
            <p className="agora-flow__detail-label">Recruiter review / illustrative explanation</p>
            <h5 id={`${id}-review-title`}>Keep the reason for escalation visible.</h5>
            <p>A person reviews the missing requirements before a candidate decision proceeds. Extending the education catalog to English degree names addressed a separate recognition gap.</p>
            <p className="agora-flow__detail-limit">The bounded fix protects this missing-input state. It does not establish overall matching accuracy or fairness.</p>
          </div>
        </div>
      </figure>
    </div>
  );
}
