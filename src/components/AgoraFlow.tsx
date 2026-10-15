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
  const hoverExit = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The nodes, connecting space and detail share one hover region, so a reader
  // can move to the explanation at their own pace without pinning it first.
  const active = dismissed ? null : hovered ?? focused ?? pinned;

  function cancelHoverExit() {
    if (hoverExit.current !== null) clearTimeout(hoverExit.current);
    hoverExit.current = null;
  }

  function inspect(detail: Detail) {
    cancelHoverExit();
    setHovered(detail);
    setDismissed(false);
  }

  useEffect(() => () => {
    if (hoverExit.current !== null) clearTimeout(hoverExit.current);
  }, []);

  useEffect(() => {
    if (active === null) return;
    function dismissDetail(event: globalThis.KeyboardEvent) {
      // Hover content must also dismiss while focus remains outside the figure.
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (hoverExit.current !== null) clearTimeout(hoverExit.current);
      hoverExit.current = null;
      setHovered(null);
      setPinned(null);
      setDismissed(true);
    }
    window.addEventListener("keydown", dismissDetail);
    return () => window.removeEventListener("keydown", dismissDetail);
  }, [active]);

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
    cancelHoverExit();
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
      <figure ref={flowRef} className="agora-flow" data-drag-frame data-drag-boundary aria-label="Illustrative Agora product flow" onPointerEnter={cancelHoverExit} onPointerLeave={event => {
        if (event.pointerType !== "mouse") return;
        cancelHoverExit();
        hoverExit.current = setTimeout(() => {
          hoverExit.current = null;
          setHovered(null);
        }, 300);
      }} onKeyDown={event => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        cancelHoverExit();
        setHovered(null);
        setPinned(null);
        setDismissed(true);
      }}>
        <ArtifactDrag label="Move the complete Agora flow" />
        <svg ref={svgRef} className="agora-flow__connections" aria-hidden="true" focusable="false">
          <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 6 3 L 0 6" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker></defs>
          {connections.map(({ from, to }) => <path key={`${from}-${to}`} className="agora-flow__connector" data-agora-edge={`${from}-${to}`} data-active={active !== null && (active === from || active === to)} markerEnd={`url(#${markerId})`} visibility="hidden" />)}
        </svg>
        <div className="agora-flow__grid">
          <section className="agora-flow__node agora-flow__node--requirement" data-drag-frame data-agora-node="requirement" aria-labelledby="agora-requirement">
            <p className="agora-flow__eyebrow">01 / Define</p>
            <h3 id="agora-requirement">Role criteria</h3>
            <p className="agora-flow__description">The search and its role criteria.</p>
            <ul><li>Search context</li><li>Role criteria</li></ul>
            <ArtifactDrag label="Move Role criteria node" />
          </section>
          <section className="agora-flow__node agora-flow__node--evidence" data-drag-frame data-agora-node="evidence" data-detail-active={active === "evidence"} aria-labelledby="agora-evidence" onPointerEnter={event => {
            if (event.pointerType === "mouse") inspect("evidence");
          }} onFocusCapture={() => focus("evidence")} onBlurCapture={event => blur(event, "evidence")}>
            <p className="agora-flow__eyebrow">02 / Connect</p>
            <h3 id="agora-evidence">Evidence</h3>
            <p className="agora-flow__description">Jev / CV matching against each criterion.</p>
            <ul><li>Criterion-level evidence</li><li>Interview context</li></ul>
            <button className="agora-flow__inspect" type="button" aria-controls={`${id}-evidence-detail`} aria-expanded={active === "evidence"} aria-pressed={pinned === "evidence"} onClick={() => pin("evidence")}>Inspect evidence <span aria-hidden="true">+</span></button>
            <ArtifactDrag label="Move Evidence node" />
          </section>
          <section className="agora-flow__node agora-flow__node--review" data-drag-frame data-agora-node="review" data-detail-active={active === "review"} aria-labelledby="agora-review" onPointerEnter={event => {
            if (event.pointerType === "mouse") inspect("review");
          }} onFocusCapture={() => focus("review")} onBlurCapture={event => blur(event, "review")}>
            <p className="agora-flow__eyebrow">03 / Review</p>
            <h3 id="agora-review">Recruiter review</h3>
            <p className="agora-flow__description">Candidate context in the backoffice.</p>
            <ul><li>Ranking + history</li><li>Talent pool</li></ul>
            <button className="agora-flow__inspect" type="button" aria-controls={`${id}-review-detail`} aria-expanded={active === "review"} aria-pressed={pinned === "review"} onClick={() => pin("review")}>Inspect review <span aria-hidden="true">+</span></button>
            <ArtifactDrag label="Move Recruiter review node" />
          </section>
          <section className="agora-flow__node agora-flow__node--voice" data-drag-frame data-agora-node="voice" aria-labelledby="agora-voice">
            <p className="agora-flow__eyebrow">AI agents / Candidate experience</p>
            <div className="agora-flow__voice-title"><h3 id="agora-voice">Voice interview</h3><span className="agora-flow__voice-mark" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
            <p className="agora-flow__description">Automated technical interviews with AI agents.</p>
            <ArtifactDrag label="Move Voice interview node" />
          </section>
        </div>
        <div className="agora-flow__details">
          <div className="agora-flow__detail agora-flow__detail--idle" data-visible={active === null} aria-hidden={active !== null} inert={active !== null}>
            <p className="agora-flow__detail-label">Inside the decision</p>
            <h4>What happens when requirements are missing?</h4>
            <p>Follow the guardrail from missing criteria to a human decision.</p>
          </div>
          <div id={`${id}-evidence-detail`} className="agora-flow__detail" role="region" aria-labelledby={`${id}-evidence-title`} data-visible={active === "evidence"} aria-hidden={active !== "evidence"} inert={active !== "evidence"}>
            <p className="agora-flow__detail-label">Evidence</p>
            <h4 id={`${id}-evidence-title`}>Missing input cannot support a rejection.</h4>
            <p>With no structured skills in the search, the matcher has no requirements to compare. The guardrail routes that search to human review instead of treating missing context as a candidate score.</p>
          </div>
          <div id={`${id}-review-detail`} className="agora-flow__detail" role="region" aria-labelledby={`${id}-review-title`} data-visible={active === "review"} aria-hidden={active !== "review"} inert={active !== "review"}>
            <p className="agora-flow__detail-label">Recruiter review</p>
            <h4 id={`${id}-review-title`}>Keep the reason for escalation visible.</h4>
            <p>A person reviews the missing requirements before a candidate decision proceeds. Extending the education catalog to English degree names addressed a separate recognition gap.</p>
          </div>
        </div>
      </figure>
    </div>
  );
}
