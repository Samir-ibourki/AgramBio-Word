import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      shippingFee: 35,
      isCartOpen: false,

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, newQuantity) => {
        if (newQuantity < 1) return;
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getSubtotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        return get().getSubtotal() + get().shippingFee;
      },
    }),
    {
      name: 'agrambio-cart-storage',
    }
  )
);
