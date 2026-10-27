"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useProfile, PROFILE_KEY } from "@/hooks/use-profile";
import { userApi } from "@/lib/api";
import type { AstrologyLanguage } from "@/types";

export const LANGUAGE_STORAGE_KEY = "divinlink_preferred_language";
export const LEGACY_STORAGE_KEY = "astra_preferred_language";

export interface LanguageOption {
  code: AstrologyLanguage;
  nameEn: string;
  nameNative: string;
  taglineEn: string;
  taglineNative: string;
  badge: string;
  flagSymbol: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: "bn",
    nameEn: "Bengali",
    nameNative: "বাংলা",
    taglineEn: "Vedic charts, reports & predictions in Bengali",
    taglineNative: "সমস্ত ফিচার ও জ্যোতিষ বিশ্লেষণ সম্পূর্ণ বাংলায়",
    badge: "বাংলা",
    flagSymbol: "🇧🇩",
  },
  {
    code: "en",
    nameEn: "English",
    nameNative: "English",
    taglineEn: "All features, charts & calculations in English",
    taglineNative: "Comprehensive reports & analysis in English",
    badge: "ENG",
    flagSymbol: "🌐",
  },
  {
    code: "hi",
    nameEn: "Hindi",
    nameNative: "हिन्दी",
    taglineEn: "Vedic Kundli, Panchang & Shastra in Hindi",
    taglineNative: "सभी फीचर्स एवं विश्लेषण पूर्णतः हिंदी में",
    badge: "हिन्दी",
    flagSymbol: "🇮🇳",
  },
];

interface LanguageContextValue {
  language: AstrologyLanguage;
  setLanguage: (lang: AstrologyLanguage, options?: { silent?: boolean }) => Promise<void>;
  isLoaded: boolean;
  availableLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function isValidLanguage(val: unknown): val is AstrologyLanguage {
  return val === "en" || val === "bn" || val === "hi";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  const [language, setLanguageState] = React.useState<AstrologyLanguage>("bn");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const isUpdatingRef = React.useRef(false);

  // 1. Initial hydration from localStorage
  React.useEffect(() => {
    try {
      const stored =
        localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);
      if (isValidLanguage(stored)) {
        setLanguageState(stored);
      }
    } catch {
      // Storage unavailable or disabled
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Synchronize from user's backend profile once loaded
  React.useEffect(() => {
    if (profile?.language && isValidLanguage(profile.language)) {
      setLanguageState(profile.language);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
        localStorage.setItem(LEGACY_STORAGE_KEY, profile.language);
      } catch {}
    }
  }, [profile?.language]);

  // 3. Cross-tab & window event synchronization
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === LANGUAGE_STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) && isValidLanguage(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<AstrologyLanguage>;
      if (customEvent.detail && isValidLanguage(customEvent.detail)) {
        setLanguageState(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("divinlink_language_changed", handleCustomChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("divinlink_language_changed", handleCustomChange);
    };
  }, []);

  const setLanguage = React.useCallback(
    async (newLang: AstrologyLanguage, options?: { silent?: boolean }) => {
      if (!isValidLanguage(newLang)) return;

      // Update local state immediately for instant responsive UI
      setLanguageState(newLang);

      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        localStorage.setItem(LEGACY_STORAGE_KEY, newLang);
      } catch {}

      // Broadcast to other components & tabs
      try {
        window.dispatchEvent(
          new CustomEvent<AstrologyLanguage>("divinlink_language_changed", {
            detail: newLang,
          }),
        );
      } catch {}

      // If user is authenticated, persist to MongoDB via backend API
      if (isSignedIn && !isUpdatingRef.current) {
        isUpdatingRef.current = true;
        try {
          const updated = await userApi.updateProfile({ language: newLang });
          queryClient.setQueryData(PROFILE_KEY, updated);

          if (!options?.silent) {
            const langLabel =
              newLang === "bn"
                ? "বাংলা (Bengali)"
                : newLang === "hi"
                ? "हिन्दी (Hindi)"
                : "English";
            toast.success(
              newLang === "bn"
                ? `পছন্দের ভাষা ${langLabel} হিসেবে সংরক্ষিত হয়েছে`
                : newLang === "hi"
                ? `प्राथमिक भाषा ${langLabel} के रूप में सहेजी गई`
                : `Preferred language set to ${langLabel}`,
            );
          }
        } catch (err) {
          console.error("Failed to update profile language preference:", err);
        } finally {
          isUpdatingRef.current = false;
        }
      } else if (!options?.silent) {
        const langLabel =
          newLang === "bn"
            ? "বাংলা"
            : newLang === "hi"
            ? "हिन्दी"
            : "English";
        toast.success(
          newLang === "bn"
            ? `ভাষা পরিবর্তন করা হয়েছে: ${langLabel}`
            : newLang === "hi"
            ? `भाषा बदलकर ${langLabel} कर दी गई है`
            : `Language switched to ${langLabel}`,
        );
      }
    },
    [isSignedIn, queryClient],
  );

  const currentLanguageOption = React.useMemo(() => {
    return (
      AVAILABLE_LANGUAGES.find((opt) => opt.code === language) ||
      AVAILABLE_LANGUAGES[0]
    );
  }, [language]);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      isLoaded,
      availableLanguages: AVAILABLE_LANGUAGES,
      currentLanguageOption,
    }),
    [language, setLanguage, isLoaded, currentLanguageOption],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    return {
      language: "bn" as AstrologyLanguage,
      setLanguage: async () => {},
      isLoaded: true,
      availableLanguages: AVAILABLE_LANGUAGES,
      currentLanguageOption: AVAILABLE_LANGUAGES[0],
    };
  }
  return context;
}
