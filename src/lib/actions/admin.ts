"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { ModerationStatus } from "@/types/database";

export async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If running in demo mode without live supabase, check demo user role
    const demoUser = filmfolioStore.getCurrentUser();
    return demoUser.role === "ADMIN";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("id", user.id)
    .single();

  return profile?.role === "ADMIN" && !profile?.is_suspended;
}

export async function getAdminStatsAction() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized access to admin actions");
  }

  const users = filmfolioStore.getAllUsers();
  const library = filmfolioStore.getUserMovies();
  const reviews = filmfolioStore.getReviews();
  const collections = filmfolioStore.getCollections({ publicOnly: true });

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => !u.is_suspended).length,
    totalMoviesTracked: library.length,
    totalReviews: reviews.length,
    totalPublicCollections: collections.length,
    recentRegistrations: users.slice(0, 5),
  };
}

export async function toggleUserSuspensionAction(userId: string, suspend: boolean) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    await supabase
      .from("profiles")
      .update({ is_suspended: suspend })
      .eq("id", userId);
  } else {
    filmfolioStore.toggleSuspension(userId, suspend);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { success: true };
}

export async function moderateReviewAction(reviewId: string, status: ModerationStatus) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    await supabase
      .from("reviews")
      .update({ moderation_status: status })
      .eq("id", reviewId);
  } else {
    filmfolioStore.updateReview(reviewId, { moderation_status: status });
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/community");
  return { success: true };
}
