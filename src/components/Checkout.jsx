import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import {
  ChevronLeft,
  CheckCircle,
  Package,
  Truck,
  Phone,
  MapPin,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { createOrder, addToCartMutation } from "../api/mutations";
import client from "../api/apolloClient";

function Checkout() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { cart, getTotal, getSubtotal, shippingFee, clearCart } =
    useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const getName = (name) => {
    if (typeof name === "object")
      return name[lang] || name.fr || name.ar || "Product";
    return name;
  };

  const [checkoutMutation] = useMutation(createOrder, {
    onCompleted: () => {
      setIsOrdered(true);
      setIsProcessing(false);
      clearCart();
      window.scrollTo(0, 0);
    },
    onError: () => {
      setIsProcessing(false);
      setShowErrorModal(true);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      for (const item of cart) {
        await client.mutate({
          mutation: addToCartMutation,
          variables: {
            productId: parseInt(item.id),
            quantity: item.quantity,
          },
        });
      }

      // 2. build billing/shipping info
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // 3. fire checkout
      await checkoutMutation({
        variables: {
          input: {
            clientMutationId: "checkout-" + Date.now(),
            billing: {
              firstName,
              lastName,
              phone: formData.phone,
              city: formData.city,
              address1: formData.address,
              country: "MA",
            },
            shipping: {
              firstName,
              lastName,
              city: formData.city,
              address1: formData.address,
              country: "MA",
            },
            paymentMethod: "cod",
            customerNote: "Deposit required before shipping.",
          },
        },
      });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setIsProcessing(false);
      setShowErrorModal(true);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FCFAFA] pt-20 pb-24 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-dark/5 text-center">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="text-gold" size={40} />
          </div>
          <h1 className="text-4xl font-serif text-dark mb-4 italic">
            {t("checkout.thank_you")}
          </h1>
          <p className="text-dark/40 leading-relaxed mb-10">
            {t("checkout.order_confirmed")}{" "}
            <span className="text-dark font-bold underline decoration-gold/30">
              {formData.city}
            </span>
            .
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-dark text-cream px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold hover:text-dark transition-all duration-500"
          >
            {t("checkout.return")}{" "}
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAFA] pt-32 pb-24">
      <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-dark/40 hover:text-gold transition-colors mb-12 group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform rtl:rotate-180"
          />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">
            {t("checkout.back")}
          </span>
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-5xl font-serif text-dark mb-4">
                {t("checkout.title")}
              </h1>
              <p className="text-dark/40 text-sm italic font-serif">
                {t("checkout.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-dark/40 ml-1 flex items-center gap-2">
                    <User size={12} className="text-gold" />{" "}
                    {t("checkout.full_name")}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={t("checkout.name_placeholder")}
                    className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all text-sm shadow-sm"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-dark/40 ml-1 flex items-center gap-2">
                    <Phone size={12} className="text-gold" />{" "}
                    {t("checkout.phone")}
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="06 XX XX XX XX"
                    className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all text-sm shadow-sm"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-dark/40 ml-1 flex items-center gap-2">
                    <MapPin size={12} className="text-gold" />{" "}
                    {t("checkout.city")}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={t("checkout.city")}
                    className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all text-sm shadow-sm"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-dark/40 ml-1 flex items-center gap-2">
                  <Package size={12} className="text-gold" />{" "}
                  {t("checkout.full_address")}
                </label>
                <textarea
                  required
                  placeholder={t("checkout.address_placeholder")}
                  rows="4"
                  className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all text-sm shadow-sm resize-none"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="p-8 bg-gold/5 rounded-4xl border border-gold/10 flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Truck className="text-gold" size={24} />
                </div>
                <div>
                  <h4 className="text-[1rem] font-bold text-dark uppercase tracking-widest">
                    {t("checkout.shipping_title")}
                  </h4>
                  <p className="text-[1rem] text-dark/40 mt-1">
                    {t("checkout.shipping_desc")}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-start gap-4">
                <div className="mt-1">
                  <AlertCircle size={16} className="text-red-400" />
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-red-500 uppercase tracking-widest mb-1">
                    {t("checkout.deposit_title")}
                  </h4>
                  <p className="text-[0.9rem] text-dark/60 leading-relaxed">
                    {t("checkout.deposit_desc")}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-dark text-cream py-6 rounded-2xl font-bold  tracking-[0.3em] text-[15px] hover:bg-gold hover:text-dark transition-all duration-500 shadow-xl shadow-dark/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    {t("preloader.loading")}
                  </span>
                ) : (
                  t("checkout.confirm")
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-white border border-black/5 rounded-[40px] p-10 shadow-2xl shadow-dark/2">
              <h2 className="text-xl font-serif text-dark font-bold mb-8">
                {t("checkout.summary")}
              </h2>

              <div className="space-y-6 mb-10 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-cream rounded-xl overflow-hidden shrink-0 border border-black/5">
                      <img
                        src={item.image}
                        alt={getName(item.name)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-dark">
                        {getName(item.name)}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-dark/40 uppercase tracking-widest font-bold">
                          {t("checkout.qty")}: {item.quantity}
                        </span>
                        <span className="text-xs font-serif italic font-bold text-gold">
                          {item.price * item.quantity} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-black/5">
                <div className="flex justify-between text-sm">
                  <span className="text-dark/40">{t("cart.subtotal")}</span>
                  <span className="text-dark font-bold font-serif">
                    {subtotal} MAD
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark/40">{t("cart.shipping")}</span>
                  <span className="text-dark font-bold font-serif">
                    {shippingFee} MAD
                  </span>
                </div>
                <div className="flex justify-between text-xl pt-6 border-t border-black/5 mt-6">
                  <span className="font-serif italic font-bold text-dark">
                    {t("cart.total")}
                  </span>
                  <span className="text-gold font-bold font-serif">
                    {total} MAD
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 py-3 border border-black/5 rounded-xl border-dashed">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[1rem] uppercase font-bold tracking-widest text-dark/40">
                  {t("checkout.available")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FCFAFA] border border-black/5 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} strokeWidth={2} />
            </div>
            <h3 className="font-serif text-2xl text-dark mb-3">
              {t("checkout.error_title")}
            </h3>
            <p className="text-dark/60 mb-8 leading-relaxed text-[1rem]">
              {t("checkout.error_message")}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-dark cursor-pointer text-cream font-bold py-3.5 px-8 rounded-xl hover:bg-gold hover:text-dark transition-all duration-300 tracking-widest uppercase text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
