import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import {
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Minus,
  Plus,
  Star,
  MessageSquare,
  Send,
  Check,
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useQuery, useMutation } from "@apollo/client/react";
import { getProductById, getProducts, getProductReviews } from "../api/queries";
import { writeReview } from "../api/mutations";
import { mapProduct, mapProducts } from "../utils/mapper";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Helmet } from "react-helmet-async";
import { ProductDetailSkeleton, SkeletonGrid } from "./Skeleton";

function ProductDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const getName = (name) => {
    if (typeof name === "object")
      return name[lang] || name.fr || name.ar || "Product";
    return name;
  };

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(getProductById, { 
    variables: { id: id },
    fetchPolicy: "cache-and-network" 
  });

  const { data: reviewsData } = useQuery(getProductReviews, {
    variables: { id: id },
    skip: !id,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const product = useMemo(
    () => mapProduct(productData?.product),
    [productData],
  );
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImage(0);
  }, [product?.id]);

  const { data: relatedData } = useQuery(getProducts, {
    variables: {
      first: 5,
      categoryIn: product?.categorySlug ? [product.categorySlug] : undefined,
    },
    skip: !product?.categorySlug,
    fetchPolicy: "cache-and-network",
  });

  const relatedProducts = useMemo(() => {
    if (!relatedData?.products?.nodes) return [];
    const mapped = mapProducts(relatedData.products.nodes);
    return mapped.filter((p) => String(p.id) !== String(id)).slice(0, 4);
  }, [relatedData, id]);

  const { addToCart, setIsCartOpen } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef(null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const reviews = useMemo(() => {
    const backendReviews = reviewsData?.product?.reviews?.nodes || [];
    return backendReviews.map((r) => ({
      id: r.databaseId,
      customerName: r.author?.node?.name || "Anonymous",
      rating: 5,
      comment: r.content ? r.content.replace(/<[^>]*>/g, "") : "",
      createdAt: r.date || new Date().toISOString(),
    }));
  }, [reviewsData]);

  const averageRating = useMemo(() => {
    return reviews.length > 0
      ? (
          reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;
  }, [reviews]);

  const [submitReview, { loading: submitLoading }] = useMutation(writeReview, {
    onCompleted: () => {
      setShowSuccessModal(true);
      setNewReview({ customerName: "", rating: 5, comment: "" });
      setShowReviewForm(false);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
      setShowSuccessModal(true);
      setNewReview({ customerName: "", rating: 5, comment: "" });
      setShowReviewForm(false);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      image:
        product.images && product.images[0]
          ? product.images[0]
          : "/placeholder.png",
    };
    for (let i = 0; i < quantity; i++) addToCart(cartProduct);
    setIsCartOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.customerName || !newReview.comment) return;

    try {
      await submitReview({
        variables: {
          input: {
            commentOn: parseInt(id),
            author: newReview.customerName,
            rating: newReview.rating,
            content: newReview.comment,
            authorEmail: `${newReview.customerName.replace(/\s+/g, "").toLowerCase()}@agrambio.com`,
          },
        },
      });
      
      setSubmitted(true);
      setNewReview({ customerName: "", rating: 5, comment: "" });

      setTimeout(() => {
        setSubmitted(false);
        setShowReviewForm(false);
      }, 5000);
    } catch (err) {
      console.error("GraphQL Review Submit Error:", err);
    }
  };

  useGSAP(
    () => {
      if (productLoading || !product) return;

      const img = containerRef.current?.querySelector(".product-image");
      const items = containerRef.current?.querySelectorAll(".info-item");

      if (img) {
        gsap.fromTo(img,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      }

      if (items?.length) {
        gsap.fromTo(items,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out", delay: 0.3 }
        );
      }
    },
    { scope: containerRef, dependencies: [product?.id, productLoading] }
  );

  if (productLoading && !productData) {
    return (
      <div className="min-h-screen bg-[#FCFAFA] pt-32">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-dark mb-4">
            {t("product_detail.not_found")}
          </h2>
          <Link to="/shop" className="text-gold hover:underline">
            {t("product_detail.back_to_shop")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FCFAFA] pt-8 pb-10">
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 mb-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-dark/40 hover:text-gold transition-colors group"
        >
          <ChevronLeft size={16} /> {t("product_detail.back")}
        </Link>
      </div>

      <Helmet>
        <title>{getName(product.name)} | AgramBio</title>
        <meta
          name="description"
          content={
            typeof product.description === "string"
              ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
              : "AgramBio Produit Bio Premium"
          }
        />
        <meta
          property="og:title"
          content={`${getName(product.name)} | AgramBio`}
        />
        <meta
          property="og:image"
          content={product.images && product.images[0] ? product.images[0] : ""}
        />
      </Helmet>

      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="product-image group relative aspect-square bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-sm max-w-xl mx-auto w-full">
            <img
              src={
                product.images && product.images[activeImage]
                  ? product.images[activeImage]
                  : "/placeholder.png"
              }
              alt={getName(product.name)}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? "border-gold scale-105" : "border-black/5 hover:border-gold/50 opacity-70 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 product-info space-y-10">
          <div>
            <span className="info-item inline-block px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-2">
              {product.categorySlug?.replace(/-/g, " ") ||
                t("product_detail.organic_treasure")}
            </span>
            <h1 className="info-item text-4xl md:text-5xl lg:text-6xl font-serif text-dark leading-tight mb-4">
              {getName(product.name)}
            </h1>
            <div className="info-item flex items-center gap-4 text-2xl font-serif text-gold">
              <span className="font-bold font-sans">{product.price} MAD</span>
              {product.originalPrice && (
                <span className="text-dark/20 font-semibold line-through text-lg font-sans">
                  {product.originalPrice} MAD
                </span>
              )}
            </div>
          </div>

          <div
            className="info-item text-dark/60 leading-relaxed max-w-lg"
            dangerouslySetInnerHTML={{
              __html:
                typeof product.description === "object" &&
                product.description !== null
                  ? product.description[lang] || product.description.fr || ""
                  : product.description || "",
            }}
          />

          <div className="info-item grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/5 flex items-center justify-center rounded-full text-gold">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[15px] uppercase font-bold tracking-widest text-dark/40 line-clamp-1">
                {t("product_detail.pure_quality")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/5 flex items-center justify-center rounded-full text-gold">
                <Truck size={20} />
              </div>
              <span className="text-[15px] uppercase font-bold tracking-widest text-dark/40 line-clamp-1">
                {t("product_detail.fast_delivery")}
              </span>
            </div>
          </div>

          <div className="info-item flex items-center gap-4 pt-4">
            <div className="flex items-center justify-between bg-white border border-black/5 rounded-full px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] min-w-30">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-dark/40 hover:text-gold transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold text-dark text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-dark/40 hover:text-gold transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 md:flex-none md:px-12 cursor-pointer flex items-center justify-center gap-3 bg-dark text-cream py-4 rounded-full hover:bg-gold hover:text-dark hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out font-bold tracking-widest text-xs shadow-xl"
            >
              <ShoppingBag size={18} /> {t("product_detail.add_to_cart")}
            </button>
          </div>
        </div>
      </div>

      {/* reviews section */}
      <div className="my-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-dark mb-3">
            {t("reviews.title")}
          </h2>
          <p className="text-dark/60 max-w-md mx-auto">
            {t("reviews.satisfaction_quote")}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column - Rating & Write Review */}
            <div className="lg:col-span-5 bg-[#FCFAFA] p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-black/5">
              <div className="sticky top-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="text-4xl font-bold text-gold tracking-tighter font-sans">
                    {averageRating}
                  </div>
                  <div className="space-y-1">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          fill={i < Math.floor(averageRating) ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-dark/50">
                      {t("reviews.based_on", { count: reviews.length })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full py-4 bg-dark hover:bg-gold hover:text-dark text-white rounded-2xl font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <MessageSquare size={18} />
                  {t("reviews.write_review")}
                </button>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="mt-10 space-y-6">
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-dark/50 mb-2">{t("reviews.rating_label")}</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className="transition-transform hover:scale-110"
                          >
                            <Star 
                              size={32} 
                              fill={newReview.rating >= star ? "currentColor" : "none"}
                              className={newReview.rating >= star ? "text-gold" : "text-black/20"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest text-dark/50 mb-2">{t("reviews.name_label")}</label>
                      <input
                        type="text"
                        required
                        value={newReview.customerName}
                        onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl border border-black/10 focus:border-gold outline-none bg-white"
                        placeholder={t("reviews.name_placeholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest text-dark/50 mb-2">{t("reviews.comment_label")}</label>
                      <textarea
                        required
                        rows={5}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full px-5 py-4 rounded-3xl border border-black/10 focus:border-gold outline-none resize-y bg-white"
                        placeholder={t("reviews.comment_placeholder")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-gold hover:bg-amber-600 text-white py-4 rounded-2xl font-semibold tracking-widest transition-all disabled:opacity-70"
                    >
                      {submitLoading ? t("reviews.submitting") : t("reviews.submit")}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column - List of Reviews */}
            <div className="lg:col-span-7 p-10 lg:p-12">
              {reviews.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-center">
                  <p className="text-dark/40 text-lg">{t("reviews.no_reviews")}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-black/5 pb-8 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-dark">{review.customerName}</h4>
                        <span className="text-xs text-dark/40">
                          {new Date(review.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR')}
                        </span>
                      </div>

                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < review.rating ? "currentColor" : "none"} 
                            className={i < review.rating ? "text-gold" : "text-black/20"} 
                          />
                        ))}
                      </div>

                      <p className="text-dark/70 leading-relaxed text-[15.5px]">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className=" border-t border-black/5 pt-24 pb-5">
          <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-gold text-[15px] font-bold uppercase tracking-[0.3em] mb-4 block">
                  {t("product_detail.related_tag")}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-dark lowercase italic">
                  {t("product_detail.related_title")}
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-widest text-dark/40 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1 w-fit"
              >
                {t("product_detail.view_all")}
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
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FCFAFA] border border-black/5 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} strokeWidth={3} className="mx-auto mt-5" />
            </div>
            <h3 className="font-serif text-2xl text-dark mb-3">
              {t("reviews.thank_you")}
            </h3>
            <p className="text-dark/60 mb-8 leading-relaxed text-[1rem]">
              {t("reviews.pending_approval")}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-dark cursor-pointer text-cream font-bold py-3.5 px-8 rounded-full hover:bg-gold hover:text-dark hover:shadow-lg shadow-md transition-all duration-300 ease-out tracking-widest uppercase text-sm"
            >
              {t("checkout.ok") || "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
