import Link from 'next/link';
import { Card, Text, Flex, Box } from '@radix-ui/themes';

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
  const icon = type === 'movie' ? '🎬' : '📚';
  
  return (
    <Link href={href}>
      <Card size="2" className="w-[200px] cursor-pointer bg-white/5 border border-white/10 hover:border-[#53e076] transition-colors">
        <Flex direction="column" gap="2">
          <Box className="h-40 bg-white/10 rounded flex items-center justify-center">
            <Text size="9" color="gray">{icon}</Text>
          </Box>
          <Text weight="bold" size="3" trim="start" className="truncate">
            {title}
          </Text>
          {year && (
            <Text size="2" color="gray">{year}</Text>
          )}
          {creator && (
            <Text size="2" color="gray" className="truncate">{creator}</Text>
          )}
          {rating && (
            <Text size="2">⭐ {rating.toFixed(1)}</Text>
          )}
          {genres && genres.length > 0 && (
            <Text size="1" color="gray" className="truncate">
              {genres.slice(0, 2).join(', ')}
            </Text>
          )}
        </Flex>
      </Card>
    </Link>
  );
}