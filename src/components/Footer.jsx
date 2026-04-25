import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BOUTIQUE_INFO } from "../constants/config";
import { NAV_LINKS, LEGAL_LINKS, LANGUAGES } from "../constants/navigation";
import { SOCIAL_LINKS } from "../constants/socials";

function Footer() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <footer className="bg-white border-t border-black/5 pt-15 pb-5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top: Centered Logo */}
        <div className="flex justify-center mb-20 animate-fade-in">
          <Link to="/" className="group flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-serif font-black italic tracking-tighter text-dark text-center">
              Agram<span className="text-gold not-italic"> Souss</span>
            </span>
            <div className="w-8 h-[1px] bg-gold/30 mt-2 group-hover:w-16 transition-all duration-700" />
          </Link>
        </div>

        {/* 3-column Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-8 mb-10 max-w-5xl mx-auto px-4 md:px-0">
          
          {/* navigation */}
          <div className="flex flex-col">
            <h4 className="text-[17px] uppercase font-black text-dark tracking-[0.3em] mb-8 opacity-80 decoration-gold/30 underline underline-offset-8">{t('footer.navigation')}</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-[16px] text-dark/50 hover:text-gold transition-all duration-300 font-serif italic">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* legal */}
          <div className="flex flex-col">
            <h4 className="text-[17px] uppercase font-black text-dark tracking-[0.3em] mb-8 opacity-80 decoration-gold/30 underline underline-offset-8">{t('footer.legal')}</h4>
            <ul className="space-y-4">
              {LEGAL_LINKS.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-[16px] text-dark/50 hover:text-gold transition-all duration-300 font-serif italic">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="flex flex-col">
            <h4 className="text-[17px] uppercase font-black text-dark tracking-[0.3em] mb-8 opacity-80 decoration-gold/30 underline underline-offset-8">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="text-[17px] text-dark/50 font-serif italic lowercase hover:text-gold transition-colors">
                <a href={`mailto:${BOUTIQUE_INFO.email}`}>{BOUTIQUE_INFO.email}</a>
              </li>
              <li className="text-[16px] text-dark/50 font-serif italic">
                {t('footer.contact_form')}
              </li>
              <li className="text-[16px] text-dark/50 font-serif italic">
                {BOUTIQUE_INFO.phone}
              </li>
            </ul>
          </div>
        </div>

        {/* language switcher */}
        <div className="flex justify-center items-center gap-6 mb-6 border-t border-black/5 pt-12">
          {LANGUAGES.map((lang) => (
            <button 
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`text-[12px] tracking-[0.1em] transition-all duration-300 cursor-pointer ${
                i18n.language === lang.code ? 'font-black text-dark underline underline-offset-8' : 'text-dark/40 hover:text-gold'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* credits */}
        <div className="text-center mb-6">
          <p className="text-[11px] text-dark/40 font-medium tracking-wide">
            {t('footer.credit')} <a href="https://amafsoft.com" target="_blank" rel="noopener noreferrer" className="text-dark/60 hover:text-gold transition-colors font-bold uppercase tracking-tighter">Samir Ibourki</a>
          </p>
        </div>

        {/* social icons */}
        <div className="flex justify-center gap-10 mb-6">
          {SOCIAL_LINKS.map((social) => (
            <a 
              key={social.name} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark/40 hover:text-gold transition-all duration-500 scale-100 hover:scale-125"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* copyright */}
        <div className="text-center pt-4 border-t border-black/5">
          <p className="text-[10px] uppercase font-bold text-dark/20 tracking-[0.4em]">
            &copy; {new Date().getFullYear()} AgramSouss. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
