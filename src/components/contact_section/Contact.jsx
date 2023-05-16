import "../contact_section/style.css";

const Contact = () => {
  return (
    <section id="contact" className="px-5 max-w-[1560px] mx-auto mt-20 py-10">
      <header className="mb-10">
        <h2 className="text-white font-medium text-[32px] flex items-center gap-2">
          <span className="text-[#C778DD]">#</span>contact
          <span className="line w-1/3 h-px bg-[#C778DD]"></span>
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-[#ABB2BF]">
            I’m interested in freelance opportunities. However, if you have
            other request or question, don’t hesitate to contact me
          </p>
        </div>
        <div className="mx-auto">
          <div className="border border-[#ABB2BF] p-4">
            <h3 className="mb-4 text-white font-semibold">Message me here</h3>
            <div>
              <div className="flex gap-1 items-center center-position">
                <img
                  src={require("./imgs/Linkedin.png")}
                  alt="LinkedIn icon"
                />
                <span className="text-[#ABB2BF]">
                  <a
                    href="https://www.linkedin.com/in/tomas-garbarino/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /tomas-garbarino/
                  </a>
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <img
                  src={require("./imgs/Email.png")}
                  alt="Email icon"
                />
                <span className="text-[#ABB2BF]" style={{wordBreak: 'break-word'}}> {/* Note the added style here */}
                  tomasgarbarino.dev@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;