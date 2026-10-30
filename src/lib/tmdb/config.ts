export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export const TMDB_POSTER_SIZES = {
  sm: "w185",
  md: "w342",
  lg: "w500",
  original: "original",
} as const;

export const TMDB_BACKDROP_SIZES = {
  sm: "w300",
  md: "w780",
  lg: "w1280",
  original: "original",
} as const;

export const TMDB_PROFILE_SIZES = {
  sm: "w45",
  md: "w185",
  lg: "h632",
} as const;

export function getTMDBPosterUrl(
  path: string | null | undefined,
  size: keyof typeof TMDB_POSTER_SIZES = "lg"
): string {
  if (!path) return "/images/placeholder-poster.png";
  return `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZES[size]}${path}`;
}

export function getTMDBBackdropUrl(
  path: string | null | undefined,
  size: keyof typeof TMDB_BACKDROP_SIZES = "lg"
): string {
  if (!path) return "/images/placeholder-backdrop.png";
  return `${TMDB_IMAGE_BASE_URL}${TMDB_BACKDROP_SIZES[size]}${path}`;
}

export function getTMDBProfileUrl(
  path: string | null | undefined,
  size: keyof typeof TMDB_PROFILE_SIZES = "md"
): string {
  if (!path) return "/images/placeholder-avatar.png";
  return `${TMDB_IMAGE_BASE_URL}${TMDB_PROFILE_SIZES[size]}${path}`;
}
