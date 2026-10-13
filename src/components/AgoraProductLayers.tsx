"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { useMotionPreference } from "./MotionPreference";
import "./agora-product-layers.css";

const layers = [
  { id: "experience", name: "Experience", title: "Both sides of the workflow.", body: "Candidate preparation and interview entry. Recruiter searches, ranking and history.", contribution: "I shape the candidate UX/UI and connect it to the recruiter workflow.", stack: "Next.js · Supabase" },
  { id: "workflow", name: "AI workflow", title: "Evidence and interviews.", body: "CV evidence meets role criteria. Technical interviews add context to the candidate’s history.", contribution: "I participate in architecture decisions and implement AI features directly.", stack: "Python · OpenAI" },
  { id: "decision", name: "Product decision", title: "Context before confidence.", body: "A search without structured skills goes to human review. Missing inputs cannot support a confident rejection.", contribution: "I helped define the bounded guardrail while the structural input fix stayed on the roadmap.", stack: "Missing criteria → human review" },
] as const;

type Layer = typeof layers[number]["id"];
const isLayer = (value: string | undefined): value is Layer => layers.some(layer => layer.id === value);
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export function AgoraProductLayers() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<Layer | null>(null);
  const pinnedRef = useRef<Layer | null>(null);
  const [active, setActive] = useState<Layer | null>(null);
  const { paused } = useMotionPreference();
  const id = useId();

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let hovered: Layer | null = null;
    let focused: Layer | null = null;
    let pinned = pinnedRef.current;
    let keyboard = false;
    let held = false;
    let hoverBlocked = false;
    let lastPointer: { x: number; y: number } | null = null;
    const pointers = new Set<number>();
    const moveKeys = new Set<string>();
    let visible = false;
    let measure = true;
    let progress = 0;
    let raf = 0;
    let lastTime = 0;
    const value = (property: string, fallback: number) => {
      const previous = parseFloat(scene.style.getPropertyValue(property));
      return Number.isFinite(previous) ? previous : fallback;
    };
    const current = { open: value("--agl-open", .55), x: value("--agl-tilt-x", 0), y: value("--agl-tilt-y", 0) };
    const target = { ...current };
    const lifts: Record<Layer, number> = { experience: value("--agl-lift-experience", 0), workflow: value("--agl-lift-workflow", 0), decision: value("--agl-lift-decision", 0) };

    function write() {
      scene!.style.setProperty("--agl-open", current.open.toFixed(4));
      scene!.style.setProperty("--agl-tilt-x", `${current.x.toFixed(3)}deg`);
      scene!.style.setProperty("--agl-tilt-y", `${current.y.toFixed(3)}deg`);
      layers.forEach(layer => scene!.style.setProperty(`--agl-lift-${layer.id}`, `${lifts[layer.id].toFixed(3)}px`));
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
      scene!.dataset.moving = "false";
    }
    function frame(time: number) {
      raf = 0;
      if (held || !visible || document.hidden) { stop(); return; }
      if (measure) {
        const box = scene!.getBoundingClientRect();
        progress = clamp((window.innerHeight * .88 - box.top) / (window.innerHeight * .7));
        measure = false;
      }
      target.open = .55 + progress * .45 + (selectedRef.current ? .1 : 0);
      const alpha = 1 - Math.exp(-Math.min(lastTime ? time - lastTime : 16, 64) / 145);
      lastTime = time;
      current.open += (target.open - current.open) * alpha;
      current.x += (target.x - current.x) * alpha;
      current.y += (target.y - current.y) * alpha;
      let liftsSettled = true;
      layers.forEach(layer => {
        const lift = selectedRef.current === layer.id ? 42 : 0;
        lifts[layer.id] += (lift - lifts[layer.id]) * alpha;
        if (Math.abs(lift - lifts[layer.id]) < .04) lifts[layer.id] = lift;
        else liftsSettled = false;
      });
      const settled = liftsSettled && Math.abs(target.open - current.open) < .001 && Math.abs(target.x - current.x) < .015 && Math.abs(target.y - current.y) < .015;
      if (settled) Object.assign(current, target);
      write();
      scene!.dataset.moving = String(!settled);
      if (settled) lastTime = 0;
      else raf = requestAnimationFrame(frame);
    }
    function schedule() {
      if (paused) {
        stop();
        Object.assign(current, { open: 1, x: 0, y: 0 });
        layers.forEach(layer => { lifts[layer.id] = 0; });
        write();
        return;
      }
      if (!held && visible && !document.hidden && !raf) raf = requestAnimationFrame(frame);
    }
    function select() {
      const next = focused ?? hovered ?? pinned;
      selectedRef.current = next;
      setActive(previous => previous === next ? previous : next);
      schedule();
    }
    function choice(target: EventTarget | null) {
      const element = target instanceof Element ? target.closest<HTMLElement>("[data-layer-choice]") : null;
      const value = element && root!.contains(element) ? element.dataset.layerChoice : undefined;
      return isLayer(value) ? value : null;
    }
    function over(event: PointerEvent) {
      if (held || hoverBlocked || !fine.matches || event.pointerType !== "mouse" || event.buttons) return;
      hovered = choice(event.target);
      select();
    }
    function move(event: PointerEvent) {
      if (held || !fine.matches || event.pointerType !== "mouse" || event.buttons || event.altKey || window.getSelection()?.toString()) return;
      if (hoverBlocked) return;
      const next = choice(event.target);
      if (next !== hovered) { hovered = next; select(); }
      if (paused) return;
      if (!scene!.contains(event.target as Node)) return;
      const box = scene!.getBoundingClientRect();
      target.x = -clamp((event.clientY - box.top) / box.height * 2 - 1, -1, 1) * 2.5;
      target.y = clamp((event.clientX - box.left) / box.width * 2 - 1, -1, 1) * 3.5;
      schedule();
    }
    function trackPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const changed = !lastPointer || lastPointer.x !== event.clientX || lastPointer.y !== event.clientY;
      lastPointer = { x: event.clientX, y: event.clientY };
      // Relative movement can be zero for absolute-pointer input. Client
      // coordinates also distinguish real movement from scroll-generated over.
      if (changed && !held && !event.buttons) hoverBlocked = false;
    }
    function leave() {
      hovered = null;
      target.x = target.y = 0;
      select();
    }
    function hold() {
      held = true;
      scene!.dataset.gesture = "held";
      stop();
    }
    function down(event: PointerEvent) {
      keyboard = false;
      pointers.add(event.pointerId);
      hold();
    }
    function release() {
      held = pointers.size > 0 || moveKeys.size > 0;
      scene!.dataset.gesture = held ? "held" : "idle";
      measure = true;
      schedule();
    }
    function pointerUp(event: PointerEvent) { pointers.delete(event.pointerId); release(); }
    function focus(event: FocusEvent) {
      focused = keyboard ? choice(event.target) : null;
      select();
    }
    function focusOut(event: FocusEvent) {
      if (moveKeys.size) { moveKeys.clear(); release(); }
      if (root!.contains(event.relatedTarget as Node | null)) return;
      focused = null;
      select();
    }
    function click(event: MouseEvent) {
      const layer = choice(event.target);
      if (!layer || event.defaultPrevented) return;
      pinned = pinned === layer ? null : layer;
      pinnedRef.current = pinned;
      select();
    }
    function clearPreview() {
      hovered = focused = pinned = null;
      pinnedRef.current = null;
      target.x = target.y = 0;
      select();
    }
    function scroll() {
      // A real scroll always hands the narrative back to the reading position.
      // It never steals focus, resets drag offsets or intercepts wheel/touch.
      measure = true;
      hoverBlocked = true;
      clearPreview();
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Tab") keyboard = true;
      if (/^(Arrow(Left|Right|Up|Down)|Home|Escape)$/.test(event.key) && event.target instanceof Element && event.target.closest(".artifact-drag,.window-drag")) {
        moveKeys.add(event.key);
        hold();
      }
      if (event.key === "Escape" && root!.contains(document.activeElement)) clearPreview();
    }
    function keyUp(event: KeyboardEvent) { if (moveKeys.delete(event.key)) release(); }
    function resize() { measure = true; schedule(); }
    function blur() { pointers.clear(); moveKeys.clear(); release(); clearPreview(); stop(); }
    function visibility() {
      if (document.hidden) blur();
      else { measure = true; schedule(); }
    }

    const box = scene.getBoundingClientRect();
    visible = box.bottom > 0 && box.top < window.innerHeight;
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      measure = true;
      if (visible) schedule();
      else stop();
    });
    observer.observe(scene);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(scene);
    schedule();
    root.addEventListener("pointerover", over, { passive: true });
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave, { passive: true });
    root.addEventListener("focusin", focus);
    root.addEventListener("focusout", focusOut);
    root.addEventListener("click", click);
    document.addEventListener("pointerdown", down, { passive: true, capture: true });
    document.addEventListener("pointermove", trackPointer, { passive: true, capture: true });
    document.addEventListener("pointerup", pointerUp, { passive: true, capture: true });
    document.addEventListener("pointercancel", pointerUp, { passive: true, capture: true });
    document.addEventListener("keydown", key, true);
    document.addEventListener("keyup", keyUp, true);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("blur", blur);
    fine.addEventListener("change", leave);
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", focusOut);
      root.removeEventListener("click", click);
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", trackPointer, true);
      document.removeEventListener("pointerup", pointerUp, true);
      document.removeEventListener("pointercancel", pointerUp, true);
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("keyup", keyUp, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", blur);
      fine.removeEventListener("change", leave);
    };
  }, [paused]);

  return <div className="agl" ref={rootRef} data-active-layer={active ?? "none"} data-paused={paused}>
    <div className="agl-window" data-drag-frame>
      <ArtifactDrag label="Move the layered Agora product window" />
      <div className="agl-titlebar"><span>AGORA / UNDER THE INTERFACE</span><span aria-hidden="true">▤</span></div>
      <div className="agl-scene" ref={sceneRef} role="group" aria-label="Explore the three Agora product layers" data-gesture="idle">
        <svg className="agl-connectors" viewBox="0 0 400 440" preserveAspectRatio="none" aria-hidden="true"><path d="M26 86V348M26 86H64M26 218H64M26 348H64" /><circle cx="26" cy="86" r="5" /><circle cx="26" cy="218" r="5" /><circle cx="26" cy="348" r="5" /></svg>
        {layers.map((layer, index) => <button key={layer.id} type="button" className={`agl-layer agl-layer--${layer.id}`} data-layer-choice={layer.id} data-drag-enabled aria-pressed={active === layer.id} aria-describedby={`${id}-${layer.id}`}>
          <span className="agl-layer-bar"><span>0{index + 1} / {layer.name}</span><span aria-hidden="true">↗</span></span>
          {layer.id === "experience" ? <span className="agl-interface">
            {/* Actual candidate interface rendered locally with fictional demo data. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/agora/agora-c1-candidato-ingreso.png" alt="Agora candidate entry in a local demo of the actual app with fictional data" width="1440" height="900" loading="lazy" decoding="async" draggable={false} />
            <strong>Candidate ↔ Recruiter</strong>
          </span> : layer.id === "workflow" ? <span className="agl-diagram"><span>Criteria</span><b aria-hidden="true">→</b><span>CV evidence</span><b aria-hidden="true">+</b><span>Interview</span></span> : <span className="agl-rule"><span>Missing criteria</span><b aria-hidden="true">→</b><strong>Human review</strong></span>}
        </button>)}
      </div>
    </div>
    <div className="agl-notes">
      {layers.map((layer, index) => <article key={layer.id} className={`agl-note agl-note--${layer.id}`} id={`${id}-${layer.id}`} data-drag-frame>
        <ArtifactDrag label={`Move the Agora ${layer.name.toLowerCase()} explanation`} />
        <h3><button type="button" className="agl-note-choice" data-layer-choice={layer.id} data-drag-enabled aria-pressed={active === layer.id}><span>0{index + 1} / {layer.name}</span><strong>{layer.title}</strong></button></h3>
        <p>{layer.body}</p><p className="agl-contribution">{layer.contribution}</p><p className="agl-stack">{layer.stack}</p>
      </article>)}
      <p className="agl-infrastructure"><span>Supporting the application + agents</span>AWS Amplify · Railway</p>
    </div>
  </div>;
}
