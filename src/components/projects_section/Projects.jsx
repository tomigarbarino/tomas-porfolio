// src/components/projects_section/Projects.jsx

import React, { useRef, useEffect } from "react";
import Console from "react-console-emulator";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const consoleRef = useRef(null);
  const projectsRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const consoleWrapperRef = useRef(null);
  
  const { language } = useLanguage();
  const t = getTranslation(language);

  const commands = {
    help: {
      description: t.terminal.commands.help,
      fn: () => t.terminal.commands.help,
    },
    hire: {
      description: "Why hire me",
      fn: () => t.terminal.commands.hire,
    },
    skills: {
      description: "View technical skills",
      fn: () => t.terminal.commands.skills,
    },
    projects: {
      description: "List featured projects",
      fn: () => t.terminal.commands.projects,
    },
    experience: {
      description: "Show work experience",
      fn: () => t.terminal.commands.experience,
    },
    contact: {
      description: "Get contact information",
      fn: () => t.terminal.commands.contact,
    },
    linkedin: {
      description: "Open LinkedIn profile",
      fn: () => {
        window.open("https://www.linkedin.com/in/tomas-garbarino/", "_blank");
        return t.terminal.commands.linkedin;
      },
    },
    github: {
      description: "Open GitHub profile",
      fn: () => {
        window.open("https://github.com/tomasgarbarino", "_blank");
        return t.terminal.commands.github;
      },
    },
    clear: {
      description: "Clear console",
      fn: () => {
        if (consoleRef.current) {
          consoleRef.current.clearStdout();
        }
        return "";
      },
    },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.5,
        delay: 0.3,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(consoleWrapperRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1.5,
        ease: "back.out(1.2)",
        immediateRender: false,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, projectsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="interactive-terminal" className="px-5 pb-10 max-w-[1560px] mx-auto mt-20 py-10" ref={projectsRef}>
      <div className="flex items-center mb-6">
        <div
          className="text-white font-medium text-[32px] flex items-center gap-2"
          ref={titleRef}
        >
          <span className="text-[#C778DD]">#</span>{t.terminal.title}
          <div className="line flex-1 h-px bg-[#C778DD] ml-4" ref={lineRef}></div>
        </div>
      </div>

      <p className="text-[#ABB2BF] text-center mb-8">
        {t.terminal.subtitle}
      </p>

      <div
        className="console-wrapper border-2 border-[#C778DD] rounded-lg shadow-xl shadow-[#C778DD]/20 hover:shadow-2xl hover:shadow-[#C778DD]/30 transition-shadow duration-300 overflow-hidden"
        ref={consoleWrapperRef}
      >
        <Console
          ref={consoleRef}
          commands={commands}
          noDefaults={true}
          welcomeMessage={`
╔══════════════════════════════════════════════╗
║   Tomas Garbarino - Portfolio Terminal      ║
║   Frontend Engineer | React + TypeScript    ║
╚══════════════════════════════════════════════╝

${t.terminal.subtitle}
          `}
          promptLabel="tomas@portfolio:~$"
          style={{
            backgroundColor: "#011627",
            minHeight: "400px",
            maxHeight: "600px",
            overflow: "auto",
          }}
          styleEchoBack="userInput"
          contentStyle={{
            color: "#ABB2BF",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "14px",
            padding: "20px",
          }}
          promptLabelStyle={{
            color: "#C778DD",
            fontWeight: "bold",
          }}
          inputTextStyle={{
            color: "#ABB2BF",
          }}
        />
      </div>
    </div>
  );
};

export default Projects;
