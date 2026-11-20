"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { userApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { session } from "@/lib/session";
import type { ProfileUpdate, UserProfile } from "@/types";

export const PROFILE_KEY = ["profile"] as const;

export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: userApi.profile,
    initialData: () => {
      const u = session.user;
      if (!u) return undefined;
      return {
        id: u.id,
        email: u.email,
        first_name: u.first_name,
        middle_name: u.middle_name ?? null,
        last_name: u.last_name ?? null,
        full_name: u.full_name,
        gender: (u as any).gender ?? "undisclosed",
        marital_status: (u as any).marital_status ?? "undisclosed",
        language: (u as any).language ?? "bn",
        role: u.role,
        status: u.status,
        avatar_url: u.avatar_url ?? null,
        is_email_verified: u.is_email_verified ?? true,
        is_phone_verified: (u as any).is_phone_verified ?? false,
        auth_providers: u.auth_providers ?? [],
        name_for_numerology: u.full_name,
        call_names: [u.first_name],
        birth: (u as any).birth ?? { date: "", time: "", place_name: "", latitude: 0, longitude: 0, timezone: 5.5 },
        current_location: (u as any).current_location ?? { city: "", state: "", country: "India" },
        notifications: (u as any).notifications ?? { email_enabled: true, push_enabled: true, sms_enabled: false },
        addresses: (u as any).addresses ?? [],
        created_at: u.created_at,
        updated_at: u.created_at,
      } as unknown as UserProfile;
    },
    enabled: options?.enabled,
  });
}

/** Shared by every profile form, so success and failure behave the same way. */
export function useUpdateProfile(options?: { successMessage?: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ProfileUpdate) => userApi.updateProfile(body),
    onSuccess: (profile: UserProfile) => {
      queryClient.setQueryData(PROFILE_KEY, profile);
      toast.success(options?.successMessage ?? "Saved.");
    },
    onError: (error: ApiError) => {
      // A 422 is shown inline against the field, not as a toast.
      if (error.status !== 422) toast.error(error.message);
    },
  });
}
