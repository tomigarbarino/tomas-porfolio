import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const usePortfolioMotion = (scopeRef: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
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
          );

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

        if (desktop) {
          scope.classList.add("enhanced-motion");

          const reel = scope.querySelector<HTMLElement>("[data-horizontal-reel]");
          const track = scope.querySelector<HTMLElement>("[data-horizontal-track]");
          const progress = scope.querySelector<HTMLElement>("[data-reel-progress]");
          const orb = scope.querySelector<HTMLElement>(".reel-orb");

          if (reel && track && progress && orb) {
            const getDistance = () => Math.max(0, track.scrollWidth - reel.clientWidth + 120);

            const reelTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: reel,
                start: "top top+=78",
                end: () => `+=${getDistance()}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
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

            gsap.utils.toArray<HTMLElement>("[data-project-panel]").forEach((panel) => {
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
          }

          const stage = scope.querySelector<HTMLElement>(".hero-system");
          const consoleWindow = scope.querySelector<HTMLElement>(".proof-console");

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

            const handlePointerMove = (event: PointerEvent) => {
              const bounds = stage.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;

              rotateX(1 - y * 5);
              rotateY(-4 + x * 7);
            };

            const resetTilt = () => {
              rotateX(1);
              rotateY(-4);
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
