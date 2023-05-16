import { useEffect, useState } from "react";

const Skills = () => {
  const skills = [
    {
      title: "Languages",
      languages: ["TypeScript", "JavaScript"],
    },
    { title: "Databases", languages: ["PostgreSQL", "Mongo"] },
    {
      title: "Frameworks",
      languages: ["React", "Express", "Axios"],
    },
    {
      title: "Other",
      languages: ["HTML", "CSS", "Bootstrap", "Sass", "Less", "Tailwind"],
    },
  ];

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <div id="skills" className="px-5 max-w-[1560px] mx-auto mt-20 py-10">
        {/* top */}
        <div className="mb-10">
          <div className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2">
            <div className="">
              <span className="text-[#C778DD]">#</span>skills
            </div>
            <div className="line w-1/3 h-px bg-[#C778DD]"></div>
          </div>
        </div>
        {/* bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center text-white">
          {/* left */}
          <div className="w-full mx-auto">
            <img className="w-full mx-auto" src={require("./imgs/shapes.png")} alt="" />
          </div>
          {/* center & mapping */}
          <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {skills.map(({ title, languages }, skillIndex) => {
              return (
                <div key={`skill-${skillIndex}`} className="w-full border border-[#ABB2BF] mb-4">
                  <div className="p-2">
                    <h2 className="font-semibold">{title}</h2>
                  </div>
                  <div className="flex gap-2 border-t border-[#ABB2BF] flex-wrap p-2 text-[#ABB2BF]">
                    {languages.map((e, langIndex) => {
                      return <span key={`lang-${skillIndex}-${langIndex}`}>{e}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* right image on large screen */}
          {isLargeScreen && (
            <div className="w-full mx-auto">
              <img className="w-full mx-auto" src={require("./imgs/shapes.png")} alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Skills;