import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function CartDrawer({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    shippingFee,
    getTotal,
  } = useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const lang = i18n.language;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const getName = (name) => {
    if (typeof name === "object")
      return name[lang] || name.fr || name.ar || "Product";
    return name;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-200 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-210 shadow-2xl transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* header */}
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-gold" />
              <h2 className="text-xl font-serif text-dark font-bold">
                {t("cart.title")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={20} className="text-dark/40" />
            </button>
          </div>

          {/* cart items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <ShoppingBag size={48} className="mb-4" />
                <p className="font-serif italic">{t("cart.empty")}</p>
                <button
                  onClick={onClose}
                  className="mt-6 text-xs uppercase font-bold tracking-widest text-gold hover:underline"
                >
                  {t("cart.start_shopping")}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-cream rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={getName(item.name)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-dark">
                          {getName(item.name)}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-dark/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-dark/40 uppercase tracking-widest mt-1">
                        {item.categoryLabel}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 border border-black/5 rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-dark/40 hover:text-gold"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-dark/40 hover:text-gold"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gold">
                        {item.price * item.quantity} MAD
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-8 bg-[#FCFAFA] border-t border-black/5 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark/40">{t("cart.subtotal")}</span>
                  <span className="text-dark font-bold font-sans">
                    {subtotal} MAD
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark/40">{t("cart.shipping")}</span>
                  <span className="text-dark font-bold font-sans">
                    {shippingFee} MAD
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-black/5 mt-4">
                  <span className="font-serif italic font-bold text-dark">
                    {t("cart.total")}
                  </span>
                  <span className="text-gold font-bold font-sans">
                    {total} MAD
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-dark text-cream text-center py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold hover:text-dark hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out shadow-xl shadow-dark/10"
              >
                {t("cart.checkout")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
