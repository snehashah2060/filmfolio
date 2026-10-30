import {
  DetailedMovie,
  TMDBGenre,
  TMDBGenresResponse,
  TMDBMovie,
  TMDBPaginatedResponse,
  TMDBCredits,
  TMDBVideosResponse,
} from "@/types/tmdb";
import { REAL_TMDB_MOVIES, TMDB_GENRES } from "./curated-data";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json;charset=utf-8",
  };
}

async function tmdbFetch<T>(endpoint: string, revalidate: number = 3600): Promise<T | null> {
  const headers = getHeaders();
  if (!headers) {
    return null; // Token not set, will use fallback curated data
  }

  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
      headers,
      next: { revalidate },
    });

    if (!res.ok) {
      console.warn(`TMDB API error ${res.status} on endpoint: ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`TMDB fetch error for ${endpoint}:`, error);
    return null;
  }
}

export const tmdbService = {
  isConfigured(): boolean {
    return Boolean(process.env.TMDB_ACCESS_TOKEN);
  },

  async getTrending(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/trending/movie/week?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    // Fallback curated movies
    const start = (page - 1) * 8;
    const paginated = REAL_TMDB_MOVIES.slice(start, start + 8);
    return {
      page,
      results: paginated,
      total_pages: Math.ceil(REAL_TMDB_MOVIES.length / 8),
      total_results: REAL_TMDB_MOVIES.length,
    };
  },

  async getPopular(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/popular?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    const sorted = [...REAL_TMDB_MOVIES].sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
    const start = (page - 1) * 8;
    return {
      page,
      results: sorted.slice(start, start + 8),
      total_pages: Math.ceil(sorted.length / 8),
      total_results: sorted.length,
    };
  },

  async getTopRated(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/top_rated?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    const sorted = [...REAL_TMDB_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    const start = (page - 1) * 8;
    return {
      page,
      results: sorted.slice(start, start + 8),
      total_pages: Math.ceil(sorted.length / 8),
      total_results: sorted.length,
    };
  },

  async getUpcoming(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/upcoming?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    const upcoming = REAL_TMDB_MOVIES.filter(m => new Date(m.release_date) >= new Date("2024-01-01"));
    const results = upcoming.length > 0 ? upcoming : REAL_TMDB_MOVIES.slice(0, 4);
    return {
      page,
      results,
      total_pages: 1,
      total_results: results.length,
    };
  },

  async getNowPlaying(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/now_playing?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    return {
      page,
      results: REAL_TMDB_MOVIES.slice(0, 6),
      total_pages: 1,
      total_results: 6,
    };
  },

  async searchMovies(query: string, page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    if (!query || query.trim() === "") {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const encoded = encodeURIComponent(query.trim());
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/search/movie?query=${encoded}&page=${page}&include_adult=false`
    );
    if (remote && remote.results) return remote;

    const lower = query.toLowerCase();
    const matched = REAL_TMDB_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(lower) ||
        (m.original_title && m.original_title.toLowerCase().includes(lower)) ||
        (m.overview && m.overview.toLowerCase().includes(lower))
    );

    return {
      page: 1,
      results: matched,
      total_pages: 1,
      total_results: matched.length,
    };
  },

  async getMovieDetails(id: number | string): Promise<DetailedMovie | null> {
    const numericId = Number(id);
    const remote = await tmdbFetch<DetailedMovie>(
      `/movie/${numericId}?append_to_response=credits,videos,recommendations,similar`
    );

    if (remote) {
      const director = remote.credits?.crew?.find(
        (c) => c.job === "Director" || c.department === "Directing"
      )?.name;
      return {
        ...remote,
        director: director || "Unknown Director",
      };
    }

    // Match in curated movies
    const found = REAL_TMDB_MOVIES.find((m) => m.id === numericId);
    if (found) {
      // populate recommendations and similar from remaining movies
      const others = REAL_TMDB_MOVIES.filter((m) => m.id !== numericId);
      return {
        ...found,
        recommendations: {
          page: 1,
          results: others.slice(0, 6),
          total_pages: 1,
          total_results: others.length,
        },
        similar: {
          page: 1,
          results: others.slice(2, 8),
          total_pages: 1,
          total_results: others.length,
        },
      };
    }

    // If ID not found directly, return first curated movie as a resilient preview
    if (REAL_TMDB_MOVIES[0]) {
      return {
        ...REAL_TMDB_MOVIES[0],
        id: numericId || REAL_TMDB_MOVIES[0].id,
      };
    }

    return null;
  },

  async getMovieCredits(id: number | string): Promise<TMDBCredits | null> {
    const remote = await tmdbFetch<TMDBCredits>(`/movie/${id}/credits`);
    if (remote) return remote;

    const movie = REAL_TMDB_MOVIES.find((m) => m.id === Number(id));
    return movie?.credits ?? { id: Number(id), cast: [], crew: [] };
  },

  async getMovieVideos(id: number | string): Promise<TMDBVideosResponse | null> {
    const remote = await tmdbFetch<TMDBVideosResponse>(`/movie/${id}/videos`);
    if (remote) return remote;

    const movie = REAL_TMDB_MOVIES.find((m) => m.id === Number(id));
    return movie?.videos ?? { id: Number(id), results: [] };
  },

  async getMovieRecommendations(id: number | string, page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${id}/recommendations?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    const others = REAL_TMDB_MOVIES.filter((m) => m.id !== Number(id));
    return {
      page: 1,
      results: others.slice(0, 6),
      total_pages: 1,
      total_results: others.length,
    };
  },

  async getMovieSimilar(id: number | string, page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    const remote = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${id}/similar?page=${page}`
    );
    if (remote && remote.results?.length > 0) return remote;

    const others = REAL_TMDB_MOVIES.filter((m) => m.id !== Number(id));
    return {
      page: 1,
      results: others.slice(2, 8),
      total_pages: 1,
      total_results: others.length,
    };
  },

  async getGenres(): Promise<TMDBGenre[]> {
    const remote = await tmdbFetch<TMDBGenresResponse>("/genre/movie/list");
    if (remote && remote.genres?.length > 0) return remote.genres;
    return TMDB_GENRES;
  },
};
