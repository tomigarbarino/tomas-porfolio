import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProjectCard from "../project_card/ProjectCard";
import first from "./imgs/to-do-list-veterinaria.png";
import second from "./imgs/cifrador-cesar.png";
import third from "./imgs/Rectangle 22 (1).png";
import { useMemo } from "react";

const Projects = () => {
  // data
  const projects = [
    {
      img: first,
      langs: ["html", "css", "javascript", "react", "bootstrap", "vite"],
      title: "follow-up of veterinary patients",
      description: "veterinary patient follow-up, you can add/edit/delete patients",
      alt: "Veterinary patient follow-up project image",
      href: "https://turnos-react.netlify.app/"
    },
    {
      img: second,
      langs: ["html", "css", "javascript",],
      title: "cesar cipher",
      description: "Caesar encryption project: encryption tool based on character rotation, providing a basic level of information security.",
      alt: "Caesar cipher project image",
      href: "https://tomigarbarino.github.io/cifrador-cesar.github.io/"
    },
    {
      img: third,
      langs: ["html", "css", "javascript", "Node.js", "python"],
      title: "Kahoot Answers Viewer",
      description: "Get answers to your kahoot quiz ",
      alt: "Kahoot answers viewer project image",
      href: "https://example.com/project2"
    },
  ];

  const groupedProjects = useMemo(() => {
    const groups = [];
    for (let i = 0; i < projects.length; i += 3) {
      groups.push(projects.slice(i, i + 3));
    }
    return groups;
  }, [projects]);

  return (
    <div id="work" className="px-5 pb-10 max-w-[1560px] mx-auto mt-20 py-10">
      {/* top */}
      <div className="flex justify-between items-center gap-5 mb-5">
        {/* left */}
        <div className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2">
          <div>
            <span className="text-[#C778DD]">#</span>projects
          </div>
          <div className="line w-2/3 h-px bg-[#C778DD]"></div>
        </div>
      </div>
      {/* bottom */}
      <Carousel showStatus={false} showThumbs={false} showIndicators={false}>
        {/* cards */}
        {groupedProjects.map((group, index) => (
          <div key={index} className="flex justify-around">
            {group.map((project) => (
              <ProjectCard
                key={project.title}
                img={project.img}
                langs={project.langs}
                title={project.title}
                description={project.description}
                href={project.href}
              />
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Projects;

