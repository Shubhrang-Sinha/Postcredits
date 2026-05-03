import Link from "next/link";

interface MediaCardProps {
  id: number;
  title: string;
  year?: number;
  rating?: number;
  type: "movie" | "book";
  creator?: string;
  genres?: string[];
}

export default function MediaCard({
  id,
  title,
  year,
  rating,
  type,
  creator,
  genres,
}: MediaCardProps) {
  const href = `/${type === "movie" ? "movies" : "books"}/${id}`;

  return (
    <Link href={href} className="block">
      <div className="bg-bg-secondary/60 backdrop-blur-sm rounded-xl border border-border-subtle/30 p-4 hover:border-accent/50 hover:bg-bg-tertiary/60 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer group">
        {/* Poster placeholder */}
        <div className="h-32 bg-gradient-to-br from-bg-primary to-bg-secondary rounded-lg flex items-center justify-center mb-3 group-hover:from-accent-hover/10 group-hover:to-bg-secondary transition-colors">
          <span className="text-4xl opacity-40">
            {type === "movie" ? "🎬" : "📚"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-text-primary font-semibold text-sm truncate mb-1">
          {title}
        </h3>

        {/* Year and creator */}
        <div className="text-text-secondary text-xs mb-2">
          {year && <span>{year}</span>}
          {year && creator && <span className="mx-1">•</span>}
          {creator && <span className="truncate">{creator}</span>}
        </div>

        {/* Rating */}
        {rating !== undefined && rating > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-accent text-xs">★</span>
            <span className="text-text-primary text-xs font-medium">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="text-border-subtle text-xs mt-2 truncate">
            {genres.slice(0, 2).join(", ")}
          </div>
        )}
      </div>
    </Link>
  );
}
