const ProjectCard = ({ img, langs, title, description,href }) => {
  return (
    <div className="border mx-auto w-[90%] md:w-[48%] lg:w-[30%] border-[#ABB2BF] p-0">
      {/* img */}
      <div>
        <img className="w-full" src={img} alt={title} />
      </div>
      {/* skills */}
      <div className="flex gap-2 flex-wrap p-2 border-y border-[#ABB2BF]">
        {langs.map((lang, index) => (
          <span key={index} className="text-[#ABB2BF]">
            {lang}
          </span>
        ))}
      </div>
      {/* description */}
      <div className="p-4">
        <h2 className="text-[#FFFFFF] text-2xl font-medium">{title}</h2>
        <p className="py-4 text-[#ABB2BF]">{description}</p>
        {/* btns */}
        <div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="py-2 px-4 text-white border border-[#C778DD] hover:bg-[#C778DD33] duration-150 inline-block">
          Live {"<"}~{">"}
        </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
