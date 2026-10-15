"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { userApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { ProfileUpdate, UserProfile } from "@/types";

export const PROFILE_KEY = ["profile"] as const;

export function useProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: userApi.profile });
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
