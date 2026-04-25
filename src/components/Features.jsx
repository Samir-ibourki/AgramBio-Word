import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES_DATA } from "../constants/features";

gsap.registerPlugin(ScrollTrigger);

function Features() {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".feature-item", {
      scrollTrigger: { trigger: ".feature-item", start: "top 85%" },
      y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-white border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {FEATURES_DATA.map((feature, index) => (
            <div 
              key={index} 
              className="feature-item group flex flex-col items-center text-center space-y-4 transition-transform duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-gold border border-black/5 group-hover:bg-gold group-hover:text-dark transition-all duration-500 shadow-sm">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-dark font-serif text-lg font-bold lowercase italic">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-dark/40 text-[10px] uppercase tracking-widest font-bold leading-relaxed max-w-[200px] mx-auto">
                  {t(feature.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
