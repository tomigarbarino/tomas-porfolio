import "./style.css";
import LinkedinIcon from "./imgs/Linkedin.png";
import EmailIcon from "./imgs/Email.png";

interface ContactInfo {
  type: 'linkedin' | 'email';
  icon: string;
  label: string;
  href: string;
  iconAlt: string;
}

const contactInfo: ContactInfo[] = [
  {
    type: 'linkedin',
    icon: LinkedinIcon,
    label: '/tomas-garbarino/',
    href: 'https://www.linkedin.com/in/tomas-garbarino/',
    iconAlt: 'LinkedIn icon'
  },
  {
    type: 'email',
    icon: EmailIcon,
    label: 'tomasgarbarino.dev@gmail.com',
    href: 'mailto:tomasgarbarino.dev@gmail.com',
    iconAlt: 'Email icon'
  }
];

const Contact = () => {
  return (
    <section id="contact" className="px-5 max-w-[1560px] mx-auto mt-20 py-10 relative z-10">
      <header className="mb-10">
        <h2 className="text-white font-medium text-[32px] flex items-center gap-2">
          <span className="text-[#C778DD]">#</span>contact
          <span className="line w-1/3 h-px bg-[#C778DD]"></span>
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-[#ABB2BF]">
            I'm interested in freelance opportunities. However, if you have
            other requests or questions, don't hesitate to contact me
          </p>
        </div>
        <div className="mx-auto">
          <div className="border border-[#ABB2BF] p-4">
            <h3 className="mb-4 text-white font-semibold">Message me here</h3>
            <div className="space-y-2">
              {contactInfo.map((contact) => (
                <div key={contact.type} className="flex gap-1 items-center">
                  <img
                    src={contact.icon}
                    alt={contact.iconAlt}
                    className="w-5 h-5"
                  />
                  <span className="text-[#ABB2BF]" style={{ wordBreak: 'break-word' }}>
                    <a
                      href={contact.href}
                      target={contact.type === 'linkedin' ? '_blank' : undefined}
                      rel={contact.type === 'linkedin' ? 'noopener noreferrer' : undefined}
                      className="hover:text-[#C778DD] transition-colors"
                    >
                      {contact.label}
                    </a>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
