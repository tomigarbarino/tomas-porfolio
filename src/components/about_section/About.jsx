import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";

gsap.registerPlugin(ScrollTrigger);

const AboutSec = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const aboutRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const geometricShapeRef = useRef(null); // Referencia para la forma geométrica

  // Manejar el tamaño de la pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Animaciones con GSAP utilizando una timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación flotante continua de la forma geométrica
      gsap.to(geometricShapeRef.current, {
        y: 20,
        rotation: 180,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Parallax en scroll
      gsap.to(geometricShapeRef.current, {
        x: isLargeScreen ? -100 : -50,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Animación del título
      gsap.from(titleRef.current, {
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación de la línea
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.5,
        delay: 0.3,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación del texto - más simple y suave
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación del botón
      gsap.from(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "back.out(1.5)",
        immediateRender: false,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Animación de la imagen
      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: -5,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        immediateRender: false,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, aboutRef);

    return () => ctx.revert();
  }, [isLargeScreen]);

  return (
    <div
      id="about"
      className="relative px-5 max-w-[1560px] mx-auto mt-20 py-10 overflow-hidden"
      ref={aboutRef}
    >
      {/* Forma Geométrica */}
      <svg
        ref={geometricShapeRef}
        width="100"
        height="100"
        className="absolute top-10 left-10 md:left-20 lg:left-40 will-change-transform"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" fill="#C778DD" opacity="0.3" />
        {/* Puedes personalizar la forma aquí */}
      </svg>

      <div className="flex flex-wrap items-center justify-between">
        {/* Sección Izquierda */}
        <div className="lg:w-1/2 w-full">
          <div className="mb-12">
            <div
              className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2"
              ref={titleRef}
            >
              <span className="text-[#C778DD]">#</span>{t.about.title}
            </div>
            <div className="line w-1/3 h-px bg-[#C778DD]" ref={lineRef}></div>
          </div>
          <div className="text-[#ABB2BF] mb-7 leading-relaxed" ref={textRef}>
            <p className="block mb-4 text-xl font-medium text-white">{t.about.greeting}</p>
            
            {t.about.description.map((paragraph, index) => (
              <p key={index} className="block mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          <a
            href="https://www.linkedin.com/in/tomas-garbarino/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block duration-150 hover:bg-[#C778DD33] border border-[#C778DD] px-6 py-3 text-white hover:scale-105 transition-all"
            ref={buttonRef}
          >
            {t.about.linkedinButton}
          </a>
        </div>
        {/* Sección Derecha */}
        <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
          <img
            className="mx-auto"
            src={require("./imgs/man.png")}
            alt="Man"
            ref={imageRef}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSec;
