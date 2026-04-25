import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { getCategories } from '../api/queries';

gsap.registerPlugin(ScrollTrigger);

function Category() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { data, loading, error } = useQuery(getCategories);

  useGSAP(() => {
    if (!data) return;
    
    const q = gsap.utils.selector(containerRef);
    gsap.from(q('.title-anim'), { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: q('.title-anim'), start: "top 90%" } });
    
    if (q('.card').length > 0) {
      gsap.fromTo(q('.card'), { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: q('.card'), start: "top 90%" } });
    }
  }, { scope: containerRef, dependencies: [data] });

  return (
    <section id="categories" ref={containerRef} className="py-8 md:py-16 bg-[#FCFAFA]">
      <div className="max-w-5xl lg:max-w-[85vw] mx-auto px-6">
        
        <div className="title-anim flex flex-col items-center text-center mb-6 md:mb-10">
          <span className="text-gold text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold mb-2 md:mb-4">
            {t('category.tag')}
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-dark italic leading-tight">
            {t('category.title_prefix')} <span className="text-gold not-italic font-bold tracking-tighter uppercase">{t('category.title_highlight')}</span>
          </h2>
        </div>

        {loading ? (
          <div className="py-10 text-center text-dark/40 font-serif italic">Loading Categories...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500 font-serif italic">Error loading categories.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {data?.productCategories?.nodes?.map((cat) => (
              <Link 
                key={cat.databaseId}
                to={`/shop?category=${cat.slug}`}
                className="card group relative aspect-[3/3] md:aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl cursor-pointer 
                        bg-white shadow-[0_5px_15px_rgba(0,0,0,0.03)] 
                           hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                           transition-all duration-700 block"
              >
                <div className="absolute inset-0">
                  <img 
                    src={cat.image?.sourceUrl || "https://placehold.co/400x500?text=Category"} 
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 md:pb-12 px-4 z-10">
                  <h3 className="text-white text-xs md:text-xl font-serif mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out text-center lowercase italic">
                    {cat.name}
                  </h3>
                  <div className="w-0 h-[1px] bg-gold group-hover:w-8 transition-all duration-500" />
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