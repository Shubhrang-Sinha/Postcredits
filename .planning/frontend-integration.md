# Frontend Integration Analysis

**Analysis Date:** 2026-04-30

This document maps the Postcredits UI mockup to the existing backend API endpoints and provides guidance for frontend implementation.

---

## 1. UI Section → API Endpoint Mapping

### 1.1 Authentication (Global)

| UI Component     | API Endpoint     | Method | Notes                         |
| ---------------- | ---------------- | ------ | ----------------------------- |
| Login page       | `/auth/login`    | POST   | Returns JWT token + user info |
| Register page    | `/auth/register` | POST   | Returns JWT token + userId    |
| Logout button    | `/auth/logout`   | POST   | Clears session                |
| User avatar/menu | `/auth/me`       | GET    | Returns user profile          |

**Implementation Notes:**

- Store JWT in secure httpOnly cookie or localStorage with XSS protection
- Token expiry: 7 days (check `auth.ts` line 7)
- Include token in Authorization header: `Bearer <token>`

---

### 1.2 Navigation

| UI Component              | API Endpoint     | Method | Notes                              |
| ------------------------- | ---------------- | ------ | ---------------------------------- |
| Side nav - Home           | No API (static)  | —      | Landing page with featured content |
| Side nav - Movies         | `/movies`        | GET    | Paginated movie list               |
| Side nav - Series (Books) | `/books`         | GET    | Paginated book list                |
| Side nav - Watchlist      | `/ratings`       | GET    | Filter: user's rated items         |
| Mobile bottom nav         | Same as side nav | —      | Same routes, adapted UI            |

**Implementation Notes:**

- `/ratings` returns user's ratings (can serve as watchlist)
- Consider adding `?type=movie` or `?type=book` to filter watchlist

---

### 1.3 Hero Section (Featured Content)

| UI Component            | API Endpoint                                | Method | Notes                                          |
| ----------------------- | ------------------------------------------- | ------ | ---------------------------------------------- |
| Featured movie/showcase | `/recommendations/blend?type=movie&limit=1` | GET    | User's top recommendation                      |
| Fallback: Trending      | `/movies?limit=1`                           | GET    | If no personalized data                        |
| Background image        | Embed in work object                        | —      | Requires poster_url field (missing - see gaps) |

**Data Transformation:**

```typescript
// API returns: { work_id, title, work_type, average_rating, similarity }
// UI needs: { id, title, type, rating, backdropUrl, year }
function transformHeroItem(item: any): HeroItem {
  return {
    id: item.work_id,
    title: item.title,
    type: item.work_type, // 'movie' or 'book'
    rating: item.average_rating,
    year: item.release_year, // not in current response
    backdropUrl: null, // needs DB/API extension
  };
}
```

---

### 1.4 Genre Filter Chips

| UI Component | API Endpoint | Method | Notes                    |
| ------------ | ------------ | ------ | ------------------------ |
| Genre chips  | `/genres`    | GET    | All genres for filtering |

**Data Transformation:**

```typescript
// API returns: [{ genre_id: number, name: string }]
// UI needs: { id: number, label: string, active: boolean }

function transformGenres(genres: any[]): GenreChip[] {
  return genres.map((g) => ({
    id: g.genre_id,
    label: g.name,
    active: false,
  }));
}
```

**Missing API Capability:**

- No endpoint to get works by multiple genres
- Current `/movies?genre=X` supports only single genre
- Recommendation: Add query param support for comma-separated genre IDs

---

### 1.5 Carousels

#### Trending Now (Movies)

| UI Component   | API Endpoint       | Method | Notes                              |
| -------------- | ------------------ | ------ | ---------------------------------- |
| Carousel items | `/movies?limit=10` | GET    | Ordered by title (add rating sort) |

**Data Transformation:**

```typescript
// API returns: [{ movie_id, work_id, title, release_year, duration, director_name, average_rating, genres: [] }]
// UI needs: { id, title, year, duration, director, rating, posterUrl, genres }

function transformMovie(movie: any): CarouselItem {
  return {
    id: movie.movie_id || movie.work_id,
    title: movie.title,
    year: movie.release_year,
    duration: movie.duration,
    director: movie.director_name,
    rating: movie.average_rating,
    posterUrl: null, // needs poster_url field
    genres: movie.genres,
  };
}
```

