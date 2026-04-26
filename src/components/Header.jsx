import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Globe, Menu, X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CartDrawer from "./CartDrawer";
import { NAV_LINKS, LANGUAGES } from "../constants/navigation";

function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  
  const isRTL = i18n.language === 'ar';
  
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLang(false);
    setIsOpen(false);
  };

  useGSAP(() => {
    if (showLang) {
      gsap.fromTo(".lang-dropdown", 
        { opacity: 0, y: 10, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, { dependencies: [showLang] });


  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(".mobile-nav-el", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }
  }, { dependencies: [isOpen] });

  const headerBg = !isHomePage || isScrolled
    ? "bg-white/95 backdrop-blur-md border-black/5 py-3 shadow-sm"
    : "bg-black/10 backdrop-blur-sm border-white/5 py-3";
  
  const textColor = !isHomePage || isScrolled ? "text-dark" : "text-cream";
  const textMutedColor = !isHomePage || isScrolled ? "text-dark/60" : "text-cream/80";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${headerBg}`}>
        <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 h-12 flex justify-between items-center">
          
          <Link to="/" className={`text-xl md:text-2xl font-serif font-bold tracking-tight italic shrink-0 transition-colors duration-500 ${textColor}`}>
            Agram<span className="text-gold not-italic ml-1">Souss</span>
          </Link>

          <nav className="hidden lg:flex gap-8">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.nameKey} 
                to={item.path} 
                className={`text-xs tracking-widest  transition-all duration-500 ${textMutedColor} hover:text-gold`}
              >
                {t(item.nameKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            
            <div className="relative hidden lg:block">
              <button 
                onClick={() => setShowLang(!showLang)}
                onMouseEnter={() => setShowLang(true)}
                className={`flex items-center gap-1 transition-colors duration-500 cursor-pointer text-xs font-bold ${textColor} hover:text-gold`}
              >
                <Globe size={18} />
                {i18n.language.toUpperCase()}
                <ChevronDown size={14} className={`transition-transform duration-300 ${showLang ? 'rotate-180' : ''}`} />
              </button>
              {showLang && (
                <div 
                  onMouseLeave={() => setShowLang(false)}
                  className={`lang-dropdown absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-4 w-32 bg-[#0d0900]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]`}
                >
                  <div className="p-2 flex flex-col gap-1">
                    {LANGUAGES.map((l) => (
                      <button 
                        key={l.code} 
                        onClick={() => changeLanguage(l.code)} 
                        className={`w-full px-4 py-2.5 text-left text-[11px] tracking-widest font-bold rounded-xl transition-all duration-300 ${i18n.language === l.code ? 'bg-gold text-black' : 'text-cream/70 hover:bg-white/5 hover:text-gold'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative transition-colors duration-500 cursor-pointer p-1 ${textColor} hover:text-gold`}
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {totalItems}
                </span>
              )}
            </button>


            
            <button 
              className={`lg:hidden cursor-pointer p-1 z-[110] transition-colors duration-500 ${textColor}`} 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 bg-[#0d0900] z-[90] flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <nav className="flex flex-col items-center mt-20 gap-8 mb-12">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.nameKey} 
              to={item.path} 
              className="mobile-nav-el text-cream hover:text-gold text-3xl font-serif" 
              onClick={() => setIsOpen(false)}
            >
              {t(item.nameKey)}
            </Link>
          ))}
        </nav>



        <div className="mobile-nav-el flex flex-col items-center gap-4 border-t border-white/10 pt-8 w-40">
          <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">Language</p>
          <div className="flex gap-6">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`text-lg cursor-pointer font-medium transition-all ${i18n.language === l.code ? 'text-gold' : 'text-cream/40'}`}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;