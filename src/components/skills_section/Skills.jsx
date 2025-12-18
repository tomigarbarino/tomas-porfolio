import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Blocks, Palette, Wrench } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const skillsConfig = [
    { Icon: Code2, key: "languages" },
    { Icon: Blocks, key: "frameworks" },
    { Icon: Palette, key: "styling" },
    { Icon: Wrench, key: "tools" }
  ];

  const skills = skillsConfig.map(({ Icon, key }) => ({
    title: t.skills.categories[key],
    Icon,
    languages: t.skills.list[key]
  }));

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const skillsRef = useRef(null);
  const skillItemsRef = useRef([]);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const imagesRef = useRef([]);
  const geometricShapeRef = useRef(null); // Referencia para la forma geométrica

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del título con efecto más dinámico
      gsap.from(titleRef.current, {
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power3.out",
        immediateRender: false,
      });

      // Animación de la línea con efecto de expansión
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.5,
        delay: 0.3,
        ease: "power3.out",
        immediateRender: false,
      });

      // Animación de los elementos de skills con efecto más suave
      gsap.from(skillItemsRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        stagger: 0.15,
        duration: 1,
        ease: "back.out(1.2)",
        immediateRender: false,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación de las imágenes con rotación
      gsap.from(imagesRef.current, {
        opacity: 0,
        scale: 0.7,
        rotation: -10,
        duration: 1.5,
        stagger: 0.4,
        ease: "elastic.out(1, 0.5)",
        immediateRender: false,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación de la forma geométrica con movimiento flotante
      gsap.to(geometricShapeRef.current, {
        y: 30,
        rotation: 360,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Animación parallax en scroll
      gsap.to(geometricShapeRef.current, {
        x: () => window.innerWidth > 768 ? 150 : 50,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, skillsRef);

    return () => ctx.revert();
  }, [isLargeScreen]);

  return (
    <div
      id="skills"
      className="relative px-5 max-w-[1560px] mx-auto mt-20 py-10 overflow-hidden"
      ref={skillsRef}
    >
      {/* Forma Geométrica */}
      <svg
        ref={geometricShapeRef}
        width="100"
        height="100"
        className="absolute top-10 right-10 md:right-20 lg:right-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" fill="#C778DD" opacity="0.3" />
        {/* Puedes personalizar la forma aquí */}
      </svg>

      {/* Top */}
      <div className="mb-10 flex items-center">
        <div
          className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2"
          ref={titleRef}
        >
          <span className="text-[#C778DD]">#</span>{t.skills.title}
        </div>
        <div
          className="line w-1/3 h-px bg-[#C778DD]"
          ref={lineRef}
        ></div>
      </div>
      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center text-white">
        {/* Izquierda */}
        <div className="w-full mx-auto">
          <img
            className="w-full mx-auto"
            src={require("./imgs/shapes.png")}
            alt="Shapes"
            ref={(el) => imagesRef.current[0] = el}
          />
        </div>
        {/* Centro y mapeo */}
        <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {skills.map(({ title, Icon, languages }, skillIndex) => (
            <div
              key={`skill-${skillIndex}`}
              className="w-full border border-[#ABB2BF] mb-4 p-2 bg-transparent hover:border-[#C778DD] hover:shadow-lg hover:shadow-[#C778DD]/20 transition-all duration-300"
              ref={(el) => { skillItemsRef.current[skillIndex] = el }}
            >
              <h2 className="font-semibold flex items-center gap-2">
                <Icon size={20} className="text-[#C778DD]" />
                {title}
              </h2>
              <div className="flex gap-3 border-t border-[#ABB2BF] flex-wrap p-2 text-[#ABB2BF]">
                {languages.map((lang, langIndex) => (
                  <span 
                    key={`lang-${skillIndex}-${langIndex}`}
                    className="hover:text-[#C778DD] transition-colors duration-200 cursor-default"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Imagen derecha en pantalla grande */}
        {isLargeScreen && (
          <div className="w-full mx-auto">
            <img
              className="w-full mx-auto"
              src={require("./imgs/shapes.png")}
              alt="Shapes"
              ref={(el) => imagesRef.current[1] = el}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