#### Trending in the Vault (Books + Movies combined)

| UI Component   | API Endpoint                               | Method | Notes                           |
| -------------- | ------------------------------------------ | ------ | ------------------------------- |
| Mixed carousel | `/recommendations/blend?type=all&limit=10` | GET    | Collaborative filtering results |

**Data Transformation:**

```typescript
// API returns: [{ work_id, title, work_type, average_rating, similarity }]
// UI needs: { id, title, type, rating, posterUrl }

function transformBlendItem(item: any): CarouselItem {
  return {
    id: item.work_id,
    title: item.title,
    type: item.work_type, // 'movie' or 'book'
    rating: item.average_rating,
    posterUrl: null,
  };
}
```

#### Cinematic Masterpieces (Bento Grid)

| UI Component     | API Endpoint      | Method | Notes                                   |
| ---------------- | ----------------- | ------ | --------------------------------------- |
| Bento grid items | `/movies?limit=6` | GET    | Top-rated movies (needs sort by rating) |

**API Gap:** No `sort` parameter. Current endpoint orders by title.
**Workaround:** Sort in frontend after fetching.

#### Top-Rated Masterpieces

| UI Component | API Endpoint                                 | Method | Notes                                |
| ------------ | -------------------------------------------- | ------ | ------------------------------------ |
| Top rated    | `/recommendations/blend?type=movie&limit=10` | GET    | Already sorted by similarity × score |

#### Restored Classics

| UI Component  | API Endpoint              | Method | Notes                     |
| ------------- | ------------------------- | ------ | ------------------------- |
| Classic films | `/stats/years?type=movie` | GET    | Group by year, filter old |

**Data Transformation:**

```typescript
// API returns: [{ year, count, avg_rating }]
// UI needs: Filter years < 1980, display as carousel

function getClassicYears(stats: any[]): CarouselItem[] {
  return stats
    .filter((s) => s.year < 1980)
    .map((s) => ({
      year: s.year,
      count: s.count,
      label: `${s.year} (${s.count} titles)`,
    }));
}
```

---

### 1.6 Search

| UI Component   | API Endpoint          | Method | Notes                     |
| -------------- | --------------------- | ------ | ------------------------- |
| Search input   | No dedicated endpoint | —      | Use client-side filtering |
| Search results | `/movies?title=query` | GET    | Add search param support  |
|                | `/books?title=query`  | GET    | Add search param support  |

**Missing API:**

- No search endpoint with query parameter
- `/movies` and `/books` don't support `title` query param
- Recommendation: Add `search` param to both endpoints

---

### 1.7 Ratings & Interaction

| UI Component  | API Endpoint         | Method | Notes                   |
| ------------- | -------------------- | ------ | ----------------------- |
| Rate a work   | `/ratings`           | POST   | Body: { workId, score } |
| Update rating | `/ratings/:ratingId` | PUT    | Body: { score }         |
| Remove rating | `/ratings/:ratingId` | DELETE | —                       |
| My ratings    | `/ratings`           | GET    | User's rating history   |

**Data Transformation:**

```typescript
// POST /ratings request body
const ratingRequest = {
  workId: number, // Note: camelCase in frontend, snake_case in API
  score: number, // 1-5
};

// API returns: { ratingId, workId, score, workType, title }
// UI needs: { id, workId, score, type, title, date }

function transformRating(rating: any): UserRating {
  return {
    id: rating.ratingId,
    workId: rating.workId,
    score: rating.score,
    type: rating.workType,
    title: rating.title,
    date: rating.created_at,
  };
}
```

---

### 1.8 User Stats Dashboard

| UI Component      | API Endpoint               | Method | Notes  |
| ----------------- | -------------------------- | ------ | ------ |
| Genre breakdown   | `/stats/genres?type=movie` | GET    | Movies |
|                   | `/stats/genres?type=book`  | GET    | Books  |
| Year distribution | `/stats/years?type=movie`  | GET    | Movies |
|                   | `/stats/years?type=book`   | GET    | Books  |

