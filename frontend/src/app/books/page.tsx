import MediaCard from "@/components/MediaCard";
import GenreFilterServer from "./GenreFilterServer";

export const dynamic = 'force-static';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Book {
  bookId: number;
  workId: number;
  title: string;
  releaseYear: number;
  pages: number;
  author: string;
  averageRating: number;
  genres: string[];
}

interface Genre {
  genreId: number;
  name: string;
}

async function getBooks(genreId?: number): Promise<Book[]> {
  const url = genreId
    ? `${API_BASE_URL}/books?genre=${genreId}`
    : `${API_BASE_URL}/books`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const genreId = genre ? parseInt(genre) : undefined;
  const [books, genres] = await Promise.all([getBooks(genreId), getGenres()]);

  const bookGenres = genres.filter(
    (g: Genre) => g.name.toLowerCase() !== "movie",
  );

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-white mb-6">Books</h1>

      <GenreFilterServer genres={bookGenres} />

      {books.length === 0 ? (
        <div className="p-8 text-center text-[#bccbb9]">No books found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <MediaCard
              key={book.bookId}
              id={book.workId}
              title={book.title}
              year={book.releaseYear}
              rating={book.averageRating}
              type="book"
              creator={book.author}
              genres={book.genres}
            />
          ))}
        </div>
      )}
    </main>
  );
}
