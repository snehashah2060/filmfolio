-- ========================================================
-- FILMFOLIO DATABASE SECURITY & ROW LEVEL SECURITY (RLS)
-- ========================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Secure admin check function avoiding recursive policy evaluation
CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uid AND role = 'ADMIN' AND is_suspended = FALSE
  );
$$;

-- --------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (profile_visibility = 'PUBLIC' OR auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Prevent privilege escalation: non-admins cannot change role or is_suspended
  AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin(auth.uid()))
  AND (is_suspended = (SELECT is_suspended FROM public.profiles WHERE id = auth.uid()) OR public.is_admin(auth.uid()))
);

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------
-- MOVIES POLICIES (Shared movie metadata)
-- --------------------------------------------------------
CREATE POLICY "Movies metadata is viewable by all users"
ON public.movies FOR SELECT
USING (true);

CREATE POLICY "Authenticated users and services can insert movie metadata"
ON public.movies FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update movie metadata"
ON public.movies FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- --------------------------------------------------------
-- USER_MOVIES POLICIES (Personal Library)
-- --------------------------------------------------------
CREATE POLICY "Users can view their own library entries"
ON public.user_movies FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own library entries"
ON public.user_movies FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own library entries"
ON public.user_movies FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own library entries"
ON public.user_movies FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- WATCHLIST POLICIES
-- --------------------------------------------------------
CREATE POLICY "Users can view their own watchlist"
ON public.watchlist FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert into their own watchlist"
ON public.watchlist FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist entries"
ON public.watchlist FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist"
ON public.watchlist FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- FAVORITES POLICIES
-- --------------------------------------------------------
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- REVIEWS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Public approved reviews are viewable by all"
ON public.reviews FOR SELECT
USING (
  (visibility = 'PUBLIC' AND moderation_status = 'APPROVED')
  OR auth.uid() = user_id
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can create their own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Owners and admins can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- --------------------------------------------------------
-- CUSTOM COLLECTIONS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Public collections are viewable by all"
ON public.custom_collections FOR SELECT
USING (
  visibility = 'PUBLIC'
  OR auth.uid() = user_id
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can create collections"
ON public.custom_collections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their collections"
ON public.custom_collections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their collections"
ON public.custom_collections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- COLLECTION MOVIES POLICIES
-- --------------------------------------------------------
CREATE POLICY "Collection movies are viewable if collection is viewable"
ON public.collection_movies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.custom_collections c
    WHERE c.id = collection_id
    AND (c.visibility = 'PUBLIC' OR c.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

CREATE POLICY "Collection owners can manage items in collections"
ON public.collection_movies FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.custom_collections c
    WHERE c.id = collection_id AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.custom_collections c
    WHERE c.id = collection_id AND c.user_id = auth.uid()
  )
);

-- --------------------------------------------------------
-- DIARY ENTRIES POLICIES (Owner only)
-- --------------------------------------------------------
CREATE POLICY "Users have private access to their own diary entries"
ON public.diary_entries FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------
-- FOLLOWS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Follows relationships are viewable by all"
ON public.follows FOR SELECT
USING (true);

CREATE POLICY "Users can manage their following actions"
ON public.follows FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id);

CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE
TO authenticated
USING (auth.uid() = follower_id);

-- --------------------------------------------------------
-- REVIEW LIKES POLICIES
-- --------------------------------------------------------
CREATE POLICY "Review likes are viewable by all"
ON public.review_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like reviews"
ON public.review_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their like"
ON public.review_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- ACTIVITY LOGS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Activity logs are viewable based on visibility"
ON public.activity_logs FOR SELECT
USING (
  visibility = 'PUBLIC'
  OR auth.uid() = user_id
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can insert their own activity logs"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Recipients can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = recipient_id);

CREATE POLICY "Recipients can mark notifications as read"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);
