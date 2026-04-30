'use client';

import { useState } from 'react';
import { Button, Flex, Text, Box } from '@radix-ui/themes';
import MediaCard from './MediaCard';

interface Recommendation {
  work_id: number;
  title: string;
  work_type: string;
  average_rating: number;
  release_year?: number;
  similarity?: number;
}

interface RecommendationCarouselProps {
  title: string;
  recommendations: Recommendation[];
}

export default function RecommendationCarousel({ title, recommendations }: RecommendationCarouselProps) {
  const [index, setIndex] = useState(0);
  const itemsPerPage = 4;
  
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const currentItems = recommendations.slice(index * itemsPerPage, (index + 1) * itemsPerPage);
  
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box className="mb-8">
      <Flex justify="between" align="center" mb="4" className="flex flex-wrap gap-4">
        <Text size="5" weight="bold" className="text-white">{title}</Text>
        <Flex gap="2" align="center">
          <Button 
            variant="outline" 
            size="1"
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
          >
            ‹
          </Button>
          <Text size="2" className="min-w-[60px] text-center text-gray-400">
            {index + 1} / {totalPages}
          </Text>
          <Button 
            variant="outline" 
            size="1"
            onClick={() => setIndex(Math.min(totalPages - 1, index + 1))}
            disabled={index >= totalPages - 1}
          >
            ›
          </Button>
        </Flex>
      </Flex>
      
      <Flex gap="4" wrap="wrap">
        {currentItems.map((rec) => (
          <MediaCard
            key={rec.work_id}
            id={rec.work_id}
            title={rec.title}
            year={rec.release_year}
            rating={rec.average_rating}
            type={rec.work_type as 'movie' | 'book'}
          />
        ))}
      </Flex>
    </Box>
  );
}