import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShopProduct } from "@/lib/api";

export interface CartItem {
  id: string; // Product ID
  slug: string;
  sku: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  free_gift_title?: string | null;
  free_gift_value?: number | null;
  free_gift_badge?: string | null;
  free_gift_image_url?: string | null;
  cashback_percent: number;
  sankalpa?: {
    devotee_name?: string;
    gotra?: string;
    date_of_birth?: string;
    birth_time?: string;
    birth_place?: string;
    special_prayer_wish?: string;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountAmount: number;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: ShopProduct, quantity?: number, sankalpa?: CartItem["sankalpa"]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSankalpa: (productId: string, sankalpa: CartItem["sankalpa"]) => void;
  setCoupon: (code: string | null, discount?: number) => void;
  clearCart: () => void;

  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getCashbackCoins: () => number;
  getBundledGifts: () => { title: string; value: number; badge?: string }[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, sankalpa) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === product.id);
          const effectiveCashback = product.cashback_percent ?? 100;
          const giftTitle = product.free_gift_title || "Raw Selenite Charging Plate";
          const giftVal = product.free_gift_value || 729;
          const giftBadge = product.free_gift_badge || "FREE Raw Selenite Plate worth ₹729";

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: currentItem.quantity + quantity,
              sankalpa: sankalpa || currentItem.sankalpa,
            };
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            title: product.title,
            price: product.sale_price,
            mrp: product.mrp,
            image: product.featured_image,
            quantity,
            free_gift_title: giftTitle,
            free_gift_value: giftVal,
            free_gift_badge: giftBadge,
            free_gift_image_url: product.free_gift_image_url,
            cashback_percent: effectiveCashback,
            sankalpa,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      updateSankalpa: (productId, sankalpa) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, sankalpa } : item
          ),
        }));
      },

      setCoupon: (code, discount = 0) => {
        set({ couponCode: code, discountAmount: discount });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountAmount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getCashbackCoins: () => {
        // 100% wallet cashback = 1 coin per ₹1 paid
        return Math.round(
          get().items.reduce(
            (sum, item) => sum + (item.price * item.quantity * (item.cashback_percent / 100)),
            0
          )
        );
      },

      getBundledGifts: () => {
        const gifts: { title: string; value: number; badge?: string }[] = [];
        get().items.forEach((item) => {
          if (item.free_gift_title && !gifts.some((g) => g.title === item.free_gift_title)) {
            gifts.push({
              title: item.free_gift_title,
              value: item.free_gift_value || 729,
              badge: item.free_gift_badge || undefined,
            });
          }
        });
        return gifts;
      },
    }),
    {
      name: "astra_shop_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
