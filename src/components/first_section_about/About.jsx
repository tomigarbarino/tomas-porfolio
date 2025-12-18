import React, { useState, useEffect } from "react";
import { Calendar, Mail, FileDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";
import "./about.css";

const About = () => {
  const [displayWord, setDisplayWord] = useState("");
  const { language } = useLanguage();
  const t = getTranslation(language);
  const wordList = t.hero.roles;

  const animateWord = async (word) => {
    // Typing animation
    for (let i = 0; i <= word.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setDisplayWord(word.slice(0, i));
          resolve();
        }, 50);
      });
    }
    
    // Pause before erasing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Erasing animation
    for (let i = word.length; i >= 0; i--) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setDisplayWord(word.slice(0, i));
          resolve();
        }, 30);
      });
    }
  };

  useEffect(() => {
    let index = 0;
    let isCancelled = false;

    const changeWord = async () => {
      while (!isCancelled) {
        await animateWord(wordList[index]);
        index = (index + 1) % wordList.length;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    changeWord();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="px-5 max-w-[1560px] mx-auto min-h-screen pt-20 flex flex-wrap items-center justify-center">
      <div className="w-full sm:w-1/2 mx-auto text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1E2D3D] border border-[#1E5128] px-4 py-2 rounded-full mb-4 animate-pulse">
          <div className="w-3 h-3 bg-[#4ADE80] rounded-full"></div>
          <span className="text-[#4ADE80] text-sm font-medium">{t.hero.availableBadge}</span>
        </div>
        
        <h1 className="font-semibold text-[32px] text-white mb-3">
          {t.hero.greeting}{" "}
          <span className="text-[#C778DD]">
            {displayWord}
          </span>
        </h1>
        <p className="text-[#ABB2BF] my-6">
          {t.hero.description}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://calendly.com/tomasgarbarino-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="duration-150 bg-[#C778DD] hover:bg-[#A660BB] px-6 py-3 text-white font-medium rounded hover:shadow-lg hover:shadow-[#C778DD]/50 transition-all"
          >
            <button className="flex items-center gap-2">
              <Calendar size={18} />
              {t.hero.scheduleCall}
            </button>
          </a>
          <a
            href="mailto:tomasgarbarino.dev@gmail.com"
            className="duration-150 hover:bg-[#C778DD33] border border-[#C778DD] px-6 py-3 text-white font-medium rounded transition-all"
          >
            <button className="flex items-center gap-2">
              <Mail size={18} />
              {t.hero.contactMe}
            </button>
          </a>
          <a
            href={language === 'en' 
              ? "https://docs.google.com/document/d/1O8TTMwwJ7HMYyiggzgNnsE7UYnp07prOoZN3aYbUTo4/edit?usp=sharing"
              : "https://docs.google.com/document/d/183C-sGCzNa1FeJ19xc3pYH9tusVPYSPL3mb8fWraG7A/edit?usp=sharing"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="duration-150 hover:bg-[#ABB2BF22] border border-[#ABB2BF] px-6 py-3 text-[#ABB2BF] hover:text-white font-medium rounded transition-all"
          >
            <button className="flex items-center gap-2">
              <FileDown size={18} />
              {t.hero.downloadCV}
            </button>
          </a>
        </div>
      </div>
      <div className="w-full sm:w-1/2 mx-auto text-center">
        <figure>
          <img src={require("./imgs/man.png")} alt="Tomas Garbarino" />
        </figure>
        <div className="border flex items-center gap-2 border-[#ABB2BF] p-2 text-[#ABB2BF] justify-center">
          <div className="w-4 h-4 bg-[#C778DD]"></div>
          <div className="">
            {t.hero.currentlyWorking} <span className="text-white">Batech</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About
