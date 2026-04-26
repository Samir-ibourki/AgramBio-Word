import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client/react";
import { getProducts } from "../api/queries";
import { mapProducts } from "../utils/mapper";

function Shop() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const categories = useMemo(() => [
    { labelKey: "shop.miel", slug: "miel-naturel" },
    { labelKey: "shop.amlou", slug: "amlou" },
    { labelKey: "shop.argan", slug: "huiles-naturelles" },
    { labelKey: "shop.promotions", slug: "promotions" },
  ], []);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) setSelectedCategories([catParam]);
  }, [searchParams]);

  const toggleCategory = useCallback((slug) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }, []);

  const { data, loading, error } = useQuery(getProducts, { variables: { first: 50 } });
  const allLiveProducts = useMemo(() => mapProducts(data?.products?.nodes), [data]);

  const getName = (name) => {
    if (typeof name === 'object') return name[lang] || name.fr || name.ar || "";
    return name || "";
  };

  const filteredProducts = useMemo(() => {
    if (!allLiveProducts || allLiveProducts.length === 0) return [];
    
    let result = allLiveProducts.filter(product => {
      const productName = getName(product.name).toLowerCase();
      const matchesSearch = productName.includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categorySlug);
      const matchesPrice = product.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => getName(a.name).localeCompare(getName(b.name))); break;
      default: result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [debouncedSearch, selectedCategories, priceRange, sortBy, lang, allLiveProducts]);


  const sortOptions = [
    { labelKey: "shop.newest", value: "newest" },
    { labelKey: "shop.price_low", value: "price-low" },
    { labelKey: "shop.price_high", value: "price-high" },
    { labelKey: "shop.name_az", value: "name" }
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.labelKey || "shop.newest";

  return (
    <div className="min-h-screen bg-[#FCFAFA] pb-24 pt-10">
      <Helmet>
        <title>Boutique Premium | AgramBio</title>
        <meta name="description" content="Explorez notre catalogue complet de produits naturels marocains. Miel, huiles végétales et Amlou d'exception." />
      </Helmet>
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-lg">
            <h1 className="text-5xl font-serif text-dark mb-4">{t('shop.title_prefix')} <span className="text-gold italic">{t('shop.title_highlight')}</span></h1>
            <p className="text-dark/40 text-sm leading-relaxed">{t('shop.description')}</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/20 group-focus-within:text-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t('shop.search')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl outline-none focus:border-gold/30 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-64 space-y-10">
            <div className="p-8 bg-white border border-black/5 rounded-3xl">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-dark mb-6">{t('shop.categories')}</h3>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input type="checkbox" checked={selectedCategories.includes(cat.slug)} onChange={() => toggleCategory(cat.slug)} className="peer hidden" />
                        <div className="w-5 h-5 border-2 border-black/5 rounded-md peer-checked:bg-gold peer-checked:border-gold transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white text-[10px]">✓</div>
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${selectedCategories.includes(cat.slug) ? 'text-dark font-bold' : 'text-dark/40 group-hover:text-dark'}`}>
                      {t(cat.labelKey)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white border border-black/5 rounded-3xl">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-dark mb-6">{t('shop.price_range')}</h3>
              <input type="range" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-gold h-1 bg-black/5 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between mt-4">
                <span className="text-[10px] text-dark/30 font-bold uppercase">0 MAD</span>
                <span className="text-sm text-gold font-bold">{priceRange} MAD</span>
              </div>
            </div>

            {(selectedCategories.length > 0 || inputValue || priceRange < 1000) && (
              <button 
                onClick={() => { setSelectedCategories([]); setInputValue(""); setPriceRange(1000); }}
                className="w-full mt-6 py-4 px-6 bg-red-50/50 hover:bg-red-50 border border-red-100/50 rounded-2xl transition-all duration-300 group flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <div className="p-1 bg-white rounded-lg shadow-sm group-hover:rotate-90 transition-transform duration-500">
                  <X size={12} className="text-red-400" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-red-400">{t('shop.clear_filters')}</span>
              </button>
            )}
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-xs text-dark/30 font-bold uppercase tracking-widest">
                {t('shop.showing', { count: filteredProducts.length })}
              </p>
              
              <div className="relative group">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 text-xs text-dark/40 font-bold uppercase tracking-widest hover:text-gold transition-colors outline-none"
                >
                  {t('shop.sort_by')} <span className="text-dark">{t(currentSortLabel)}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-black/5 rounded-2xl shadow-xl z-20 overflow-hidden py-2">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                          className={`w-full text-left px-6 py-3 text-[10px] uppercase font-bold tracking-widest transition-colors ${sortBy === opt.value ? 'bg-gold/5 text-gold' : 'text-dark/40 hover:bg-black/5 hover:text-dark'}`}
                        >
                          {t(opt.labelKey)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center bg-white border border-black/5 rounded-[40px]">
                 <p className="font-serif italic text-xl text-dark/20">Loading Shop...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center bg-white border border-black/5 rounded-[40px]">
                 <p className="font-serif italic text-xl text-red-500">Error loading products.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white border border-black/5 rounded-[40px]">
                 <p className="font-serif italic text-xl text-dark/20">{t('shop.no_results')}</p>
              </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 lg:gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
