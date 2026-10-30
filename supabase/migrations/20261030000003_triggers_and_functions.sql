-- ========================================================
-- FILMFOLIO TRIGGERS, FUNCTIONS & AUTOMATION
-- ========================================================

-- Function to update the updated_at column automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_movies_updated_at ON public.movies;
CREATE TRIGGER set_movies_updated_at
BEFORE UPDATE ON public.movies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_user_movies_updated_at ON public.user_movies;
CREATE TRIGGER set_user_movies_updated_at
BEFORE UPDATE ON public.user_movies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_custom_collections_updated_at ON public.custom_collections;
CREATE TRIGGER set_custom_collections_updated_at
BEFORE UPDATE ON public.custom_collections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_diary_entries_updated_at ON public.diary_entries;
CREATE TRIGGER set_diary_entries_updated_at
BEFORE UPDATE ON public.diary_entries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- Trigger function for new user registration in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INT := 0;
BEGIN
    -- Extract desired username or generate from email
    base_username := COALESCE(
        LOWER(TRIM(NEW.raw_user_meta_data->>'username')),
        LOWER(SPLIT_PART(NEW.email, '@', 1))
    );
    -- Sanitize username (alphanumeric and underscores)
    base_username := REGEXP_REPLACE(base_username, '[^a-z0-9_]', '', 'g');
    IF LENGTH(base_username) < 3 THEN
        base_username := 'cinephile_' || SUBSTRING(NEW.id::text, 1, 6);
    END IF;

    final_username := base_username;

    -- Ensure unique username
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || counter::text;
    END LOOP;

    -- Strict security requirement: ALWAYS assign 'USER' role on public sign up
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url,
        bio,
        role,
        is_suspended,
        favourite_genres,
        profile_visibility
    )
    VALUES (
        NEW.id,
        final_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', INITCAP(REPLACE(base_username, '_', ' '))),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        COALESCE(NEW.raw_user_meta_data->>'bio', 'Passionate cinema lover on Filmfolio.'),
        'USER',
        FALSE,
        '[]'::jsonb,
        'PUBLIC'
    );

    RETURN NEW;
END;
$$;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
