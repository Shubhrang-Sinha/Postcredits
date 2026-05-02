import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import BookRatingClient from "./BookRatingClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="max-w-[800px] mx-auto px-6">
      <div className="bg-bg-secondary/10 border border-border-subtle/20 rounded-lg p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-text-primary">
            {book.title}
          </h1>

          <div className="flex gap-4 flex-wrap">
            <span className="text-text-secondary">
              Author: {book.author_name}
            </span>
            <span className="text-text-secondary">
              Year: {book.release_year}
            </span>
            <span className="text-text-secondary">
              Pages: {book.pages}
            </span>
          </div>

          {book.genres && book.genres.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {book.genres.map((genre) => (
                <span key={genre} className="text-text-secondary text-sm">
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border-subtle/20" />

          <div className="flex justify-between items-center">
            <span className="text-lg">Average Rating:</span>
            <StarRating
              value={Math.round(book.average_rating || 0)}
              readonly
              size="medium"
            />
          </div>

          <div className="mt-4">
            <BookRatingClient workId={book.work_id} />
          </div>
        </div>
      </div>
    </main>
  );
}