---

## 2. Data Transformation Summary

### Common Transformations Needed

| API Field                       | UI Field    | Transform Function                     |
| ------------------------------- | ----------- | -------------------------------------- |
| `work_id`                       | `id`        | Direct map                             |
| `work_type`                     | `type`      | `movie` → `"movie"`, `book` → `"book"` |
| `average_rating`                | `rating`    | Round to 1 decimal                     |
| `release_year`                  | `year`      | Direct map                             |
| `director_name` / `author_name` | `creator`   | Direct map                             |
| `duration`                      | `duration`  | Display as "Xh Ym"                     |
| `pages`                         | `pageCount` | Direct map                             |
| `genre_id`                      | `genreIds`  | Array of IDs for API calls             |
| `name`                          | `label`     | For genre chips                        |

### TypeScript Interfaces

```typescript
interface Movie {
  movie_id: number;
  work_id: number;
  title: string;
  release_year: number;
  duration: number;
  director_name: string;
  director_id: number;
  average_rating: number;
  genres: string[];
}

interface Book {
  book_id: number;
  work_id: number;
  title: string;
  release_year: number;
  pages: number;
  author_name: string;
  author_id: number;
  average_rating: number;
  genres: string[];
}

interface Genre {
  genre_id: number;
  name: string;
}

interface UserRating {
  rating_id: number;
  user_id: number;
  work_id: number;
  score: number;
  created_at: string;
  title: string;
  work_type: string;
}

// UI-specific interfaces
interface CarouselItem {
  id: number;
  title: string;
  year?: number;
  rating: number;
  posterUrl: string | null;
  type?: "movie" | "book";
}

interface HeroItem extends CarouselItem {
  backdropUrl: string | null;
  description?: string;
}
```

---

## 3. Missing API Endpoints

### Critical Gaps

| Endpoint                        | Purpose                              | Recommendation                            |
| ------------------------------- | ------------------------------------ | ----------------------------------------- |
| `GET /works/search?q=query`     | Unified search across books & movies | Implement new route                       |
| `GET /movies?sort=rating`       | Sort movies by rating                | Add `sort` query param                    |
| `GET /books?sort=rating`        | Sort books by rating                 | Add `sort` query param                    |
| `GET /works/:id/poster`         | Get poster image URL                 | Add poster_url to works table             |
| `GET /works/:id/backdrop`       | Get backdrop image URL               | Add backdrop_url to works table           |
| `GET /movies?genre=1,2,3`       | Filter by multiple genres            | Support comma-separated                   |
| `GET /books?genre=1,2,3`        | Filter by multiple genres            | Support comma-separated                   |
| `GET /recommendations/trending` | Global trending (non-personalized)   | New endpoint for unauthenticated homepage |
| `GET /recommendations/classics` | Restored classics                    | New endpoint or use stats/years           |

### Nice-to-Have

| Endpoint                 | Purpose                 | Recommendation        |
| ------------------------ | ----------------------- | --------------------- |
| `POST /works/:id/view`   | Track viewing history   | Future feature        |
| `GET /users/:id/ratings` | Public profile (future) | Privacy consideration |
| `GET /notifications`     | User notifications      | Implement when needed |

---

## 4. UI State Management Recommendations

### Recommended Architecture: React Query + Context

**Why React Query?**

- Automatic caching of API responses
- Loading/error states built-in
- Optimistic updates for ratings
- Prefetching for carousels

### State Structure

```typescript
// Auth Context - global user state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Cache Keys (for React Query)
const QUERY_KEYS = {
  movies: (page?: number, genre?: number) => ["movies", page, genre],
  books: (page?: number, genre?: number) => ["books", page, genre],
  genres: ["genres"],
  ratings: ["ratings"],
  recommendations: (type: string) => ["recommendations", type],
  stats: (type: string) => ["stats", type],
};
```

### Implementation Pattern

