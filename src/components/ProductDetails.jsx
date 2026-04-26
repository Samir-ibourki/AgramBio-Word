import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { ChevronLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Minus, Plus, Star, MessageSquare, Send, Check } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useQuery } from "@apollo/client/react";
import { getProductById, getProducts } from "../api/queries";
import { mapProduct, mapProducts } from "../utils/mapper";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Helmet } from "react-helmet-async";

function ProductDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const getName = (name) => {
    if (typeof name === 'object') return name[lang] || name.fr || name.ar || "Product";
    return name;
  };



  const { data: productData, loading: productLoading, error: productError } = useQuery(getProductById, { variables: { id: id }});
  const product = useMemo(() => mapProduct(productData?.product), [productData]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const { data: relatedData } = useQuery(getProducts, { 
     variables: { first: 5, categoryIn: product?.categorySlug ? [product.categorySlug] : undefined },
     skip: !product?.categorySlug
  });
  
  const relatedProducts = useMemo(() => {
    if (!relatedData?.products?.nodes) return [];
    const mapped = mapProducts(relatedData.products.nodes);
    return mapped.filter(p => String(p.id) !== String(id)).slice(0, 4);
  }, [relatedData, id]);

  const { addToCart, setIsCartOpen } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef(null);


  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ customerName: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews =  [];
  const averageRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((acc, rev) => acc + rev.rating, 0) / approvedReviews.length).toFixed(1)
    : 0;

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      image: product.images && product.images[0] ? product.images[0] : "/placeholder.png"
    };
    for (let i = 0; i < quantity; i++) addToCart(cartProduct);
    setIsCartOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
   
  };

  useGSAP(() => {
    if (productLoading || !product) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (document.querySelector(".product-image")) {
       tl.from(".product-image", { x: -60, opacity: 0, duration: 1 });
       tl.from(".info-item", { y: 30, stagger: 0.1, duration: 0.7 }, "-=0.5");
    }

    gsap.from(".reviews-section", {
      scrollTrigger: { trigger: ".reviews-section", start: "top 90%" },
      y: 50, duration: 0.8
    });

    gsap.from(".related-product-card", {
      scrollTrigger: { trigger: ".related-product-card", start: "top 90%" },
      y: 60, opacity: 0, stagger: 0.1, duration: 0.8
    });
  }, { scope: containerRef, dependencies: [product, relatedProducts, productLoading] });

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-dark/40 mb-4 italic">Loading Product...</h2>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-dark mb-4">{t('product_detail.not_found')}</h2>
          <Link to="/shop" className="text-gold hover:underline">{t('product_detail.back_to_shop')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FCFAFA] py-10">
      
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 mb-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-dark/40 hover:text-gold transition-colors group">
          <ChevronLeft size={16} /> {t('product_detail.back')}
        </Link>
      </div>

      <Helmet>
        <title>{getName(product.name)} | AgramBio</title>
        <meta name="description" content={typeof product.description === 'string' ? product.description.replace(/<[^>]*>/g, '').slice(0, 160) : "AgramBio Produit Bio Premium"} />
        <meta property="og:title" content={`${getName(product.name)} | AgramBio`} />
        <meta property="og:image" content={product.images && product.images[0] ? product.images[0] : ""} />
      </Helmet>

      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="product-image group relative aspect-square bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-sm max-w-xl mx-auto w-full">
            <img 
              src={product.images && product.images[activeImage] ? product.images[activeImage] : "/placeholder.png"} 
              alt={getName(product.name)}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-gold scale-105' : 'border-black/5 hover:border-gold/50 opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 product-info space-y-10">
          <div>
            <span className="info-item inline-block px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6">
              {product.categorySlug?.replace(/-/g, ' ') || t('product_detail.organic_treasure')}
            </span>
            <h1 className="info-item text-4xl md:text-5xl lg:text-6xl font-serif text-dark leading-tight mb-4">
              {getName(product.name)}
            </h1>
            <div className="info-item flex items-center gap-4 text-2xl font-serif text-gold">
              <span>{product.price} MAD</span>
              {product.originalPrice && (
                <span className="text-dark/20 line-through text-lg">{product.originalPrice} MAD</span>
              )}
            </div>
          </div>

          <div 
            className="info-item text-dark/60 leading-relaxed max-w-lg"
            dangerouslySetInnerHTML={{ 
              __html: (typeof product.description === 'object' && product.description !== null)
                ? (product.description[lang] || product.description.fr || '')
                : (product.description || '') 
            }}
          />

          <div className="info-item grid grid-cols-1 sm:grid-cols-2 gap-6 py-10 border-y border-black/5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/5 flex items-center justify-center rounded-full text-gold"><ShieldCheck size={20} /></div>
                <span className="text-[15px] uppercase font-bold tracking-widest text-dark/40 line-clamp-1">{t('product_detail.pure_quality')}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/5 flex items-center justify-center rounded-full text-gold"><Truck size={20} /></div>
                <span className="text-[15px] uppercase font-bold tracking-widest text-dark/40 line-clamp-1">{t('product_detail.fast_delivery')}</span>
            </div>
          </div>

          <div className="info-item flex items-center gap-4 pt-4">
            <div className="flex items-center justify-between bg-white border border-black/5 rounded-2xl px-4 py-3 shadow-sm min-w-[120px]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-dark/40 hover:text-gold transition-colors"><Minus size={14} /></button>
              <span className="w-8 text-center font-bold text-dark text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-dark/40 hover:text-gold transition-colors"><Plus size={14} /></button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-[20rem] flex items-center justify-center gap-3 bg-dark text-cream py-5 rounded-2xl hover:bg-gold hover:text-dark transition-all duration-300 font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95"
            >
              <ShoppingBag size={18} /> {t('product_detail.add_to_cart')}
            </button>
          </div>

          <div className="info-item flex items-center gap-3 text-dark/30">
            <RefreshCw size={14} />
            <span className="text-[1rem] uppercase font-bold tracking-[0.2em]">{t('product_detail.satisfaction')}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section mt-10 max-w-7xl lg:max-w-[95vw] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 bg-white border border-black/5 rounded-[40px] p-8 md:p-12 shadow-sm overflow-hidden">
          
          <div className="w-full md:w-1/3 flex flex-col">
            <h2 className="text-4xl font-serif text-dark mb-6">{t('reviews.title')}</h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-serif text-gold">{averageRating}</div>
              <div>
                <div className="flex text-gold mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} className={i < Math.floor(averageRating) ? "text-gold" : "text-black/10"} />
                  ))}
                </div>
                <p className="text-[1rem] uppercase font-bold tracking-widest text-dark/30">
                  {t('reviews.based_on', { count: approvedReviews.length })}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full py-4 bg-dark text-cream hover:bg-gold hover:text-dark rounded-2xl text-[1rem] uppercase font-bold tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-md shadow-dark/5"
            >
              <MessageSquare size={14} />
              {t('reviews.write_review')}
            </button>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-[32px] border border-black/5 shadow-xl shadow-dark/[0.02] overflow-hidden">
                {submitted ? (
                  <div className="py-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} />
                    </div>
                    <p className="text-sm font-bold text-dark mb-2">{t('reviews.title')}</p>
                    <p className="text-xs text-dark/40 leading-relaxed">{t('reviews.pending_approval')}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">{t('reviews.rating_label')}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`p-1 transition-colors ${newReview.rating >= star ? 'text-gold' : 'text-black/10'}`}
                          >
                            <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">{t('reviews.name_label')}</label>
                      <input 
                        required
                        type="text" 
                        placeholder={t('reviews.name_placeholder')}
                        value={newReview.customerName}
                        onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                        className="w-full bg-cream/20 border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/30 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">{t('reviews.comment_label')}</label>
                      <textarea 
                        required
                        placeholder={t('reviews.comment_placeholder')}
                        rows="4"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-cream/20 border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/30 transition-all resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                     
                      className="w-full bg-dark text-cream py-4 rounded-xl font-bold uppercase tracking-widest text-[1rem] hover:bg-gold hover:text-dark transition-all duration-300 shadow-lg disabled:opacity-50"
                    >
                      {submitReviewMutation.isPending ? t('preloader.loading') : t('reviews.submit')}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

          <div className="w-full md:w-2/3 space-y-8">
            {approvedReviews.length === 0 ? (
              <div className="h-full flex items-center justify-center py-20 text-center border border-dashed border-black/5 rounded-[32px]">
                <p className="font-serif italic text-dark/30">{t('reviews.no_reviews')}</p>
              </div>
            ) : (
              approvedReviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-serif text-lg text-dark">{review.customerName}</h4>
                      <div className="flex text-gold mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-gold" : "text-black/10"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[1rem] font-bold text-dark/20 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-dark/60 text-[1rem] leading-relaxed italic pr-4">{review.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className=" border-t border-black/5 pt-24 pb-5">
          <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-gold text-[15px] font-bold uppercase tracking-[0.3em] mb-4 block">{t('product_detail.related_tag')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-dark lowercase italic">{t('product_detail.related_title')}</h2>
              </div>
              <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-dark/40 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1 w-fit">
                {t('product_detail.view_all')}
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id} className="related-product-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;