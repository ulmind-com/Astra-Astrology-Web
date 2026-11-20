import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { shopApi, type CartItemIn, type CartItemOut, type CartOut, type ShopProduct } from "@/lib/api";
import { session, onSessionChange } from "@/lib/session";

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
  isSyncing: boolean;

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
  syncWithServer: () => Promise<void>;
  refreshFromServer: () => Promise<void>;

  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getCashbackCoins: () => number;
  getBundledGifts: () => { title: string; value: number; badge?: string }[];
}

function mapServerItemToCartItem(item: CartItemOut): CartItem {
  return {
    id: item.id,
    slug: item.slug,
    sku: item.sku,
    title: item.title,
    price: item.price,
    mrp: item.mrp,
    image: item.image,
    quantity: item.quantity,
    free_gift_title: item.free_gift_title,
    free_gift_value: item.free_gift_value,
    free_gift_badge: item.free_gift_badge,
    free_gift_image_url: item.free_gift_image_url,
    cashback_percent: item.cashback_percent ?? 100,
    sankalpa: item.sankalpa || undefined,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,
      isSyncing: false,

      openCart: () => {
        set({ isOpen: true });
        // Refresh latest items from server if signed in
        if (typeof window !== "undefined" && session.isSignedIn) {
          get().refreshFromServer().catch(() => {});
        }
      },

      closeCart: () => set({ isOpen: false }),

      toggleCart: () => {
        const nextOpen = !get().isOpen;
        set({ isOpen: nextOpen });
        if (nextOpen && typeof window !== "undefined" && session.isSignedIn) {
          get().refreshFromServer().catch(() => {});
        }
      },

      addItem: (product, quantity = 1, sankalpa) => {
        // 1. Instant optimistic local update
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

        // 2. Background server synchronization for authenticated users
        if (typeof window !== "undefined" && session.isSignedIn) {
          shopApi
            .addCartItem(product.id, quantity, sankalpa)
            .then((res) => {
              if (res && res.items) {
                set({
                  items: res.items.map(mapServerItemToCartItem),
                  couponCode: res.coupon_code || null,
                  discountAmount: res.discount_amount || 0,
                });
              }
            })
            .catch((err) => {
              console.warn("[CartSync] Background add item failed:", err);
            });
        }
      },

      removeItem: (productId) => {
        // 1. Instant optimistic local update
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));

        // 2. Background server synchronization
        if (typeof window !== "undefined" && session.isSignedIn) {
          shopApi
            .removeCartItem(productId)
            .then((res) => {
              if (res && res.items) {
                set({
                  items: res.items.map(mapServerItemToCartItem),
                  couponCode: res.coupon_code || null,
                  discountAmount: res.discount_amount || 0,
                });
              }
            })
            .catch((err) => {
              console.warn("[CartSync] Background remove item failed:", err);
            });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // 1. Instant optimistic local update
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));

        // 2. Background server synchronization
        if (typeof window !== "undefined" && session.isSignedIn) {
          shopApi
            .updateCartItem(productId, quantity)
            .then((res) => {
              if (res && res.items) {
                set({
                  items: res.items.map(mapServerItemToCartItem),
                  couponCode: res.coupon_code || null,
                  discountAmount: res.discount_amount || 0,
                });
              }
            })
            .catch((err) => {
              console.warn("[CartSync] Background update quantity failed:", err);
            });
        }
      },

      updateSankalpa: (productId, sankalpa) => {
        // 1. Instant optimistic local update
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, sankalpa } : item
          ),
        }));

        // 2. Background server synchronization
        if (typeof window !== "undefined" && session.isSignedIn) {
          const currentItem = get().items.find((item) => item.id === productId);
          const qty = currentItem ? currentItem.quantity : 1;
          shopApi
            .updateCartItem(productId, qty, sankalpa)
            .then((res) => {
              if (res && res.items) {
                set({
                  items: res.items.map(mapServerItemToCartItem),
                  couponCode: res.coupon_code || null,
                  discountAmount: res.discount_amount || 0,
                });
              }
            })
            .catch((err) => {
              console.warn("[CartSync] Background update sankalpa failed:", err);
            });
        }
      },

      setCoupon: (code, discount = 0) => {
        // 1. Instant optimistic local update
        set({ couponCode: code, discountAmount: discount });

        // 2. Background server synchronization
        if (typeof window !== "undefined" && session.isSignedIn) {
          shopApi
            .applyCartCoupon(code)
            .then((res) => {
              if (res) {
                set({
                  couponCode: res.coupon_code || null,
                  discountAmount: res.discount_amount || 0,
                });
              }
            })
            .catch((err) => {
              console.warn("[CartSync] Background apply coupon failed:", err);
            });
        }
      },

      clearCart: () => {
        // 1. Instant optimistic local update
        set({ items: [], couponCode: null, discountAmount: 0 });

        // 2. Background server synchronization
        if (typeof window !== "undefined" && session.isSignedIn) {
          shopApi.clearCart().catch((err) => {
            console.warn("[CartSync] Background clear cart failed:", err);
          });
        }
      },

      syncWithServer: async () => {
        if (typeof window === "undefined" || !session.isSignedIn) return;

        try {
          set({ isSyncing: true });
          const localItems: CartItemIn[] = get().items.map((it) => ({
            product_id: it.id,
            quantity: it.quantity,
            sankalpa: it.sankalpa,
          }));

          const res = await shopApi.syncCart(localItems, get().couponCode);
          if (res && res.items) {
            set({
              items: res.items.map(mapServerItemToCartItem),
              couponCode: res.coupon_code || null,
              discountAmount: res.discount_amount || 0,
              isSyncing: false,
            });
          }
        } catch (err) {
          console.warn("[CartSync] Server sync error:", err);
          set({ isSyncing: false });
        }
      },

      refreshFromServer: async () => {
        if (typeof window === "undefined" || !session.isSignedIn) return;

        try {
          set({ isSyncing: true });
          const res = await shopApi.getCart();
          if (res && res.items) {
            set({
              items: res.items.map(mapServerItemToCartItem),
              couponCode: res.coupon_code || null,
              discountAmount: res.discount_amount || 0,
              isSyncing: false,
            });
          }
        } catch (err) {
          console.warn("[CartSync] Refresh from server error:", err);
          set({ isSyncing: false });
        }
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
            (sum, item) => sum + item.price * item.quantity * (item.cashback_percent / 100),
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

// ===========================================================================
// Automatic Lifecycle Listeners for Instant Multi-Device Sync
// ===========================================================================
if (typeof window !== "undefined") {
  // 1. Initial hydration sync when visitor enters the app
  setTimeout(() => {
    if (session.isSignedIn) {
      useCartStore.getState().syncWithServer().catch(() => {});
    }
  }, 200);

  // 2. React to Login / Logout / Token refresh events
  onSessionChange(() => {
    if (session.isSignedIn) {
      useCartStore.getState().syncWithServer().catch(() => {});
    }
  });

  // 3. Multi-device window focus / tab visibility sync
  let lastSyncAt = 0;
  const handleTabFocus = () => {
    const now = Date.now();
    // Do not abruptly refresh cart if visitor is on the checkout page actively completing a payment
    if (typeof window !== "undefined" && window.location.pathname.includes("/checkout")) {
      return;
    }
    // Throttle focus refreshes to once every 10 seconds to save bandwidth
    if (session.isSignedIn && !document.hidden && now - lastSyncAt > 10000) {
      lastSyncAt = now;
      useCartStore.getState().refreshFromServer().catch(() => {});
    }
  };

  window.addEventListener("focus", handleTabFocus);
  document.addEventListener("visibilitychange", handleTabFocus);
}
