import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { getCategories } from "../api/queries";
import { SkeletonGrid } from "./Skeleton";

gsap.registerPlugin(ScrollTrigger);

function Category() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { data, loading, error } = useQuery(getCategories, {
    fetchPolicy: "cache-and-network",
  });

  useGSAP(
    () => {
      if (!data) return;

      const q = gsap.utils.selector(containerRef);
      gsap.fromTo(q(".title-anim"), 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: { 
            trigger: q(".title-anim"), 
            start: "top 90%",
            once: true
          },
        }
      );

      if (q(".card").length > 0) {
        gsap.fromTo(
          q(".card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: {
              each: 0.1,
              ease: "power2.inOut"
            },
            ease: "power3.out",
            force3D: true,
            scrollTrigger: { 
              trigger: containerRef.current, 
              start: "top 85%",
              once: true
            },
          },
        );
      }
    },
    { scope: containerRef, dependencies: [data] },
  );

  return (
    <section
      id="categories"
      ref={containerRef}
      className="py-8 md:py-16 bg-[#FCFAFA]"
    >
      <div className="max-w-5xl lg:max-w-[85vw] mx-auto px-6">
        <div className="title-anim flex flex-col items-center text-center mb-6 md:mb-10">
          <span className="text-gold text-[0.5rem] md:text-[0.8rem] tracking-[0.2em] font-bold mb-3">
            {t("category.tag")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark italic leading-tight">
            {t("category.title_prefix")}{" "}
            <span className="text-gold not-italic font-bold tracking-tighter uppercase">
              {t("category.title_highlight")}
            </span>
          </h2>
        </div>

        {loading && !data ? (
          <SkeletonGrid type="category" count={4} gridClass="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" />
        ) : error && !data ? (
          <div className="py-10 text-center text-red-500 font-serif">
            Error loading categories.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {data?.productCategories?.nodes?.map((cat) => (
              <Link
                key={cat.databaseId}
                to={`/shop?category=${cat.slug}`}
                className="card group relative aspect-3/3 md:aspect-4/5 overflow-hidden rounded-xl md:rounded-2xl cursor-pointer 
                        bg-white shadow-[0_5px_15px_rgba(0,0,0,0.03)] 
                        hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                        !transition-shadow duration-500 block will-change-[transform,opacity]"
              >
                <div className="absolute inset-0">
                  <img
                    src={
                      cat.image?.sourceUrl ||
                      "https://placehold.co/400x500?text=Category"
                    }
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 md:pb-12 px-4 z-10">
                  <h3 className="text-white text-xs md:text-xl font-serif mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out text-center lowercase">
                    {cat.name}
                  </h3>
                  <div className="w-0 h-px bg-gold group-hover:w-8 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Category;
