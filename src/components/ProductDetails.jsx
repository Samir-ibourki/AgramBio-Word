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
  } = useQuery(getProductById, { variables: { id: id } });

  const { data: reviewsData } = useQuery(getProductReviews, {
    variables: { id: id },
    skip: !id,
    errorPolicy: "all",
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

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-dark/40 mb-4 italic">
            Loading Product...
          </h2>
        </div>
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
    <div ref={containerRef} className="min-h-screen bg-[#FCFAFA] py-5">
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
              className="w-[20rem] cursor-pointer flex items-center justify-center gap-3 bg-dark text-cream py-5 rounded-full hover:bg-gold hover:text-dark hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out font-bold  tracking-widest text-xs shadow-xl active:scale-95"
            >
              <ShoppingBag size={18} /> {t("product_detail.add_to_cart")}
            </button>
          </div>
        </div>
      </div>

      {/* reviews section */}
      <div className="reviews-section my-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 bg-white border border-black/5 rounded-[40px] p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="w-full md:w-1/3 flex flex-col">
            <h2 className="text-2xl font-serif text-dark mb-6">
              {t("reviews.title")}
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <div className="text-3xl font-sans font-bold text-gold">
                {averageRating}
              </div>
              <div>
                <div className="flex text-gold mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(averageRating) ? "currentColor" : "none"
                      }
                      className={
                        i < Math.floor(averageRating)
                          ? "text-gold"
                          : "text-black/10"
                      }
                    />
                  ))}
                </div>
                <p className="text-[0.7rem] uppercase font-bold tracking-widest text-dark/30">
                  {t("reviews.based_on", { count: reviews.length })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full py-4 bg-dark text-cream hover:bg-gold hover:text-dark hover:scale-[1.02] rounded-full text-[0.8rem]  font-bold tracking-[0.2em] transition-all duration-300 ease-out flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
              <MessageSquare size={14} />
              {t("reviews.write_review")}
            </button>

            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="mt-8 space-y-6 bg-white p-8 rounded-4xl border border-black/5 shadow-xl shadow-dark/2 overflow-hidden"
              >
                {submitted ? (
                  <div className="py-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} />
                    </div>
                    <p className="text-sm font-bold text-dark mb-2">
                      {t("reviews.title")}
                    </p>
                    <p className="text-xs text-dark/40 leading-relaxed">
                      {t("reviews.pending_approval")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">
                        {t("reviews.rating_label")}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                            className={`p-1 transition-colors ${newReview.rating >= star ? "text-gold" : "text-black/10"}`}
                          >
                            <Star
                              size={24}
                              fill={
                                newReview.rating >= star
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">
                        {t("reviews.name_label")}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={t("reviews.name_placeholder")}
                        value={newReview.customerName}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full bg-cream/10 border border-dark/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 hover:border-dark/20 transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.02)] focus:shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[1rem] uppercase font-bold tracking-widest text-dark/40 ml-1">
                        {t("reviews.comment_label")}
                      </label>
                      <textarea
                        required
                        placeholder={t("reviews.comment_placeholder")}
                        rows="4"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        className="w-full bg-cream/10 border border-dark/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 hover:border-dark/20 transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.02)] focus:shadow-[0_10px_20px_rgba(0,0,0,0.05)] resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-dark text-cream py-4 rounded-full font-bold uppercase tracking-widest text-[1rem] hover:bg-gold hover:text-dark hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("preloader.loading")}
                        </span>
                      ) : (
                        t("reviews.submit")
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

          <div className="w-full md:w-2/3 space-y-8">
            {reviews.length === 0 ? (
              <div className="h-full flex items-center justify-center py-10 lg:py-20 md:py-20 text-center border border-dashed border-black/5 font-semibold text-[1rem] rounded-4xl">
                <p className="font-serif text-dark/30">
                  {t("reviews.no_reviews")}
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-4xl border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-serif text-lg text-dark">
                        {review.customerName}
                      </h4>
                      <div className="flex text-gold mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={
                              i < review.rating ? "text-gold" : "text-black/10"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[1rem] font-bold text-dark/20 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString(
                        lang === "ar"
                          ? "ar-MA"
                          : lang === "fr"
                            ? "fr-FR"
                            : "en-US",
                      )}
                    </span>
                  </div>
                  <p className="text-dark/60 text-[1rem] leading-relaxed italic pr-4">
                    {review.comment}
                  </p>
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
              {t("reviews.title")}
            </h3>
            <p className="text-dark/60 mb-8 leading-relaxed text-[1rem]">
              {t("reviews.pending_approval")}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-dark cursor-pointer text-cream font-bold py-3.5 px-8 rounded-full hover:bg-gold hover:text-dark hover:scale-[1.02] hover:shadow-lg shadow-md transition-all duration-300 ease-out tracking-widest uppercase text-sm"
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
