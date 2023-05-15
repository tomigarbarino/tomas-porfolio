const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* line */}
      <div className="w-full h-px bg-[#ABB2BF] mt-20 mb-8"></div>
      {/* footer */}
      <div className="px-5 max-w-[1560px] mx-auto">
        {/* top */}
        <div className="flex justify-between gap-y-10 flex-wrap">
          {/* left */}
          <div className="mx-auto md:mx-0">
            <div className=" flex items-center gap-8 mb-3 ">
              {/* logo */}
              <div className=" flex gap-2 items-center text-2xl text-white font-bold">
                <img src={require("./imgs/Logo.png")} alt="logo" />
                <span>Tomas Garbarino</span>
              </div>
            </div>
            {/* disc */}
            <div className="text-[#ffffff]">
              <p>Web designer and front-end developer based in Argentina</p>
            </div>
          </div>
          {/* right */}
          <div className=" mx-auto md:mx-0">
            {/* title */}
            <h2 className=" text-white text-2xl font-medium mb-3">Media</h2>
            {/* media */}
            <div className="flex items-center gap-2">
              <a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">
                <img src={require("./imgs/Linkedin.png")} alt="LinkedIn" />
              </a>
              <a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">
                <img src={require("./imgs/Github.png")} alt="GitHub" />
              </a>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="text-center text-[#ABB2BF] pb-8 mt-12">
          © Copyright {currentYear}. Made by Tomas Garbarino
        </div>
      </div>
    </>
  );
};

export default Footer;
