import { create } from 'zustand';
import api from '../lib/axios';

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data.cart, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/cart/items', { productId, quantity });
      set({ cart: data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateCartItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
      set({ cart: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      set({ cart: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: null });
    } catch (error) {
      set({ error: error.response?.data?.message });
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
