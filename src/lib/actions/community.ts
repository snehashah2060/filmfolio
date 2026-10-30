"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { Profile } from "@/types/database";

export async function toggleFollowAction(targetUserId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      if (user.id === targetUserId) {
        return { success: false, error: "Cannot follow yourself" };
      }

      const { data: existing } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .single();

      if (existing) {
        await supabase.from("follows").delete().eq("id", existing.id);
        revalidatePath(`/community/users`);
        return { success: true, isFollowing: false };
      } else {
        await supabase.from("follows").insert({
          follower_id: user.id,
          following_id: targetUserId,
        });
        revalidatePath(`/community/users`);
        return { success: true, isFollowing: true };
      }
    }

    const isFollowing = filmfolioStore.toggleFollow(targetUserId);
    revalidatePath(`/community/users`);
    return { success: true, isFollowing };
  } catch (error) {
    console.error("toggleFollowAction error:", error);
    return { success: false, error: "Failed to update follow relationship" };
  }
}

export async function getPublicProfileAction(username: string): Promise<Profile | null> {
  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio, favourite_genres, profile_visibility, created_at, role, is_suspended")
      .ilike("username", username)
      .eq("profile_visibility", "PUBLIC")
      .single();

    return data as Profile | null;
  }

  return filmfolioStore.getUserByUsername(username) || null;
}

export async function getCommunityActivityAction() {
  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("activity_logs")
      .select("*, user:profiles(id, username, full_name, avatar_url)")
      .eq("visibility", "PUBLIC")
      .order("created_at", { ascending: false })
      .limit(20);

    return data || [];
  }

  return filmfolioStore.getActivityLogs(20);
}
