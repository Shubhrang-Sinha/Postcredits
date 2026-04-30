import api from '@/lib/api';
import MediaCard from '@/components/MediaCard';
import { Flex, Heading, Text, Box } from '@radix-ui/themes';
import GenreFilterServer from './GenreFilterServer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Book {
  book_id: number;
  work_id: number;
  title: string;
  release_year: number;
  pages: number;
  author_name: string;
  average_rating: number;
  genres: string[];
}

interface Genre {
  genre_id: number;
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
  searchParams: { genre?: string };
}) {
  const genreId = searchParams.genre ? parseInt(searchParams.genre) : undefined;
  const [books, genres] = await Promise.all([
    getBooks(genreId),
    getGenres(),
  ]);

  const bookGenres = genres.filter((g: Genre) => g.name.toLowerCase() !== 'movie');

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Heading size="8" mb="4" className="text-white">Books</Heading>
      
      <GenreFilterServer genres={bookGenres} />
      
      {books.length === 0 ? (
        <Box className="p-8 text-center text-gray-400">
          <Text>No books found</Text>
        </Box>
      ) : (
        <Flex gap="4" wrap="wrap">
          {books.map((book) => (
            <MediaCard
              key={book.book_id}
              id={book.work_id}
              title={book.title}
              year={book.release_year}
              rating={book.average_rating}
              type="book"
              creator={book.author_name}
              genres={book.genres}
            />
          ))}
        </Flex>
      )}
    </main>
  );
}