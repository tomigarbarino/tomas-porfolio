import { useState } from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations";
import { cn } from "../../lib/utils/cn";
import Logo from "./imgs/Logo.png";
import CloseIcon from "./imgs/close.png";

interface NavLink {
  href: string;
  label: string;
  id: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language);

  const navLinks: NavLink[] = [
    { href: "#", label: t.navbar.home, id: "home" },
    { href: "#skills", label: t.navbar.skills, id: "skills" },
    { href: "#experience", label: t.navbar.experience, id: "experience" },
    { href: "#interactive-terminal", label: t.navbar.terminal, id: "terminal" },
    { href: "#about-me", label: t.navbar.about, id: "about" },
    { href: "#contact", label: t.navbar.contact, id: "contact" }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#282C33] z-10">
      <div className="px-5 max-w-[1560px] mx-auto flex items-center justify-between pt-6 my-2">
        {/* Logo */}
        <div className="left flex gap-2 items-center font-bold text-white text-base">
          <div className="img">
            <img src={Logo} alt="Tomas Garbarino Logo" />
          </div>
          Tomas Garbarino
        </div>

        {/* Navigation */}
        <div className="right flex items-center">
          <nav 
            className={cn(
              "menu duration-300 flex-col justify-center md:flex-row flex fixed w-full bg-[#282C33] md:static",
              isMenuOpen ? "right-0 top-0 bottom-0" : "right-[-100%] top-0 bottom-0"
            )}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={link.href} 
                onClick={handleLinkClick}
                className="text-[#ABB2BF] text-[32px] my-4 md:my-auto md:text-base list-none mx-4 hover:text-white transition-colors"
              >
                <span className="text-[#C778DD] font-medium">#</span>
                {link.label}
              </a>
            ))}            
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-[#ABB2BF] flex items-center gap-2 text-[32px] my-4 md:my-auto md:text-base mx-4 hover:text-white transition-colors"
              aria-label="Change language"
              title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            >
              <Languages size={18} className="text-[#C778DD]" />
              <span className="uppercase font-medium">{language}</span>
            </button>

            {/* Close button (mobile) */}
            <button
              onClick={handleMenuToggle}
              className="close absolute block md:hidden right-3 top-3"
              aria-label="Close menu"
            >
              <img src={CloseIcon} alt="" />
            </button>
          </nav>

          {/* Menu toggle button (mobile) */}
          <button
            onClick={handleMenuToggle}
            className="block md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="open w-8">
              <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
              <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
              <div className="w-full h-[1px] my-2 rounded-r-3xl bg-[#D9D9D9]"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
