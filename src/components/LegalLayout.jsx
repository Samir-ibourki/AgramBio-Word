import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function LegalLayout({ title, children }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".legal-header", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".legal-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FCFAFA] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="legal-header mb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-dark/40 hover:text-gold transition-colors group mb-10"
          >
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">
              {t("product_detail.back")}
            </span>
          </Link>

          <div className="space-y-4">
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase font-bold block">
              {t("nav.legal_tag") || "AgraSouss Documents"}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-dark lowercase italic leading-tight">
              {title}
            </h1>
            <div className="w-12 h-0.5 bg-gold/30 mt-8" />
          </div>
        </div>

        {/* Content Section */}
        <div className="legal-content bg-white border border-black/5 rounded-[40px] p-8 md:p-16 shadow-sm shadow-dark/2">
          <div className="prose prose-sm md:prose-base max-w-none prose-serif prose-headings:font-serif prose-headings:text-dark prose-p:text-dark/70 prose-li:text-dark/70">
            {children}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="text-[11px] uppercase font-bold tracking-[0.2em] text-dark/40 hover:text-gold transition-colors"
          >
            {t("footer.contact_form")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LegalLayout;
