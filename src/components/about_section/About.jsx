const AboutSec = () => {
  return (
    <>
      <div id="about" className="px-5 max-w-[1560px] mx-auto mt-20 py-10">
        <div className="flex flex-wrap items-center justify-between">
          <div className="lg:w-1/2 w-full">
            <div className="mb-12">
              <div className="text-white w-2/3 font-medium text-[32px] flex items-center gap-2">
                <div className="">
                  <span className="text-[#C778DD]">#</span>about&#8209;me
                </div>
                <div className="line w-1/3 h-px bg-[#C778DD]"></div>
              </div>
            </div>
            <p className="text-[#ABB2BF] mb-7">
              Hello, i’m Tomas!
              <br />
              <br />
              I’m a self-taught front-end developer based in Buenos, Argentina. I
              can develop responsive websites from scratch and raise them into
              modern user-friendly web experiences.
              <br />
              <br />
              Transforming my creativity and knowledge into a websites has been
              my passion for more than two years. I always strive to learn about
              the newest technologies and frameworks.
            </p>
            <a
              href="https://www.linkedin.com/in/tomas-garbarino/"
              target="_blank"
              className="inline-block duration-150 hover:bg-[#C778DD33] border border-[#C778DD] px-4 py-2 text-white"
            >
              Read more -{">"}
            </a>
          </div>
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <img className="mx-auto" src={require("./imgs/man.png")} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutSec;
