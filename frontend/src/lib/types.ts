export interface MediaItem {
  movieId?: number;
  bookId?: number;
  workId: number;
  title: string;
  releaseYear: number;
  averageRating: number;
  director?: string;
  author?: string;
  genres: string[];
}

export interface Recommendation {
  workId: number;
  title: string;
  type?: string;
  averageRating: number;
  releaseYear?: number;
  similarity?: number;
  sourceUserId?: number;
}
