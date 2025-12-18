import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const Stats = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const statsRef = useRef<HTMLDivElement>(null);
  const statsItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  const stats: Stat[] = [
    { value: 4, suffix: "+", label: t.stats.yearsExperience, prefix: "" },
    { value: 40, suffix: "%", label: t.stats.userRetention + " ↑", prefix: "+" },
    { value: 30, suffix: "%", label: t.stats.performance + " ↑", prefix: "+" },
    { value: 15, suffix: "+", label: t.stats.projects, prefix: "" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      statsItemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.from(item, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 1,
            ease: "back.out(1.5)",
            immediateRender: false,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 75%",
              onEnter: () => {
                // Animar contador
                const target = stats[index].value;
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                    current = target;
                    clearInterval(timer);
                  }
                  setCounters((prev) => {
                    const newCounters = [...prev];
                    newCounters[index] = Math.floor(current);
                    return newCounters;
                  });
                }, 30);
              },
              toggleActions: "play none none reverse",
            },
            delay: index * 0.1,
          });
        }
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="px-5 max-w-[1560px] mx-auto mt-12 mb-12"
      ref={statsRef}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-6 border-2 border-[#C778DD] rounded-lg bg-[#011627]/50 hover:bg-[#C778DD]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C778DD]/30"
            ref={(el) => { statsItemsRef.current[index] = el }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#C778DD] mb-2">
              {stat.prefix}{counters[index]}{stat.suffix}
            </div>
            <div className="text-[#ABB2BF] text-sm md:text-base font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
