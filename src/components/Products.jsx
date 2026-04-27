import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@apollo/client/react";
import { getProducts } from "../api/queries";
import { mapProducts } from "../utils/mapper";

gsap.registerPlugin(ScrollTrigger);

function Products() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(slug || "all");

  const categories = [
    { name: t("shop.miel"), slug: "miel-naturel" },
    { name: t("shop.amlou"), slug: "amlou" },
    { name: t("shop.argan"), slug: "huiles-naturelles" },
  ];

  const { data, loading, error } = useQuery(getProducts, {
    variables: { first: 20 },
  });
  const allLiveProducts = useMemo(
    () => mapProducts(data?.products?.nodes),
    [data],
  );

  const products = useMemo(() => {
    if (!allLiveProducts || allLiveProducts.length === 0) return [];

    if (activeTab !== "all") {
      return allLiveProducts.filter((p) => p.categorySlug === activeTab);
    }
    if (slug) {
      return allLiveProducts.filter((p) => p.categorySlug === slug);
    }

    return allLiveProducts.slice(0, 4);
  }, [slug, activeTab, allLiveProducts]);

  useGSAP(
    () => {
      if (loading || products.length === 0) return;

      const q = gsap.utils.selector(containerRef);
      gsap.from(q(".title-anim"), {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: { trigger: q(".title-anim"), start: "top 90%" },
      });

      if (q(".card").length > 0) {
        gsap.fromTo(
          q(".card"),
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: { trigger: q(".card"), start: "top 90%" },
          },
        );
      }
    },
    { scope: containerRef, dependencies: [products, loading] },
  );

  return (
    <section id="products" ref={containerRef} className="py-20 bg-white">
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
        <div className="title-anim mb-12 flex flex-col items-center text-center">
          <span className="text-gold text-[0.8rem] tracking-[0.4em] uppercase font-bold mb-4">
            {t("products.tag")}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-dark lowercase italic leading-tight mb-2">
            {t("products.title_prefix")}{" "}
            <span className="text-gold not-italic font-bold tracking-tighter uppercase">
              {t("products.title_highlight")}
            </span>
          </h2>

          {/* Category Tabs */}
          {!slug && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 text-[0.8rem] lg:text-[0.8rem]  md:text-[1rem] font-bold tracking-widest rounded-full transition-all duration-300 border ${activeTab === "all" ? "bg-dark text-cream border-dark" : "bg-transparent text-dark/40 border-black/5 hover:border-gold/30 hover:text-gold"}`}
              >
                {t("shop.all_products") || "Tout"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveTab(cat.slug)}
                  className={`px-6 py-2 text-[0.8rem] lg:text-[0.8rem] md:text-[1rem]  font-bold tracking-widest rounded-full transition-all duration-300 border ${activeTab === cat.slug ? "bg-dark text-cream border-dark" : "bg-transparent text-dark/40 border-black/5 hover:border-gold/30 hover:text-gold"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="w-12 h-0.5 bg-gold/30 mt-8 mx-auto" />
        </div>

        <div className="min-h-100">
          {loading ? (
            <div className="py-20 text-center text-dark/40 font-serif italic">
              Loading Products...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 font-serif italic">
              Error loading products.
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-dark/40 font-serif italic">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {products.map((product) => (
                <div key={product.id} className="card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/shop"
            className="group relative px-10 py-4 bg-dark text-cream rounded-full overflow-hidden transition-all ease-linear duration-300 hover:pr-14 shadow-xl"
          >
            <span className="relative z-10 text-[0.8rem] md:text-[1rem]  font-bold tracking-[0.2em]">
              {t("products.see_more")}
            </span>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              →
            </div>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
