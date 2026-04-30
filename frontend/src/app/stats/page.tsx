'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import StatsChart from '@/components/StatsChart';
import { Flex, Heading, Text, Tabs, Box, Spinner } from '@radix-ui/themes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface GenreStat {
  genre: string;
  count: number;
}

interface YearStat {
  year: number;
  count: number;
  avg_rating: number;
}

function StatsContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [movieGenres, setMovieGenres] = useState<GenreStat[]>([]);
  const [bookGenres, setBookGenres] = useState<GenreStat[]>([]);
  const [movieYears, setMovieYears] = useState<YearStat[]>([]);
  const [bookYears, setBookYears] = useState<YearStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!isAuthenticated) return;
      
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const requestOptions: RequestInit = { headers: { 'Authorization': `Bearer ${token}` } };

      try {
        const [movieGenresRes, bookGenresRes, movieYearsRes, bookYearsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/genres?type=movie`, requestOptions),
          fetch(`${API_BASE_URL}/stats/genres?type=book`, requestOptions),
          fetch(`${API_BASE_URL}/stats/years?type=movie`, requestOptions),
          fetch(`${API_BASE_URL}/stats/years?type=book`, requestOptions),
        ]);
        
        if (movieGenresRes.ok) setMovieGenres(await movieGenresRes.json());
        if (bookGenresRes.ok) setBookGenres(await bookGenresRes.json());
        if (movieYearsRes.ok) setMovieYears(await movieYearsRes.json());
        if (bookYearsRes.ok) setBookYears(await bookYearsRes.json());
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (isLoading || loading) {
    return (
      <Box className="flex justify-center p-8">
        <Spinner size="3" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const movieGenreData = movieGenres.map(g => ({ label: g.genre, value: g.count }));
  const bookGenreData = bookGenres.map(g => ({ label: g.genre, value: g.count }));
  const movieYearData = movieYears
    .filter(y => y.count > 0)
    .map(y => ({ label: y.year.toString(), value: y.count }));
  const bookYearData = bookYears
    .filter(y => y.count > 0)
    .map(y => ({ label: y.year.toString(), value: y.count }));
  
  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Heading size="8" mb="2" className="text-white">Spotistats</Heading>
      <Text size="3" color="gray" mb="6" className="block">Your viewing and reading statistics</Text>
      
      <Tabs.Root defaultValue="movies" className="mt-4">
        <Tabs.List>
          <Tabs.Trigger value="movies" className="px-4">Movies</Tabs.Trigger>
          <Tabs.Trigger value="books" className="px-4">Books</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="movies">
          <Flex direction="column" gap="6" mt="6">
            <StatsChart 
              title="Movies by Genre" 
              data={movieGenreData}
              color="#06b6d4"
            />
            <StatsChart 
              title="Movies by Year" 
              data={movieYearData}
              color="#8b5cf6"
            />
          </Flex>
        </Tabs.Content>
        
        <Tabs.Content value="books">
          <Flex direction="column" gap="6" mt="6">
            <StatsChart 
              title="Books by Genre" 
              data={bookGenreData}
              color="#10b981"
            />
            <StatsChart 
              title="Books by Year" 
              data={bookYearData}
              color="#f59e0b"
            />
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}

export default StatsContent;