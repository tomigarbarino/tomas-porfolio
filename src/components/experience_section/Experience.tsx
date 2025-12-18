import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  achievements: string[];
  current?: boolean;
}

const Experience = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const experiences: ExperienceItem[] = t.experience.jobs;

  const experienceRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.out",
      });

      // Line animation
      gsap.from(lineRef.current, {
        width: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });

      // Items animation
      gsap.from(itemsRef.current, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      });
    }, experienceRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="experience"
      className="px-5 max-w-[1560px] mx-auto mt-20 py-10"
      ref={experienceRef}
    >
      {/* Header */}
      <div className="mb-10 flex items-center">
        <div
          className="text-white font-medium text-[32px] flex items-center gap-2"
          ref={titleRef}
        >
          <span className="text-[#C778DD]">#</span>{t.experience.title}
          <div className="line flex-1 h-px bg-[#C778DD] ml-4" ref={lineRef}></div>
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="border border-[#ABB2BF] p-6 bg-transparent hover:border-[#C778DD] transition-colors duration-300"
            ref={(el) => { itemsRef.current[index] = el }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-semibold">
                  {exp.role}
                  {exp.current && (
                    <span className="ml-3 text-sm text-[#C778DD] border border-[#C778DD] px-2 py-1">
                      {t.experience.current}
                    </span>
                  )}
                </h3>
                <p className="text-[#C778DD] font-medium mt-1">{exp.company}</p>
              </div>
              <p className="text-[#ABB2BF] text-sm mt-2 md:mt-0">{exp.period}</p>
            </div>

            {/* Achievements */}
            <ul className="space-y-2">
              {exp.achievements.map((achievement, achIndex) => (
                <li
                  key={achIndex}
                  className="text-[#ABB2BF] flex items-start gap-2"
                >
                  <span className="text-[#C778DD] mt-1">▹</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
