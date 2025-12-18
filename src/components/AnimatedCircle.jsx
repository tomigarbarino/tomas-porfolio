// AnimatedCircle.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AnimatedCircle = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;

    // Animación de movimiento horizontal y rotación
    gsap.to(circle, {
      x: 300, // Ajusta según el diseño
      rotation: 360,
      scale: 1.5,
      ease: "power1.out",
      scrollTrigger: {
        trigger: circle,
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: false,
      },
    });

    // Animación de transformación (ejemplo: cambiar color)
    gsap.to(circle, {
      fill: "#FF6347", // Cambia a cualquier color o usa una animación más compleja
      duration: 1,
      scrollTrigger: {
        trigger: circle,
        start: "center center",
        end: "bottom center",
        scrub: true,
        markers: false,
      },
    });

    // Puedes agregar más animaciones aquí, como morphing con MorphSVG (requiere plugin)
  }, []);

  return (
    <svg
      ref={circleRef}
      width="100"
      height="100"
      className="fixed top-10 left-10 md:left-20 lg:left-40 will-change-transform z-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="40" fill="#C778DD" opacity="0.3" />
      {/* Puedes personalizar la forma aquí */}
    </svg>
  );
};

export default AnimatedCircle;
