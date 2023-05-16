import { useState } from "react";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-[#282C33] z-10"> {/* Note the added z-index here */}
        <div className=" px-5 max-w-[1560px] mx-auto flex items-center justify-between pt-6 my-2">
          <div className="left flex gap-2 items-center font-bold text-white text-base">
            {/* logo */}
            <div className="img">
              <img src={require("./imgs/Logo.png")} alt="Tomas Garbarino Logo" />
            </div>
            Tomas Garbarino
          </div>
          <div className="right flex items-center">
            <div className={`menu duration-300 flex-col justify-center md:flex-row flex fixed w-full ${!toggle ? `right-[-100%] top-0 bottom-0` : `right-0 top-0 bottom-0`} bg-[#282C33] md:static`}>
              <a href="#" onClick={handleClick}>
                <li className="text-[#ABB2BF] text-[32px] my-4 md:my-auto md:text-base list-none mx-4">
                  <span className="text-[#C778DD] font-medium">#</span>home
                </li>
              </a>
              <a href="#work" onClick={handleClick}>
                <li className="text-[#ABB2BF] text-[32px] my-4 md:my-auto md:text-base list-none mx-4">
                  <span className="text-[#C778DD] font-medium">#</span>work
                </li>
              </a>
              <a href="#about" onClick={handleClick}>
                <li className="text-[#ABB2BF] text-[32px] my-4 md:my-auto md:text-base list-none mx-4">
                  <span className="text-[#C778DD] font-medium">#</span>about-me
                </li>
              </a>
              <a href="#contact" onClick={handleClick}>
                <li className="text-[#ABB2BF] text-[32px] my-4 md:my-auto md:text-base list-none mx-4">
                  <span className="text-[#C778DD] font-medium">#</span>contact
                </li>
              </a>
              <div onClick={handleClick} className="close absolute block md:hidden right-3 top-3">
                <img src={require("./imgs/close.png")} alt="Close menu" />
              </div>
            </div>
            {/* CLOSE&OPEN btns */}
            <div onClick={handleClick} className="">
              <div className="open block md:hidden w-8">
                <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
                <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
                <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
