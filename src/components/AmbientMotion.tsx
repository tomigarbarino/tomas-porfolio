"use client";

import { useEffect } from "react";
import { useMotionPreference } from "./MotionPreference";

export function AmbientMotion() {
  const { paused, reducedMotion } = useMotionPreference();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main");
    const field = document.querySelector<HTMLElement>(".portfolio-backdrop");
    if (!main || !field) return;
    let visible = false;
    // One play gate keeps every ambient layer on the same phase, including
    // the Contact mark while its section is outside the viewport.
    const update = () => {
      const active = String(visible && !document.hidden);
      main.dataset.ambientActive = active;
      field.dataset.ambientActive = active;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: "80px" });
    observer.observe(field);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      delete main.dataset.ambientActive;
      delete field.dataset.ambientActive;
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main");
    const hero = document.querySelector<HTMLElement>("#top");
    if (!main || !hero) return;
    let frame: number | null = null;
    const update = () => {
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight * .85)));
      main.style.setProperty("--ascii-presence", String(.72 - .52 * progress));
      frame = null;
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      main.style.removeProperty("--ascii-presence");
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const main = document.querySelector<HTMLElement>("#main");
    if (!main) return;
    const scene = main.querySelector<HTMLElement>(".observatory-stage");
    const finePointer = window.matchMedia("(pointer: fine)");
    const current = {
      x: (parseFloat(main.style.getPropertyValue("--ambient-x")) || 0) / 10,
      y: (parseFloat(main.style.getPropertyValue("--ambient-y")) || 0) / 6,
    };
    let target = { ...current };
    let frame = 0;
    let previous = 0;

    function follow(now: number) {
      const elapsed = previous ? Math.min(40, now - previous) : 16;
      previous = now;
      const amount = 1 - Math.exp(-elapsed / 150);
      current.x += (target.x - current.x) * amount;
      current.y += (target.y - current.y) * amount;
      const settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) < .001;
      if (settled) Object.assign(current, target);
      main!.style.setProperty("--ambient-x", `${current.x * 10}px`);
      main!.style.setProperty("--ambient-y", `${current.y * 6}px`);
      if (scene) {
        const rect = scene.getBoundingClientRect();
        scene.style.setProperty("--scene-x", `${current.x * 14}px`);
        scene.style.setProperty("--scene-y", `${current.y * 10}px`);
        scene.style.setProperty("--pointer-x", `${(current.x + .5) * window.innerWidth - rect.left}px`);
        scene.style.setProperty("--pointer-y", `${(current.y + .5) * window.innerHeight - rect.top}px`);
      }
      frame = settled ? 0 : requestAnimationFrame(follow);
      if (settled) previous = 0;
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(follow);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      if ((event.target as HTMLElement).closest("[data-artifact-dragging='true'],.is-dragging")) return;
      target = { x: event.clientX / window.innerWidth - .5, y: event.clientY / window.innerHeight - .5 };
      if (scene) scene.dataset.exploring = String(scene.contains(event.target as Node));
      schedule();
    }
    function leave() {
      target = { x: 0, y: 0 };
      if (scene) scene.dataset.exploring = "false";
      schedule();
    }
    function visibility() {
      if (!document.hidden) return;
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    }
    main.addEventListener("pointermove", move, { passive: true });
    main.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      if (scene) scene.dataset.exploring = "false";
      main.removeEventListener("pointermove", move);
      main.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reducedMotion]);

  return null;
}
