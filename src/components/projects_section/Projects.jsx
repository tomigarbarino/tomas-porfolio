import ProjectCard from "../project_card/ProjectCard";
import first from "./imgs/Rectangle 22.jpg";
import second from "./imgs/Rectangle 22.png";
import third from "./imgs/Rectangle 22 (1).png";

const Projects = () => {
  // data
  const projects = [
    {
      img: first,
      langs: ["html", "css", "javascript", "react", "tailwind css"],
      title: "ChertNodes",
      description: "Minecraft servers hosting ",
    },
    {
      img: second,
      langs: ["html", "css", "javascript", "Node.js"],
      title: "ProtectX",
      description: "Discord anti-crash bot ",
    },
    {
      img: third,
      langs: ["html", "css", "javascript", "Node.js", "python"],
      title: "Kahoot Answers Viewer",
      description: "Get answers to your kahoot quiz ",
    },
  ];

  return (
    <div id="work" className="px-5 max-w-[1560px] mx-auto mt-20 py-10">
      {/* top */}
      <div className="flex justify-between items-center gap-5">
        {/* left */}
        <div className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2">
          <div>
            <span className="text-[#C778DD]">#</span>projects
          </div>
          <div className="line w-2/3 h-px bg-[#C778DD]"></div>
        </div>
        {/* right */}
        {/* <div className="text-white font-medium">
          <a href="">
            <span>View all ~~&gt;</span>
          </a>
        </div> */}
      </div>
      {/* bottom */}
      <div className="flex flex-wrap justify-between gap-4 my-12">
        {/* cards */}
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            img={project.img}
            langs={project.langs}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
