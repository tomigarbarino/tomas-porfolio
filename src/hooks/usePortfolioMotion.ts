import { useEffect, useLayoutEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const usePortfolioMotion = (scopeRef: RefObject<HTMLElement | null>) => {
  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope) return;

    const media = gsap.matchMedia();

    media.add(
      {
        motionAllowed: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 981px)",
      },
      (context) => {
        const { motionAllowed, desktop } = context.conditions as {
          motionAllowed: boolean;
          desktop: boolean;
        };

        if (!motionAllowed) return;

        const cleanups: Array<() => void> = [];

        const marqueeLeft = gsap.to('[data-marquee="left"]', {
          xPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: ".motion-marquee",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        const marqueeRight = gsap.fromTo(
          '[data-marquee="right"]',
          { xPercent: -12 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: ".motion-marquee",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        intro
          .from("[data-hero-reveal]", {
            autoAlpha: 0,
            y: 22,
            duration: 0.72,
            stagger: 0.08,
          })
          .from(
            "[data-hero-line]",
            {
              autoAlpha: 0,
              yPercent: 110,
              duration: 0.92,
              stagger: 0.1,
            },
            0.12,
          )
          .from(
            ".proof-console",
            {
              autoAlpha: 0,
              y: 34,
              scale: 0.975,
              duration: 0.9,
            },
            0.32,
          )
          .from(
            "[data-signal-core]",
            {
              autoAlpha: 0,
              scale: 0.54,
              rotation: -42,
              duration: 1.2,
            },
            0.18,
          )
          .from(
            "[data-field-line]",
            {
              autoAlpha: 0,
              xPercent: -8,
              duration: 1.15,
              stagger: 0.06,
            },
            0.06,
          )
          .from(
            ".proof-console .window-topbar, .proof-console .system-label-row",
            {
              autoAlpha: 0,
              y: 10,
              duration: 0.45,
              stagger: 0.08,
            },
            0.72,
          )
          .from(
            ".proof-console .flow-node",
            {
              autoAlpha: 0,
              x: 18,
              duration: 0.48,
              stagger: 0.12,
            },
            0.84,
          )
          .from(
            ".proof-console .flow-line",
            {
              scaleY: 0,
              transformOrigin: "top center",
              duration: 0.3,
              stagger: 0.12,
            },
            0.98,
          )
          .from(
            ".proof-console .console-footnote",
            { autoAlpha: 0, duration: 0.4 },
            1.28,
          )
          .from(
            "[data-system-satellite]",
            {
              autoAlpha: 0,
              scale: 0.82,
              duration: 0.55,
              stagger: 0.1,
            },
            0.96,
          );

        gsap.to("[data-system-path]", {
          strokeDashoffset: -120,
          duration: 12,
          ease: "none",
          repeat: -1,
        });

        gsap.to("[data-field-line]", {
          strokeDashoffset: -180,
          duration: 18,
          ease: "none",
          repeat: -1,
        });

        gsap.to(".system-glow-one", {
          x: 18,
          y: -14,
          duration: 5.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(".system-glow-two", {
          x: -14,
          y: 18,
          duration: 6.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(".hero-copy", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(".hero-system", {
          xPercent: 11,
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(".hero-field-lines", {
          xPercent: -5,
          scaleX: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to("[data-signal-core]", {
          scale: 1.18,
          rotation: 38,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        const trainlyStory = gsap.timeline({
          scrollTrigger: {
            trigger: ".trainly-featured",
            start: "top 82%",
            end: "bottom 26%",
            scrub: 1,
          },
        });

        trainlyStory
          .fromTo(
            '[data-trainly-layer="primary"]',
            { y: 42, rotation: -1.4, scale: 0.96 },
            { y: -8, rotation: 0, scale: 1, ease: "none" },
            0,
          )
          .fromTo(
            '[data-trainly-layer="secondary"]',
            { x: 34, y: 34, rotation: -5 },
            { x: -5, y: -15, rotation: -1.5, ease: "none" },
            0,
          )
          .fromTo(
            '[data-trainly-layer="tertiary"]',
            { x: -28, y: 42, rotation: 5 },
            { x: 6, y: -4, rotation: 1.4, ease: "none" },
            0,
          )
          .fromTo(
            "[data-featured-wordmark]",
            { xPercent: -8, autoAlpha: 0.25 },
            { xPercent: 7, autoAlpha: 0.72, ease: "none" },
            0,
          );

        if (desktop) {
          scope.classList.add("enhanced-motion");

          let pointerFrame = 0;
          const handleGlobalPointer = (event: PointerEvent) => {
            window.cancelAnimationFrame(pointerFrame);
            pointerFrame = window.requestAnimationFrame(() => {
              scope.style.setProperty("--pointer-x", `${event.clientX}px`);
              scope.style.setProperty("--pointer-y", `${event.clientY}px`);
            });
          };

          scope.addEventListener("pointermove", handleGlobalPointer);
          cleanups.push(() => {
            window.cancelAnimationFrame(pointerFrame);
            scope.removeEventListener("pointermove", handleGlobalPointer);
            scope.style.removeProperty("--pointer-x");
            scope.style.removeProperty("--pointer-y");
          });

          const reel = scope.querySelector<HTMLElement>("[data-horizontal-reel]");
          const track = scope.querySelector<HTMLElement>("[data-horizontal-track]");
          const progress = scope.querySelector<HTMLElement>("[data-reel-progress]");
          const orb = scope.querySelector<HTMLElement>(".reel-orb");
          const current = scope.querySelector<HTMLElement>("[data-reel-current]");
          const previous = scope.querySelector<HTMLButtonElement>("[data-reel-prev]");
          const next = scope.querySelector<HTMLButtonElement>("[data-reel-next]");

          if (reel && track && progress && orb) {
            const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-project-panel]"));
            let activeIndex = 0;
            const getDistance = () => Math.max(0, track.scrollWidth - reel.clientWidth + 120);
            const setActiveIndex = (index: number) => {
              activeIndex = Math.max(0, Math.min(panels.length - 1, index));
              if (current) current.textContent = String(activeIndex + 1).padStart(2, "0");
            };

            const reelTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: reel,
                start: "top top+=78",
                end: () => `+=${getDistance()}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  setActiveIndex(Math.round(self.progress * Math.max(0, panels.length - 1)));
                },
              },
            });

            reelTimeline
              .to(track, { x: () => -getDistance(), ease: "none" }, 0)
              .to(progress, { scaleX: 1, ease: "none" }, 0)
              .to(
                orb,
                {
                  x: () => window.innerWidth + 220,
                  y: 150,
                  rotation: 300,
                  ease: "none",
                },
                0,
              );

            panels.forEach((panel) => {
              gsap.fromTo(
                panel,
                { scale: 0.9, opacity: 0.4 },
                {
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: reelTimeline,
                    start: "left 88%",
                    end: "center 58%",
                    scrub: true,
                  },
                },
              );
            });

            const goToPanel = (index: number) => {
              const trigger = reelTimeline.scrollTrigger;
              if (!trigger || panels.length < 2) return;

              const safeIndex = Math.max(0, Math.min(panels.length - 1, index));
              const progressToPanel = safeIndex / (panels.length - 1);
              const top = trigger.start + (trigger.end - trigger.start) * progressToPanel;
              window.scrollTo({ top, behavior: "smooth" });
            };

            const handlePrevious = () => goToPanel(activeIndex - 1);
            const handleNext = () => goToPanel(activeIndex + 1);

            previous?.addEventListener("click", handlePrevious);
            next?.addEventListener("click", handleNext);
            setActiveIndex(0);

            cleanups.push(() => {
              previous?.removeEventListener("click", handlePrevious);
              next?.removeEventListener("click", handleNext);
            });
          }

          const stage = scope.querySelector<HTMLElement>(".hero-system");
          const consoleWindow = scope.querySelector<HTMLElement>(".proof-console");
          const signalCore = scope.querySelector<HTMLElement>("[data-signal-core]");

          if (stage && consoleWindow) {
            gsap.set(consoleWindow, {
              transformPerspective: 1000,
              transformOrigin: "center center",
            });

            const rotateX = gsap.quickTo(consoleWindow, "rotateX", {
              duration: 0.75,
              ease: "power3.out",
            });
            const rotateY = gsap.quickTo(consoleWindow, "rotateY", {
              duration: 0.75,
              ease: "power3.out",
            });
            const satellites = Array.from(
              stage.querySelectorAll<HTMLElement>("[data-system-satellite]"),
            );
            const satelliteX = satellites.map((satellite) =>
              gsap.quickTo(satellite, "x", { duration: 0.9, ease: "power3.out" }),
            );
            const satelliteY = satellites.map((satellite) =>
              gsap.quickTo(satellite, "y", { duration: 0.9, ease: "power3.out" }),
            );
            const coreX = signalCore
              ? gsap.quickTo(signalCore, "x", { duration: 1.05, ease: "power3.out" })
              : null;
            const coreY = signalCore
              ? gsap.quickTo(signalCore, "y", { duration: 1.05, ease: "power3.out" })
              : null;

            const handlePointerMove = (event: PointerEvent) => {
              const bounds = stage.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;

              rotateX(1 - y * 5);
              rotateY(-4 + x * 7);
              satelliteX.forEach((move, index) => move(x * (12 + index * 6)));
              satelliteY.forEach((move, index) => move(y * (10 + index * 5)));
              coreX?.(-x * 18);
              coreY?.(-y * 15);
            };

            const resetTilt = () => {
              rotateX(1);
              rotateY(-4);
              satelliteX.forEach((move) => move(0));
              satelliteY.forEach((move) => move(0));
              coreX?.(0);
              coreY?.(0);
            };

            stage.addEventListener("pointermove", handlePointerMove);
            stage.addEventListener("pointerleave", resetTilt);

            cleanups.push(() => {
              stage.removeEventListener("pointermove", handlePointerMove);
              stage.removeEventListener("pointerleave", resetTilt);
            });
          }

          cleanups.push(() => scope.classList.remove("enhanced-motion"));
        }

        cleanups.push(() => {
          marqueeLeft.kill();
          marqueeRight.kill();
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      },
      scope,
    );

    const navLinks = Array.from(
      scope.querySelectorAll<HTMLAnchorElement>("[data-section-link]"),
    );

    const setActiveSection = (sectionId: string) => {
      navLinks.forEach((link) => {
        const isActive = link.dataset.sectionLink === sectionId;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const sectionTriggers = ["work", "about", "experience"].flatMap((sectionId) => {
      const section = scope.querySelector<HTMLElement>(`#${sectionId}`);

      if (!section) return [];

      return [
        ScrollTrigger.create({
          trigger: section,
          start: "top 48%",
          end: "bottom 48%",
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        }),
      ];
    });

    return () => {
      sectionTriggers.forEach((trigger) => trigger.kill());
      media.revert();
    };
  }, [scopeRef]);
};