```typescript
// Example: Movies carousel hook
function useMovies(page = 1, genreId?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.movies(page, genreId),
    queryFn: () =>
      api.get(
        `/movies?page=${page}&limit=10${genreId ? `&genre=${genreId}` : ""}`,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Example: Rating mutation with optimistic update
function useRateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workId, score }: { workId: number; score: number }) =>
      api.post("/ratings", { workId, score }),
    onMutate: async ({ workId, score }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ratings });

      // Snapshot previous value
      const previousRatings = queryClient.getQueryData(QUERY_KEYS.ratings);

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.ratings, (old: any) => [
        ...old,
        { workId, score, created_at: new Date().toISOString() },
      ]);

      return { previousRatings };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(QUERY_KEYS.ratings, context?.previousRatings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings });
    },
  });
}
```

### Local UI State (useState)

```typescript
// Components needing local state:
// - Search input (debounced)
// - Active genre filter chips
- Current carousel position
- Modal open/close states
- Form inputs (login, register, rating)
```

---

## 5. Authentication Flow Integration

### Login Flow

```
1. User enters email + password
2. POST /auth/login
3. On success: Store token + user data in AuthContext
4. Redirect to Home
5. On failure: Display error message
```

```typescript
// authService.ts
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await api.post("/auth/login", { email, password });

  if (!response.token) {
    throw new Error("Login failed");
  }

  // Store token
  localStorage.setItem("auth_token", response.token);

  return {
    user: {
      id: response.userId,
      email,
      displayName: response.displayName,
    },
    token: response.token,
  };
}
```

### Token Management

```typescript
// apiClient.ts - Add auth interceptor
function createApiClient() {
  const client = axios.create({ baseURL: API_BASE_URL });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return client;
}
```

### Protected Routes

```typescript
// ProtectedRoute.tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// App.tsx routes
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
  <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
</Routes>
```

### Logout Flow

```
1. User clicks logout
2. POST /auth/logout (with token)
3. Clear local storage
4. Reset AuthContext
5. Redirect to login
```

---

## 6. Implementation Priority

### Phase 1: Core (Week 1)

1. Auth pages (login/register)
2. Home page with hero + carousels
3. Movies list page
4. Books list page

### Phase 2: Interaction (Week 2)

1. Rating modal
2. Search functionality
3. Genre filtering

### Phase 3: Enhancement (Week 3)

1. User stats dashboard
2. Recommendations refinement
3. Mobile navigation

---

## 7. Error Handling

```typescript
// API error responses
interface ApiError {
  error: string; // Error message
  status?: number;
}

// Common errors to handle
const ERROR_MESSAGES = {
  400: "Invalid request. Please check your input.",
  401: "Session expired. Please login again.",
  403: "You do not have permission for this action.",
  404: "Resource not found.",
  500: "Server error. Please try again later.",
};
```

---

## Appendix: Quick Reference

### Endpoint Summary

| Method | Path                                | Auth | Purpose                      |
| ------ | ----------------------------------- | ---- | ---------------------------- |
| POST   | /auth/login                         | No   | User login                   |
| POST   | /auth/register                      | No   | User registration            |
| POST   | /auth/logout                        | Yes  | User logout                  |
| GET    | /auth/me                            | Yes  | Current user                 |
| GET    | /movies                             | No   | List movies                  |
| GET    | /movies/:id                         | No   | Movie details                |
| GET    | /books                              | No   | List books                   |
| GET    | /books/:id                          | No   | Book details                 |
| GET    | /genres                             | No   | List genres                  |
| GET    | /ratings                            | Yes  | User's ratings               |
| POST   | /ratings                            | Yes  | Rate a work                  |
| PUT    | /ratings/:id                        | Yes  | Update rating                |
| DELETE | /ratings/:id                        | Yes  | Delete rating                |
| GET    | /stats/genres                       | Yes  | Genre statistics             |
| GET    | /stats/years                        | Yes  | Year statistics              |
| GET    | /recommendations/blend              | Yes  | Personalized recommendations |
| GET    | /recommendations/similarity/:userId | Yes  | Compare with another user    |

---

_Frontend integration guide: 2026-04-30_
