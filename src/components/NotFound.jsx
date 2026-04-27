import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FCFAFA] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-[120px] md:text-[180px] font-serif text-gold/20 leading-none select-none">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif text-dark mb-4 -mt-6 italic">
          {t("not_found.title")}
        </h2>
        <p className="text-dark/40 mb-10 leading-relaxed text-[1rem]">
          {t("not_found.description")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-dark text-cream font-bold py-3.5 px-8 rounded-xl hover:bg-gold hover:text-dark transition-all duration-300 tracking-widest uppercase text-sm"
          >
            <Home size={18} />
            {t("not_found.home")}
          </Link>
          <Link
            to="/shop"
            className="flex items-center gap-2 border border-black/10 text-dark font-bold py-3.5 px-8 rounded-xl hover:border-gold hover:text-gold transition-all duration-300 tracking-widest uppercase text-sm"
          >
            <ArrowLeft size={18} />
            {t("not_found.shop")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
