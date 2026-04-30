import Link from 'next/link';

interface MediaCardProps {
  id: number;
  title: string;
  year?: number;
  rating?: number;
  type: 'movie' | 'book';
  creator?: string;
  genres?: string[];
}

export default function MediaCard({ id, title, year, rating, type, creator, genres }: MediaCardProps) {
  const href = `/${type === 'movie' ? 'movies' : 'books'}/${id}`;
  
  return (
    <Link href={href} className="block">
      <div className="bg-[#261d1d]/60 backdrop-blur-sm rounded-xl border border-[#3d4a3d]/30 p-4 hover:border-[#53e076]/50 hover:bg-[#312828]/60 transition-all duration-200 cursor-pointer group">
        {/* Poster placeholder */}
        <div className="h-32 bg-gradient-to-br from-[#191111] to-[#261d1d] rounded-lg flex items-center justify-center mb-3 group-hover:from-[#1db954]/10 group-hover:to-[#261d1d] transition-colors">
          <span className="text-4xl opacity-40">
            {type === 'movie' ? '🎬' : '📚'}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-white font-semibold text-sm truncate mb-1">
          {title}
        </h3>
        
        {/* Year and creator */}
        <div className="text-[#bccbb9] text-xs mb-2">
          {year && <span>{year}</span>}
          {year && creator && <span className="mx-1">•</span>}
          {creator && <span className="truncate">{creator}</span>}
        </div>
        
        {/* Rating */}
        {rating !== undefined && rating > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[#53e076] text-xs">★</span>
            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="text-[#869585] text-xs mt-2 truncate">
            {genres.slice(0, 2).join(', ')}
          </div>
        )}
      </div>
    </Link>
  );
}