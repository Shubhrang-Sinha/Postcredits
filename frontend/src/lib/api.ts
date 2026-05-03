const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Request failed");
  }

  return response.json();
}

export const getPopularMovies = (limit: number) => fetchFromAPI(`/movies?limit=${limit}`);
export const getPopularBooks = (limit: number) => fetchFromAPI(`/books?limit=${limit}`);

export const getMovieRecommendations = (limit: number) => fetchFromAPI(`/recommendations/blend?type=movie&limit=${limit}`);
export const getBookRecommendations = (limit: number) => fetchFromAPI(`/recommendations/blend?type=book&limit=${limit}`);

export const getTrendingMovies = (limit: number) => fetchFromAPI(`/movies?limit=${limit}`);
export const getTrendingBooks = (limit: number) => fetchFromAPI(`/books?limit=${limit}`);

export const loginUser = (credentials: object) => fetchFromAPI('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

export const registerUser = (userInfo: object) => fetchFromAPI('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userInfo)
});

