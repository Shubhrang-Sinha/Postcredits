import Link from 'next/link';
import { Button } from '@radix-ui/themes';

interface Genre {
  genre_id: number;
  name: string;
}

interface GenreFilterServerProps {
  genres: Genre[];
}

export default function GenreFilterServer({ genres }: GenreFilterServerProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link href="/books" className="no-underline">
        <Button variant="outline" size="1">
          All
        </Button>
      </Link>
      {genres.map((genre) => (
        <Link key={genre.genre_id} href={`/books?genre=${genre.genre_id}`} className="no-underline">
          <Button variant="outline" size="1">
            {genre.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}