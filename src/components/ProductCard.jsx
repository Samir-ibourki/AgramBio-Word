import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";

function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { addToCart, setIsCartOpen } = useCartStore();
  const lang = i18n.language;
  
  const getName = () => {
    if (typeof product.name === 'object') return product.name[lang] || product.name.fr || product.name.ar || "Product";
    return product.name;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const cartProduct = {
      ...product,
      image: product.images && product.images[0] ? product.images[0] : "/placeholder.png"
    };
    addToCart(cartProduct);
    setIsCartOpen(true);
  };

  return (
    <div className="group bg-[#FCFAFA] rounded-2xl md:rounded-3xl overflow-hidden border border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block flex-1 group/link">
        <div className="relative aspect-square overflow-hidden bg-white">
          <img 
            src={product.images && product.images[0] ? product.images[0] : "/placeholder.png"} 
            alt={getName()}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/link:scale-110"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-widest z-10">
              {t('products.sale')}
            </div>
          )}
        </div>

        <div className="p-3 md:p-6 text-center">
            <span className="text-gold text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-1 md:mb-2 block">
                {product.categorySlug?.replace(/-/g, ' ') || t('products.organic')}
            </span>
          <h3 className="text-dark text-sm md:text-xl font-serif mb-2 md:mb-3 line-clamp-2 group-hover/link:text-gold transition-colors leading-snug">
            {getName()}
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
            <span className="text-dark font-bold text-sm md:text-lg">{product.price} MAD</span>
            {product.originalPrice && (
              <span className="text-dark/30 line-through text-[10px] md:text-sm">{product.originalPrice} MAD</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 md:px-6 pb-4 md:pb-6 mt-auto">
        <button 
          onClick={handleAddToCart}
          className="w-full py-2.5 md:py-3 cursor-pointer bg-dark text-cream text-[9px] md:text-[10px] uppercase font-bold tracking-widest 
        rounded-xl transition-all duration-300 hover:bg-gold hover:text-dark shadow-md active:scale-95"
        >
          {t('products.add_to_cart')}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
