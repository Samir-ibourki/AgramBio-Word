import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ShoppingBag, ArrowLeft, Search } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function NotFound() {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.from(".error-code", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      filter: "blur(20px)",
    });

    tl.from(".error-content > *", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
    }, "-=0.8");

    // Floating animation for the background elements
    gsap.to(".float-element", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-[90vh] bg-[#FCFAFA] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="float-element absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="float-element absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center max-w-2xl w-full">
        <div className="error-code relative inline-block mb-8">
          <h1 className="text-[150px] md:text-[240px] font-serif font-black text-dark/5 leading-none select-none tracking-tighter">
            404
          </h1>
          
        </div>

        <div className="error-content space-y-6">
          <h2 className="text-4xl md:text-6xl font-serif text-dark leading-tight italic">
            {t("not_found.title") || "Oups! Page Perdue"}
          </h2>
          <p className="text-dark/40 max-w-md mx-auto leading-relaxed text-lg md:text-xl font-light">
            {t("not_found.description") || "La page que vous recherchez semble avoir disparu dans la nature. Ne vous inquiétez pas, nos trésors naturels sont toujours là."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link
              to="/"
              className="group flex items-center gap-3 bg-dark text-cream font-bold py-5 px-10 rounded-full hover:bg-gold hover:text-dark transition-all duration-500 shadow-xl shadow-dark/10 hover:shadow-gold/20 tracking-[0.2em] uppercase text-xs w-full sm:w-auto justify-center"
            >
              <Home size={18} className="transition-transform group-hover:scale-110" />
              {t("not_found.home") || "Accueil"}
            </Link>
            <Link
              to="/shop"
              className="group flex items-center gap-3 border-2 border-dark/10 text-dark font-bold py-5 px-10 rounded-full hover:border-gold hover:text-gold transition-all duration-500 tracking-[0.2em] uppercase text-xs w-full sm:w-auto justify-center bg-white/50 backdrop-blur-sm"
            >
              <ShoppingBag size={18} className="transition-transform group-hover:scale-110" />
              {t("not_found.shop") || "Boutique"}
            </Link>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-dark/30 hover:text-dark transition-colors text-xs font-bold tracking-widest uppercase mt-8 cursor-pointer"
          >
            <ArrowLeft size={14} /> {t("common.back") || "Retour"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
