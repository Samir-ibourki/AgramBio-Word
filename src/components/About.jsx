import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import znin from "../assets/znin.jpg";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(containerRef);
    gsap.from(q(".hero-text"), { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" });
    gsap.utils.toArray(q(".about-section")).forEach((section) => {
      gsap.from(section, { scrollTrigger: { trigger: section, start: "top 90%" }, y: 60, opacity: 0, duration: 1, ease: "power3.out" });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-accent overflow-hidden">
      
      {/* hero section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-primary text-white py-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        <div className="max-w-4xl mx-auto px-6 text-center hero-text relative z-10">
          <span className="inline-block px-4 py-1 rounded-full border border-gold/30 text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8">{t('about.badge')}</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">{t('about.title')}</h1>
          <p className="text-lg md:text-xl text-cream/70 font-light leading-relaxed max-w-2xl mx-auto">
            {t('about.intro')}
          </p>
        </div>
      </section>

      {/* story section */}
      <section className="py-24 about-section">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-gold text-[10px] uppercase font-black tracking-[0.3em]">{t('about.story_tag')}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">{t('about.story_title')}</h2>
            </div>
            <p className="text-dark/60 leading-relaxed font-light">
              {t('about.story_p1')}
              <br/><br/>
              {t('about.story_p2')}
            </p>
            <div className="pt-4">
               <div className="bg-primary/5 border-l-4 border-gold p-6 italic text-dark/70 font-serif">
                "{t('about.story_quote')}"
               </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold/10 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0 duration-700" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-black/5 shadow-2xl">
              <img src={znin} alt="Our Team" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute top-8 left-8 bg-primary text-cream px-6 py-3 rounded-2xl text-xl font-serif italic shadow-xl">{t('about.natural_badge')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="py-24 about-section">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
                <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src={znin} alt="Production" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="order-1 lg:order-2 space-y-10">
                <div className="space-y-4">
                    <span className="text-gold text-[10px] uppercase font-black tracking-[0.3em]">{t('about.why_tag')}</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">{t('about.why_title')}</h2>
                </div>
                <ul className="space-y-6">
                    {['why_1', 'why_2', 'why_3', 'why_4'].map((key, i) => (
                        <li key={i} className="flex gap-4 items-center group">
                            <div className="w-6 h-6 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 size={14} />
                            </div>
                            <span className="text-dark/70 font-medium group-hover:text-gold transition-colors">{t(`about.${key}`)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* mission section */}
      <section className="py-24 bg-white border-y border-black/5 about-section">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
                <span className="text-gold text-[10px] uppercase font-black tracking-[0.3em]">{t('about.mission_tag')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">{t('about.mission_title')}</h2>
            </div>
            <p className="text-xl text-dark/50 font-serif italic leading-relaxed">
              "{t('about.mission_quote')}"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { labelKey: "about.pure_products", icon: <Leaf size={44} /> },
                    { labelKey: "about.healthy_living", icon: <Heart size={44} /> },
                    { labelKey: "about.tradition", icon: <Sparkles size={44} /> },
                    { labelKey: "about.trust", icon: <ShieldCheck size={44} /> }
                ].map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="text-gold/40 flex justify-center">{item.icon}</div>
                        <p className="text-[0.7rem] uppercase font-black tracking-widest  text-dark/30">{t(item.labelKey)}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
    </div>
  );
}

export default About;
