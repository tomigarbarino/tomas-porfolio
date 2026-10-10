"use client";

import { useEffect } from "react";
import { useMotionPreference } from "./MotionPreference";
import "./scroll-motion.css";

type Layer = {
  node: HTMLElement;
  depth: number;
  current: number;
  target: number;
  visible: boolean;
  parents: Layer[];
};

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export function ScrollMotion() {
  const { paused, reducedMotion } = useMotionPreference();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main");
    if (!main) return;
    main.dataset.scrollMotion = reducedMotion ? "reduced" : paused ? "paused" : "playing";
    main.dataset.scrollRunning = "false";
    if (paused || reducedMotion) return;

    // Only group wrappers move here. Descendant frames retain their own drag offsets.
    const layers: Layer[] = Array.from(main.querySelectorAll<HTMLElement>("[data-scroll-depth]:not([data-drag-frame])"), node => {
      const current = parseFloat(node.style.getPropertyValue("--scroll-y")) || 0;
      return { node, current, target: current, depth: clamp(Number(node.dataset.scrollDepth) || 0, 96), visible: true, parents: [] };
    });
    for (const layer of layers) layer.parents = layers.filter(parent => parent !== layer && parent.node.contains(layer.node));

    let field = parseFloat(main.style.getPropertyValue("--scroll-field-y")) || 0;
    let fieldTarget = field;
    let frame = 0;
    let previous = 0;
    let dirty = true;
    let heldPointer: number | null = null;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      main!.dataset.scrollRunning = "false";
    }

    function measure() {
      const height = window.innerHeight;
      const mobile = window.innerWidth < 800 ? .45 : 1;
      // Read every box before writing transforms. Subtract our complete ancestor
      // chain so the previous frame cannot feed back into its own scroll target.
      for (const layer of layers) {
        if (!layer.visible) continue;
        const rect = layer.node.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const offset = layer.current + layer.parents.reduce((sum, parent) => sum + parent.current, 0);
        const center = rect.top - offset + rect.height / 2;
        const progress = clamp((height / 2 - center) / Math.max(1, (height + rect.height) / 2), 1);
        layer.target = progress * layer.depth * mobile;
      }
      fieldTarget = Math.sin(window.scrollY / Math.max(1, height * 1.75)) * 16 * mobile;
      dirty = false;
    }

    function follow(now: number) {
      frame = 0;
      if (document.hidden || heldPointer !== null) { stop(); return; }
      if (dirty) measure();
      const elapsed = previous ? Math.min(40, now - previous) : 16;
      previous = now;
      const amount = 1 - Math.exp(-elapsed / 150);
      let moving = false;
      for (const layer of layers) {
        if (!layer.visible) continue;
        const distance = layer.target - layer.current;
        if (Math.abs(distance) > .025) moving = true;
        layer.current = Math.abs(distance) <= .025 ? layer.target : layer.current + distance * amount;
        layer.node.style.setProperty("--scroll-y", `${layer.current.toFixed(3)}px`);
      }
      const distance = fieldTarget - field;
      if (Math.abs(distance) > .025) moving = true;
      field = Math.abs(distance) <= .025 ? fieldTarget : field + distance * amount;
      main!.style.setProperty("--scroll-field-y", `${field.toFixed(3)}px`);
      if (moving) frame = requestAnimationFrame(follow);
      else stop();
    }

    function schedule() {
      dirty = true;
      if (frame || document.hidden || heldPointer !== null) return;
      main!.dataset.scrollRunning = "true";
      frame = requestAnimationFrame(follow);
    }

    const lookup = new Map(layers.map(layer => [layer.node, layer]));
    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const layer = lookup.get(entry.target as HTMLElement);
        if (layer) layer.visible = entry.isIntersecting;
      }
      schedule();
    }, { rootMargin: "200px" });
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    for (const layer of layers) {
      visibility.observe(layer.node);
      resize.observe(layer.node);
    }

    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
      if (!event.target.closest("[data-scroll-depth], [data-drag-frame], .project-window")) return;
      heldPointer = event.pointerId;
      stop();
    }
    function release(event: PointerEvent) {
      if (heldPointer !== event.pointerId) return;
      heldPointer = null;
      schedule();
    }
    function blur() { heldPointer = null; stop(); }
    function documentVisibility() {
      heldPointer = null;
      if (document.hidden) stop();
      else schedule();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", schedule);
    document.addEventListener("visibilitychange", documentVisibility);
    schedule();
    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", schedule);
      document.removeEventListener("visibilitychange", documentVisibility);
    };
  }, [paused, reducedMotion]);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main");
    return () => {
      main?.querySelectorAll<HTMLElement>("[data-scroll-depth]").forEach(node => node.style.removeProperty("--scroll-y"));
      main?.style.removeProperty("--scroll-field-y");
      if (main) { delete main.dataset.scrollMotion; delete main.dataset.scrollRunning; }
    };
  }, []);

  return null;
}
